---
name: refactor
description: Hướng dẫn refactor code trong kiến trúc app-modules-shared — khi nào chuyển component/hook/store từ module lên shared, khi nào tách hook/component, khi nào chuyển Context sang Zustand hoặc ngược lại, và cách giữ module độc lập khi dọn code cũ. Dùng skill này khi người dùng yêu cầu "refactor", "dọn lại code", "tách file này ra", "component này dùng được ở module khác không", hoặc khi phát hiện code trùng lặp giữa các module trong lúc làm việc.
---

# Refactor trong kiến trúc app-modules-shared

Mục tiêu refactor trong kiến trúc này luôn là: **giữ module độc lập càng lâu càng tốt, chỉ chia sẻ lên `shared` khi có bằng chứng thực sự cần dùng chung** (không refactor "phòng trường hợp sau cần"). Module phụ thuộc chéo vào nhau (module A import trực tiếp từ `modules/B/...`) là dấu hiệu cấu trúc đang lệch — nên đưa phần dùng chung đó lên `shared` thay vì giữ import chéo.

## Quy tắc "rule of two": khi nào đưa lên shared

Chỉ chuyển code từ module lên `shared` khi **có từ 2 module trở lên thực sự cần dùng** — không chuyển lên chỉ vì "có thể sẽ cần". Một lần dùng chỉ ở 1 module chưa phải lý do để generalize.

| Tình huống                                                      | Hành động                                                                                                              |
| --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Component/hook/util chỉ dùng trong 1 module                     | Giữ ở module, không chuyển                                                                                             |
| Có module thứ 2 cần dùng logic/UI giống vậy                     | Chuyển lên `shared`, refactor lại nếu phần đó còn lẫn logic đặc thù của module gốc                                     |
| Module A import trực tiếp `modules/B/components/...`            | Sai cấu trúc — chuyển phần dùng chung đó lên `shared`, không giữ import chéo giữa module                               |
| Component giống nhau ~80% nhưng khác chi tiết nhỏ giữa 2 module | Tách phần chung lên `shared`, phần khác biệt truyền qua props/render prop, không copy-paste để mỗi module tự sửa riêng |

### Quy trình chuyển 1 component/hook lên shared

1. Xác định phần thực sự chung — nếu component đang lẫn logic đặc thù của module gốc (vd: gọi API riêng của module đó), tách phần logic đó ra ngoài, để component/hook ở `shared` chỉ nhận dữ liệu qua props/tham số, không tự biết về module nào.
2. Di chuyển file vào `shared/components/` hoặc `shared/hooks/` tương ứng, theo đúng quy ước đặt tên ở skill `create-component`/`create-hook`.
3. Cập nhật mọi import ở module gốc (và module mới dùng) trỏ về đường dẫn `shared/...` mới.
4. Xóa file cũ ở module gốc, kiểm tra không còn import nào trỏ tới đường dẫn cũ.
5. Báo lại cho người dùng những module nào bị ảnh hưởng bởi thay đổi này để họ kiểm tra.

## Khi nào tách hook ra khỏi component/page

Tách logic trong component/page ra hook riêng khi:

- Component/page có `useEffect` gọi API trực tiếp (nên chuyển sang TanStack Query qua hook riêng — xem skill `create-hook`).
- Phần state + xử lý sự kiện chiếm nhiều hơn UI thực sự render — dấu hiệu component đang gánh quá nhiều logic.
- Cùng 1 logic được copy giữa 2 component/page khác nhau trong cùng module.

Không tách hook chỉ vì component "có vẻ dài" nếu phần dài đó chủ yếu là JSX hiển thị — độ dài JSX không phải lý do để tách logic.

## Khi nào chuyển giữa Context và Zustand

| Dấu hiệu                                                                              | Hành động                                                                                                                                                 |
| ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Context đang phình to, chứa nhiều state độc lập không liên quan nhau                  | Tách Context thành nhiều Context nhỏ theo nhóm liên quan, hoặc chuyển phần thay đổi nhiều sang Zustand                                                    |
| Context gây re-render rõ rệt ở nhiều component không liên quan tới phần state vừa đổi | Chuyển sang Zustand (chỉ re-render component dùng đúng field qua selector)                                                                                |
| Zustand store chỉ chứa state gần như không đổi (vd: thông tin user sau khi login)     | Có thể giữ nguyên hoặc chuyển về Context nếu muốn đơn giản hóa — không bắt buộc, nhưng nên nhất quán: state ít đổi nên ưu tiên Context theo quy ước dự án |

Xem bảng so sánh đầy đủ ở skill `create-context-provider` (mục "Context hay Zustand") trước khi quyết định.

## Khi nào tách component thành sub-component / đổi từ file rời sang folder

Nếu 1 component dạng file rời (`<Name>.tsx` + `<name>.scss`) bắt đầu:

- Sinh ra phần UI con được tái sử dụng nội bộ (chỉ dùng trong chính component đó, không dùng nơi khác) → tách thành sub-component, chuyển toàn bộ sang dạng folder (`<Name>/index.tsx`, `<Name>/<SubName>.tsx`, `<Name>/styles.scss`).
- File scss vượt quá ~100-150 dòng hoặc bắt đầu chứa nhiều block không liên quan trực tiếp tới phần tử gốc → dấu hiệu nên tách, xem lại có đang nhồi nhiều trách nhiệm vào 1 component không.

## Dọn dẹp khi refactor module

Khi refactor lớn trong 1 module (đổi cấu trúc, gộp/tách file):

- Kiểm tra `index.ts` ở gốc module (nếu có) — cập nhật export lại đúng đường dẫn mới, đây là nơi duy nhất module khác nên import từ, tránh để module ngoài import sâu vào đường dẫn nội bộ (`modules/x/components/y/z`) rồi vỡ khi refactor lại cấu trúc bên trong.
- Nếu route bị ảnh hưởng (đổi tên/đường dẫn trang), cập nhật `app/router/routes.ts` cùng lúc, không để route trỏ tới file đã xóa/di chuyển.
- Giữ nguyên hành vi nghiệp vụ khi refactor thuần cấu trúc — nếu refactor phát hiện ra bug logic, báo riêng cho người dùng thay vì tự sửa lẫn vào refactor (để dễ review từng thay đổi).

## Quy tắc chung

- Refactor giữ nguyên ngôn ngữ tiếng Việt trong comment/message — không "tiện tay" đổi sang tiếng Anh khi di chuyển file.
- Sau khi refactor xong, liệt kê ngắn gọn các file đã thêm/xóa/sửa và các import cần kiểm tra lại, để người dùng dễ review thay đổi.
- Nếu refactor ảnh hưởng nhiều module cùng lúc, hỏi xác nhận phạm vi trước khi sửa hàng loạt — đừng tự ý refactor rộng hơn những gì được yêu cầu.
