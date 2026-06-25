---
name: create-api
description: Tạo API flow (endpoints, axios request, types/DTOs) cho một module hoặc shared services. Dùng skill này khi cần kết nối frontend với backend API.
---

# Hướng dẫn tạo API Flow

Khi người dùng yêu cầu "tạo API", "viết logic gọi API", hoặc "kết nối API cho chức năng X", hãy tuân thủ các quy tắc sau để đảm bảo tính nhất quán trong kiến trúc API của dự án.

## 1. Cấu trúc thư mục API

Mỗi module sẽ có thư mục `api/` và `types/` (nếu cần định nghĩa DTOs).

```txt
src/modules/<ten-module>/
├── api/
│   ├── <ten-module>.api.ts       # Chứa các hàm gọi API sử dụng axios
│   └── <ten-module>.endpoints.ts # Chứa hằng số định nghĩa đường dẫn API
├── types/
│   └── <ten-module>.type.ts      # Định nghĩa các interface/type cho request và response
```

## 2. Quy tắc định nghĩa Endpoints (`.endpoints.ts`)

- KHÔNG hardcode URL trong các file gọi API.
- Gom tất cả đường dẫn API của một module vào file `endpoints.ts`.
- Sử dụng đối tượng hằng số (`const`).

**Ví dụ:**
```typescript
export const PRODUCT_ENDPOINTS = {
  GET_ALL: '/products',
  GET_DETAIL: (id: string | number) => `/products/${id}`,
  CREATE: '/products',
  UPDATE: (id: string | number) => `/products/${id}`,
  DELETE: (id: string | number) => `/products/${id}`,
};
```

## 3. Quy tắc định nghĩa Types/DTOs (`.type.ts`)

- Tái sử dụng type hiện có nếu có thể.
- Định nghĩa rõ ràng Input (Request) và Output (Response) nếu API yêu cầu payload phức tạp.
- Sử dụng chuẩn TypeScript interfaces/types.

**Ví dụ:**
```typescript
export interface IProduct {
  id: string;
  name: string;
  price: number;
}

export interface ICreateProductPayload {
  name: string;
  price: number;
}
```

## 4. Quy tắc viết hàm gọi API (`.api.ts`)

- TUYỆT ĐỐI KHÔNG dùng axios hoặc fetch trực tiếp từ thư viện. Luôn sử dụng axios instance (thường là `axiosClient`) từ `shared/services/axiosClient.ts` hoặc tương đương.
- Import các endpoints từ file `.endpoints.ts`.
- Các hàm gọi API nên trả về `Promise` với kiểu dữ liệu chính xác.

**Ví dụ:**
```typescript
import axiosClient from '@/shared/services/axiosClient';
import { PRODUCT_ENDPOINTS } from './product.endpoints';
import type { IProduct, ICreateProductPayload } from '../types/product.type';

export const productApi = {
  getAll: (): Promise<IProduct[]> => {
    return axiosClient.get(PRODUCT_ENDPOINTS.GET_ALL);
  },

  getDetail: (id: string): Promise<IProduct> => {
    return axiosClient.get(PRODUCT_ENDPOINTS.GET_DETAIL(id));
  },

  create: (data: ICreateProductPayload): Promise<IProduct> => {
    return axiosClient.post(PRODUCT_ENDPOINTS.CREATE, data);
  },
};
```

## 5. Tích hợp React Query

- Sau khi tạo API, TỰ ĐỘNG GỢI Ý người dùng tạo React Query Hooks (`useQuery`, `useMutation`) thông qua skill `create-hook` để gọi các hàm từ `api.ts` này trong UI. KHÔNG dùng API thẳng trong UI qua `useEffect`.
