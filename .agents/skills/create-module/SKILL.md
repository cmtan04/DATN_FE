---
name: create-module
description: Tạo module mới cho dự án React (kiến trúc app-modules-shared, TypeScript, antd, scss). Dùng skill này bất cứ khi nào người dùng yêu cầu "tạo module mới", "thêm module mới cho một tính năng", "khởi tạo feature mới", hoặc khi một yêu cầu lớn (ví dụ "làm chức năng đặt phòng", "thêm trang quản lý đơn hàng") rõ ràng cần một module hoàn toàn mới chứ không phải chỉnh sửa module có sẵn. Luôn dùng skill này trước khi tạo bất kỳ file con (component/hook/api/page) cho một module chưa tồn tại trong modules/.
---

# Tạo module mới

Module là đơn vị tổ chức code theo tính năng (feature) trong kiến trúc `app-modules-shared`. Mỗi module sống độc lập trong `src/modules/<tenModule>/` và chỉ export ra ngoài những gì module khác thực sự cần dùng.

## Khi nào tạo module mới

Tạo module mới khi yêu cầu là một **tính năng/nghiệp vụ độc lập** (ví dụ: `booking`, `review`, `notification`) — không phải khi chỉ cần thêm 1 component hay 1 hook vào module đã có sẵn. Nếu không chắc tính năng có nên là module riêng hay nên nằm trong module hiện tại, hỏi người dùng trước khi tạo cấu trúc mới.

## Cấu trúc chuẩn

Module **không** bắt buộc phải có đủ mọi thư mục con — chỉ tạo những gì module thực sự cần. Cấu trúc đầy đủ tham khảo:

```
src/modules/<tenModule>/
├── index.ts                 # (tùy chọn) barrel export — chỉ thêm khi module khác cần import từ đây
├── types.ts                 # (tùy chọn) type/interface dùng chung trong toàn module
├── api/
│   ├── <tenModule>.api.ts          # bắt buộc nếu module gọi API — chứa hàm gọi request
│   └── <tenModule>.endpoints.ts    # bắt buộc cùng với .api.ts — định nghĩa các URL endpoint
│   └── <tenModule>.errors.ts       # tùy chọn — chỉ thêm khi module có logic xử lý lỗi đặc thù
├── components/               # component chỉ dùng trong module này
├── constants/
│   ├── queryKeys.ts          # tách riêng nếu module dùng TanStack Query
│   └── <tenModule>.ts        # các hằng số nghiệp vụ khác
├── context/
│   └── <tenModule>.context.ts      # chỉ tạo khi module cần React Context riêng
├── hooks/
│   └── use<Ten>.ts
├── pages/
│   └── <TenTrang>/index.tsx        # mỗi trang là 1 folder, xem skill create-page
├── store/
│   └── <ten>.store.ts        # chỉ tạo khi module cần Zustand store riêng (state phức tạp)
└── utils/
    └── <tenModule><MucDich>.ts     # vd: bookingValidators.ts, bookingFormatters.ts
```

**Quy tắc đặt tên:** tên thư mục module viết thường, camelCase nếu nhiều từ (vd: `userBooking`, không phải `user-booking` hay `UserBooking`).

## Quy trình tạo module

1. **Xác nhận phạm vi module** — nếu người dùng chỉ nói "tạo module đặt phòng", hỏi nhanh module này cần những phần nào (có gọi API không? có cần Context/Zustand riêng không? có bao nhiêu trang?) trước khi tạo hết thư mục con. Đừng tạo sẵn thư mục rỗng cho phần chưa cần dùng.

2. **Tạo thư mục con theo nhu cầu thực tế**, không tạo đủ bộ máy móc. Một module đơn giản (chỉ hiển thị, không gọi API riêng) có thể chỉ cần `components/` và `pages/`.

3. **Nếu module cần gọi API**: luôn tạo thư mục `api/` và `types/` (**xem skill `create-api`**). File `.endpoints.ts` chỉ chứa hằng số URL, file `.api.ts` import từ đó và gọi qua `axiosClient` ở `shared/services/axiosClient.ts`. Không gọi `axiosClient` trực tiếp trong component hay hook.

4. **Nếu module cần state phức tạp dùng ở nhiều nơi trong module** → tạo `store/<ten>.store.ts` (xem skill `create-store`). **Nếu chỉ cần state ít thay đổi chia sẻ qua Context** (ví dụ filter áp dụng toàn module) → tạo `context/<tenModule>.context.ts` (xem skill `create-context-provider`). Không tạo cả hai cho cùng một state — chọn một.

5. **Chỉ tạo `index.ts` ở gốc module khi có module khác hoặc `app/` cần import từ module này.** Nếu module tự đứng độc lập (chỉ được gọi qua route), không cần file này.

6. **Nếu module có các tính năng thêm/sửa/xóa cần form nhập liệu**: tạo thư mục `components/` và tham khảo skill `create-form` để đảm bảo code form chuẩn.

6. Toàn bộ code, comment, và message hiển thị cho người dùng đều viết **tiếng Việt**.

## Ví dụ

**Input:** "Tạo module booking, có gọi API để đặt phòng và xem lịch sử đặt phòng, cần 2 trang: danh sách đặt phòng và chi tiết đặt phòng"

**Output:** tạo cấu trúc:

```
src/modules/booking/
├── types.ts
├── api/
│   ├── booking.api.ts
│   └── booking.endpoints.ts
├── constants/
│   └── queryKeys.ts
├── hooks/
│   ├── useBookingList.ts        (xem skill create-hook)
│   └── useBookingDetail.ts
└── pages/
    ├── BookingList/index.tsx     (xem skill create-page)
    └── BookingDetail/index.tsx
```

Không tạo `context/`, `store/`, `components/` vì yêu cầu chưa cho thấy module cần các phần này — có thể thêm sau khi cần.

## Sau khi tạo module

- Nếu module có trang mới, dùng skill `create-page` để tạo từng trang và đăng ký route ở `app/router`.
- Nhắc người dùng rằng module mới chưa được đăng ký route — cần chạy tiếp bước tạo trang để module hiển thị được trên ứng dụng.
