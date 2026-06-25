---
name: create-page
description: Tạo trang mới (page) trong một module React và đăng ký route tập trung ở app/router. Dùng skill này khi người dùng yêu cầu "tạo trang mới", "thêm page", "tạo màn hình mới", hoặc khi cần thêm 1 URL/route mới vào ứng dụng. Luôn dùng skill này khi tạo trang, kể cả khi yêu cầu chỉ nói "thêm route mới" — vì tạo route luôn đi kèm tạo trang và phải đăng ký ở app/router/routes.ts.
---

# Tạo trang mới (Page)

Trang luôn nằm **trong module sở hữu nó**, không có thư mục `pages/` chung ở ngoài. Route được khai báo **tập trung** ở `app/router/`, module không tự định nghĩa route của mình.

## Cấu trúc

```
src/modules/<tenModule>/pages/
└── <TenTrang>/
    ├── index.tsx          # component trang
    └── style.scss         # (tùy chọn) chỉ tạo nếu trang có style riêng, không dùng chung
```

Mỗi trang là **một folder riêng** theo tên trang viết PascalCase (vd: `BookingDetail/`, `SignIn/`), bên trong là `index.tsx`. Đây khác với quy tắc component thông thường (xem skill `create-component`) — trang luôn dùng folder, không có dạng file rời.

## Quy trình tạo trang

1. **Xác định module sở hữu trang.** Nếu module chưa tồn tại, dừng lại và dùng skill `create-module` trước.

2. **Tạo file `index.tsx`** trong `src/modules/<tenModule>/pages/<TenTrang>/`:
   - Trang là nơi **lắp ráp** (compose) các component và hook, không chứa logic nghiệp vụ phức tạp trực tiếp trong nó. Logic gọi API/state nằm trong hook riêng (`hooks/use<TenTrang>.ts` hoặc tương đương) được trang gọi vào.
   - Import component từ `components/` của module hoặc từ `shared/components/` khi cần UI tái sử dụng.

3. **Tạo `style.scss` cùng cấp nếu trang cần CSS riêng** (không dùng chung với component con). Import biến dùng `@use 'variables' as *` trỏ về `src/_variables.scss` (chỉnh đường dẫn tương đối theo độ sâu thư mục).

4. **Đăng ký route ở `app/router`** — đây là bước **bắt buộc**, không được bỏ qua:
   - Mở `src/app/router/routes.ts`, thêm entry route mới trỏ tới component vừa tạo.
   - Import component trang vào `src/app/router/Router.tsx` (hoặc file router chính) theo đúng cách các route khác đang import.
   - Nếu trang yêu cầu đăng nhập, dùng `ProtectedRoute` (xem `app/router/ProtectedRoute.tsx`) bọc route đó, theo đúng pattern các route bảo vệ khác trong file.
   - Nếu trang dùng layout riêng (vd: `AuthLayout`, `WebLayout`), đặt route đó lồng trong layout tương ứng theo cấu trúc route hiện có — không tạo layout mới trừ khi được yêu cầu rõ.

5. Toàn bộ code, comment, và text hiển thị trên trang đều viết **tiếng Việt**.

## Ví dụ

**Input:** "Tạo trang chi tiết đơn hàng cho module order, route là /orders/:id, cần đăng nhập mới xem được"

**Output:**
```
src/modules/order/pages/OrderDetail/
├── index.tsx
└── style.scss
```
Trong `index.tsx`: component `OrderDetail` gọi hook `useOrderDetail(id)` để lấy dữ liệu, lấy `id` từ `useParams()` của react-router, render bằng antd (`Card`, `Descriptions`...).

Trong `app/router/routes.ts`: thêm route `/orders/:id` trỏ tới `OrderDetail`, bọc trong `ProtectedRoute` vì yêu cầu đăng nhập.

## Lỗi thường gặp cần tránh

- **Không** tạo route khai báo rải trong module — mọi route phải tập trung ở `app/router`.
- **Không** đặt logic gọi API trực tiếp trong file `index.tsx` của trang — tách ra hook riêng để dễ test và tái sử dụng.
- **Không** quên bọc `ProtectedRoute` nếu trang yêu cầu xác thực — kiểm tra các route tương tự trong module khác (vd: trang trong `user/pages/`) để biết trang đó có cần bảo vệ không.