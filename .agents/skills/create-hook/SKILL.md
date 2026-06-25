---
name: create-hook
description: Tạo custom React hook (gọi API qua TanStack Query, hoặc hook xử lý logic/state thông thường) theo quy ước của dự án. Dùng skill này khi người dùng yêu cầu "tạo hook", "viết hook mới", "thêm logic gọi API cho một module", hoặc khi cần tách logic ra khỏi component/page thành hook riêng. Áp dụng cho cả hook ở module (modules/[ten-module]/hooks/) và hook dùng chung (shared/hooks/).
---

# Tạo custom hook

Hook là nơi chứa logic gọi API, xử lý state phức tạp, hoặc hành vi tái sử dụng — component/page không gọi API hoặc xử lý logic trực tiếp, mà gọi qua hook.

## Vị trí và đặt tên

- Hook chỉ dùng trong 1 module → `src/modules/<module>/hooks/use<Ten>.ts`
- Hook dùng chung nhiều module → `src/shared/hooks/use<Ten>.ts`
- Tên file và tên hàm đều bắt đầu bằng `use`, PascalCase phần sau: `useBookingDetail.ts` export hàm `useBookingDetail`.
- Nếu không chắc hook nên nằm ở module hay shared, xem mục "Khi nào đưa hook lên shared" trong skill `refactor`. Quy tắc nhanh: nếu hook chỉ liên quan tới nghiệp vụ của 1 module, để ở module; nếu là logic kỹ thuật/UI chung (debounce, click outside, window size...), để ở `shared`.

## Phân loại hook và pattern tương ứng

### A. Hook gọi API (dùng TanStack Query)

Project dùng `@tanstack/react-query`. Query key luôn lấy từ `constants/queryKeys.ts` của module, không viết key trực tiếp trong hook.

**A1. Lấy 1 item theo id (`useQuery`)**

```typescript
import { useQuery } from "@tanstack/react-query";
import { <module>Api } from "../api/<module>.api";
import { <MODULE>_QUERY_KEYS } from "../constants/queryKeys";

export const use<Ten>Detail = (id?: string) => {
  const query = useQuery({
    queryKey: <MODULE>_QUERY_KEYS.detail(id ?? ""),
    queryFn: () => <module>Api.getById(id as string),
    enabled: Boolean(id),
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    isFetching: query.isFetching,
    refetch: query.refetch,
  };
};
```

**A2. Danh sách phân trang/infinite scroll (`useInfiniteQuery`)** — kết hợp URL search params để lưu trạng thái filter:

```typescript
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { <module>Api, type <Module>QueryFilter } from "../api/<module>.api";
import { <MODULE>_QUERY_KEYS } from "../constants/queryKeys";

export const use<Ten>List = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filter: <Module>QueryFilter = {
    keyword: searchParams.get("keyword") ?? undefined,
    page: Number(searchParams.get("page")) || 1,
  };

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, isError, refetch } =
    useInfiniteQuery({
      queryKey: <MODULE>_QUERY_KEYS.list(filter),
      queryFn: ({ pageParam = 1 }) => <module>Api.getAll({ ...filter, page: pageParam }),
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        const currentPage = Number(lastPage.meta.page) || 1;
        const totalPages = Number(lastPage.meta.totalPages) || 1;
        return currentPage < totalPages ? currentPage + 1 : undefined;
      },
      placeholderData: keepPreviousData,
    });

  const items = data?.pages.flatMap((page) => page.data) ?? [];
  const isEmpty = !isLoading && !isError && items.length === 0;

  const updateFilter = useCallback(
    (newFilter: <Module>QueryFilter) => {
      const nextParams = new URLSearchParams();
      Object.entries(newFilter).forEach(([key, value]) => {
        if (value !== undefined && value !== "" && key !== "page") {
          nextParams.set(key, String(value));
        }
      });
      setSearchParams(nextParams, { replace: true, preventScrollReset: true });
    },
    [setSearchParams],
  );

  return { items, isEmpty, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, isError, refetch, filter, updateFilter };
};
```

**A3. Mutation cập nhật cache trực tiếp** (toggle, like/unlike...):

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { <module>Api } from "../api/<module>.api";
import { <MODULE>_QUERY_KEYS } from "../constants/queryKeys";
import { useAuth } from "@/modules/auth/hooks/useAuth";

export const useToggle<Ten> = (id: string | number, initialState: boolean) => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  const mutation = useMutation({
    mutationFn: () => <module>Api.toggle(id),
    onSuccess: (response) => {
      queryClient.setQueryData(
        <MODULE>_QUERY_KEYS.detail(id),
        (current: <Module>Detail | undefined) =>
          current ? { ...current, isActive: response.isActive } : current,
      );
      void queryClient.invalidateQueries({ queryKey: <MODULE>_QUERY_KEYS.all });
    },
  });

  const handleToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (!isAuthenticated) {
      message.info("Vui lòng đăng nhập để thực hiện thao tác này!");
      return;
    }
    mutation.mutateAsync()
      .then(() => message.success("Cập nhật thành công!"))
      .catch(() => message.error("Đã có lỗi xảy ra. Vui lòng thử lại!"));
  };

  return { handleToggle, isToggling: mutation.isPending, currentState: mutation.data?.isActive ?? initialState };
};
```

**A4. Mutation tạo/sửa kèm điều hướng:**

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { ROUTER_PATH } from "@/app/router/routes";
import { <module>Api } from "../api/<module>.api";
import { <MODULE>_QUERY_KEYS } from "../constants/queryKeys";
import type { Create<Module>Request } from "../types";

export const useCreate<Ten> = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (payload: Create<Module>Request) => <module>Api.create(payload),
    onSuccess: () => {
      message.success("Tạo thành công!");
      void queryClient.invalidateQueries({ queryKey: <MODULE>_QUERY_KEYS.all });
      navigate(ROUTER_PATH.<MODULE_LIST>);
    },
    onError: () => message.error("Đã có lỗi xảy ra. Vui lòng thử lại!"),
  });

  return { create: mutation.mutateAsync, isCreating: mutation.isPending };
};
```

**Quy ước query key** (`constants/queryKeys.ts`):

```typescript
export const <MODULE>_QUERY_KEYS = {
  all: ["<module>"] as const,
  list: (filter?: <FilterType>) => ["<module>", "list", ...Object.values(filter ?? {})] as const,
  detail: (id: string | number) => ["<module>", "detail", id] as const,
};
```

Key phải dùng tuple `as const`, bao gồm **mọi** tham số ảnh hưởng tới kết quả request — thiếu tham số trong key dễ gây bug cache trả sai dữ liệu.

### B. Hook logic/state thông thường (không gọi API)

Dùng cho hành vi UI hoặc logic tái sử dụng không liên quan tới server state — ví dụ debounce, theo dõi kích thước màn hình, quản lý form step nhiều bước, đồng bộ giá trị với localStorage...

```typescript
import { useEffect, useState } from "react";

export const use<Ten> = (/* tham số đầu vào */) => {
  const [state, setState] = useState(/* giá trị khởi tạo */);

  useEffect(() => {
    // logic side effect nếu cần
  }, [/* dependency */]);

  return { state, /* các hàm xử lý */ };
};
```

Hook loại này **không** dùng `useQuery`/`useMutation`. Nếu thấy mình đang fetch dữ liệu từ server trong `useEffect`, đó là dấu hiệu nên chuyển sang Pattern A (TanStack Query) thay vì tự quản lý loading/error bằng `useState`.

## Quy tắc chung khi viết hook

- API luôn gọi qua file `api/<module>.api.ts` (**xem skill `create-api`**), không gọi `axiosClient` trực tiếp trong hook.
- Hook trả về object có tên rõ nghĩa (`isLoading`, `data`, `handleSubmit`...), không trả thẳng object query gốc của TanStack Query ra ngoài — component không nên biết hook bên trong dùng TanStack Query hay cách khác.
- Thông báo lỗi/thành công dùng `message` từ `antd`, không dùng `alert()`.
- Toàn bộ message hiển thị và comment trong code viết **tiếng Việt**.
- Mutation yêu cầu đăng nhập phải kiểm tra qua `useAuth` trước khi gọi `mutate`/`mutateAsync`.
- Không dùng `any` cho dữ liệu cache — khai báo type cụ thể từ `types.ts` của module.

## Sau khi tạo hook

Nếu hook dùng trong nhiều hơn 1 module, xem skill `refactor` để quyết định có nên chuyển lên `shared/hooks/` không.
