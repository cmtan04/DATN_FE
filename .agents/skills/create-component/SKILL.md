---
name: create-component
description: Tạo component React mới (dùng antd + scss) cho module hoặc shared. Dùng skill này khi người dùng yêu cầu "tạo component", "thêm UI cho một tính năng", "viết lại component", hoặc bất cứ khi nào cần tạo file .tsx hiển thị UI mới trong modules/[ten-module]/components/ hoặc shared/components/.
---

# Tạo component

## Vị trí

- Component chỉ dùng trong 1 module → `src/modules/<module>/components/`
- Component dùng ở nhiều module → `src/shared/components/`

Nếu không chắc, tạo ở module trước. Chỉ chuyển lên `shared` khi có nơi thứ 2 thực sự cần dùng (xem skill `refactor`).

## Chọn cấu trúc: file rời hay folder riêng

Dự án dùng **cả hai** dạng, chọn theo tiêu chí: **component có scss dùng riêng/scoped phức tạp, hoặc có sub-component con bên trong → folder riêng. Component đơn giản, độc lập, không chia sẻ scss → file rời.**

**Dạng file rời** (component đơn giản, không có sub-component):
```
components/
├── <Name>.tsx
└── <name>.scss
```

**Dạng folder riêng** (component phức tạp, nhiều phần, hoặc chứa sub-component):
```
components/
└── <Name>/
    ├── index.tsx
    └── styles.scss
```

Khi không chắc, hỏi: component này có khả năng phát triển thêm sub-component con trong tương lai gần không? Nếu có, ưu tiên tạo folder ngay từ đầu để tránh phải refactor cấu trúc sau.

## Pattern component cơ bản

```typescript
// <Name>.tsx (hoặc <Name>/index.tsx)
import { Button } from "antd";
import "./<name>.scss"; // hoặc "./styles.scss" nếu dùng dạng folder

interface <Name>Props {
  title: string;
  onAction?: () => void;
}

export const <Name> = ({ title, onAction }: <Name>Props) => {
  return (
    <div className="<ten-class-kebab-case>">
      <h3 className="<ten-class-kebab-case>__title">{title}</h3>
      {onAction && <Button onClick={onAction}>Xác nhận</Button>}
    </div>
  );
};
```

- Props luôn có interface riêng `<Name>Props`, không dùng inline type trừ khi component cực đơn giản (1 prop).
- Class CSS gốc của component dùng kebab-case theo tên component (vd: component `LocationCard` → class `.location-card`), sub-element dùng BEM-style `__element` để dễ scoped trong file scss riêng.
- Children optional dùng `?` và kiểm tra trước khi render, không giả định luôn có.

## Pattern file scss

```scss
// styles.scss
@use '../../../_variables' as *;
// (chỉnh số cấp ../ theo độ sâu thực tế từ file hiện tại tới src/_variables.scss)

.<ten-class-kebab-case> {
  display: flex;
  color: $primary-color; // dùng biến từ _variables.scss, không hardcode mã màu

  &__title {
    font-weight: 600;
  }
}
```

**Luôn** dùng `@use '...variables' as *` để lấy biến màu — **không hardcode** mã hex/rgb trực tiếp trong component, trừ khi màu đó thực sự chỉ dùng đúng 1 lần và không có trong bộ biến hệ thống. Nếu cảm thấy cần 1 màu mới dùng lại nhiều lần, đề xuất thêm biến đó vào `_variables.scss` trước khi hardcode rải trong nhiều file.

## Dùng antd làm nền, không tự dựng lại UI cơ bản

Ưu tiên component có sẵn của `antd` (`Button`, `Modal`, `Form`, `Table`, `Card`, `Drawer`...) cho các UI tiêu chuẩn, chỉ viết CSS tùy biến thêm qua class riêng — không viết lại từ đầu nút bấm, modal, input bằng HTML thuần trừ khi antd không hỗ trợ đúng nhu cầu. **Đặc biệt với Component chứa Form nhập liệu, LUÔN tham khảo skill `create-form`.**

Với các input dùng trong form, dự án có sẵn wrapper riêng ở `shared/components/` (vd: `FormInput`, `FormDatePicker`, `FormSearch`, `FormTextArea`) bọc quanh component antd để tích hợp với form validation — kiểm tra `shared/components/` trước khi tạo input mới, ưu tiên tái sử dụng wrapper có sẵn thay vì gọi trực tiếp `Input`/`DatePicker` của antd trong từng component riêng lẻ.

## Component nhận dữ liệu — qua props, không tự gọi hook bên trong nếu có thể tái sử dụng

Component hiển thị thuần (presentational) nên nhận data qua props, để page/component cha gọi hook và truyền xuống — giúp component dễ test và dùng lại ở nhiều ngữ cảnh khác nhau. Chỉ để component tự gọi hook bên trong khi component đó **luôn luôn** gắn với 1 nguồn dữ liệu cụ thể và không có ý định tái sử dụng với dữ liệu khác (vd: `NavBar` luôn tự lấy user hiện tại qua `useAuth`).

## Quy tắc chung

- Tên file/folder/component đều PascalCase: `LocationCard`, `HeroSearch`.
- Toàn bộ text hiển thị (label, placeholder, thông báo) viết **tiếng Việt**.
- Không dùng `any` cho props — định nghĩa interface rõ ràng, import type từ `types.ts` của module nếu là kiểu nghiệp vụ.
- Comment trong code viết **tiếng Việt**, giải thích phần logic không hiển nhiên, không comment lại điều code đã tự nói rõ.

## Ví dụ

**Input:** "Tạo component hiển thị thẻ địa điểm (LocationCard) cho module location, có ảnh, tên, giá, nút yêu thích"

**Output:** Vì component có khả năng mở rộng (badge, rating sau này) nhưng hiện tại scss không phức tạp và không có sub-component — có thể dùng dạng file rời:
```
src/modules/location/components/
├── LocationCard.tsx
└── locationCard.scss
```
Props: `LocationCardProps { name: string; imageUrl: string; price: number; isFavourite: boolean; onToggleFavourite: () => void }`. Dùng `Card` của antd làm khung ngoài, nút yêu thích dùng `Button` dạng icon (`HeartOutlined`/`HeartFilled` từ `@ant-design/icons`).