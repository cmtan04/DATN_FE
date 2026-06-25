---
name: create-store
description: Tạo Zustand store cho state phức tạp hoặc dùng chung ở nhiều nơi (filter, giỏ hàng, danh sách thông báo, state UI nhiều bước...). Dùng skill này khi người dùng yêu cầu "tạo store", "thêm zustand store", "quản lý state mới", hoặc khi state cần chia sẻ thay đổi liên tục/phức tạp hơn mức Context xử lý tốt. Nếu state chỉ là theme/user/language hoặc ít thay đổi, dùng skill create-context-provider thay vì skill này.
---

# Tạo Zustand store

Dự án dùng Zustand cho state **phức tạp hoặc cần dùng ở nhiều nơi**, khác với Context (chỉ dùng cho theme/user/language — state ít thay đổi). Xem mục "Context hay Zustand" trong skill `create-context-provider` nếu chưa chắc nên chọn cái nào.

## Vị trí và đặt tên

- Store dùng chung nhiều module → `src/shared/stores/<ten>.store.ts`
- Store chỉ dùng trong 1 module → `src/modules/<module>/store/<ten>.store.ts`
- Tên file luôn dạng `<ten>.store.ts`, viết thường/camelCase (vd: `notification.store.ts`, `bookingFilter.store.ts`).

Nếu không chắc store nên ở module hay shared, mặc định tạo ở module trước — chỉ chuyển lên `shared/stores/` khi có module thứ 2 thực sự cần dùng đến (xem skill `refactor`). Tránh đặt lên `shared` "phòng trường hợp sau cần", vì điều đó làm tăng phạm vi ảnh hưởng không cần thiết.

## Pattern cơ bản

```typescript
// src/shared/stores/notification.store.ts
import { create } from "zustand";

interface Notification {
  id: string;
  message: string;
  isRead: boolean;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,

  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    })),

  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((item) =>
        item.id === id ? { ...item, isRead: true } : item,
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    })),

  clearAll: () => set({ notifications: [], unreadCount: 0 }),
}));
```

Tên hook truy cập store luôn là `use<Ten>Store` (vd: `useNotificationStore`), kể cả khi tên file là `<ten>.store.ts` không có "use" — đây là điểm khác biệt có chủ ý giữa tên file (mô tả loại file) và tên export (theo quy ước hook React).

## Chọn state khi dùng trong component — tránh re-render thừa

Không destructure cả store nếu component chỉ cần 1-2 field, vì sẽ re-render mỗi khi *bất kỳ* field nào trong store đổi:

```typescript
// Tránh — re-render khi bất kỳ field nào trong store đổi
const { notifications, unreadCount, addNotification } = useNotificationStore();

// Nên — chỉ re-render khi unreadCount đổi
const unreadCount = useNotificationStore((state) => state.unreadCount);
```

Dùng cách destructure cả store chỉ khi component thực sự cần hầu hết các field, hoặc khi store nhỏ và ít thay đổi.

## Pattern: store có async action (gọi API trong store)

Một số store cần tự gọi API (khác với TanStack Query, dùng khi state cần giữ lâu dài qua nhiều trang, không chỉ là cache server data):

```typescript
interface CartState {
  items: CartItem[];
  isSyncing: boolean;
  syncCart: () => Promise<void>;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  isSyncing: false,

  syncCart: async () => {
    set({ isSyncing: true });
    try {
      const items = await cartApi.getCart();
      set({ items, isSyncing: false });
    } catch {
      set({ isSyncing: false });
      message.error("Không thể đồng bộ giỏ hàng. Vui lòng thử lại!");
    }
  },
}));
```

Nếu dữ liệu chủ yếu là **server state** (dữ liệu gốc từ API, cần cache/refetch/invalidate theo chuẩn), ưu tiên TanStack Query (skill `create-hook`) hơn là tự quản lý bằng Zustand — Zustand phù hợp hơn cho **client state** (state chỉ tồn tại ở phía client, không đại diện cho dữ liệu server).

## Pattern: chia store thành slice khi store lớn

Nếu store có nhiều nhóm logic độc lập, tách thành slice rồi gộp lại để file không phình to:

```typescript
interface FilterSlice {
  keyword: string;
  setKeyword: (keyword: string) => void;
}

interface SortSlice {
  sortBy: string;
  setSortBy: (sortBy: string) => void;
}

const createFilterSlice = (set: any): FilterSlice => ({
  keyword: "",
  setKeyword: (keyword) => set({ keyword }),
});

const createSortSlice = (set: any): SortSlice => ({
  sortBy: "newest",
  setSortBy: (sortBy) => set({ sortBy }),
});

export const useLocationFilterStore = create<FilterSlice & SortSlice>((set, get, api) => ({
  ...createFilterSlice(set),
  ...createSortSlice(set),
}));
```

Chỉ áp dụng pattern này khi store thực sự lớn (nhiều hơn ~6-8 field/action) — với store nhỏ, pattern cơ bản ở trên là đủ và dễ đọc hơn.

## Quy tắc chung

- Đặt tên action rõ hành động (`addNotification`, `markAsRead`), không đặt tên mơ hồ (`update`, `set`).
- Không lưu dữ liệu server thuần túy (kết quả fetch từ API mà không cần cache/refetch logic riêng) vào Zustand — đó là việc của TanStack Query.
- Reset store khi cần (vd: lúc logout) bằng action `reset`/`clearAll` rõ ràng, không dựa vào unmount component.
- Comment và message lỗi viết **tiếng Việt**.
- Không dùng `any` cho state — định nghĩa interface rõ ràng như ví dụ trên (trừ phần `set: any` trong slice pattern do hạn chế kiểu của Zustand, có thể thay bằng kiểu `StateCreator` nếu cần chặt hơn).

## Ví dụ

**Input:** "Tạo store quản lý filter cho danh sách location, gồm keyword, khoảng giá, khu vực — dùng ở nhiều component trong module location"

**Output:** Tạo `src/modules/location/store/locationFilter.store.ts` (module-level, vì chỉ module `location` dùng), export `useLocationFilterStore` với state `keyword`, `priceRange`, `area` và action `setKeyword`, `setPriceRange`, `setArea`, `resetFilter`.