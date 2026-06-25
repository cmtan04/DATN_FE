---
name: create-context-provider
description: Tạo React Context và Provider để chia sẻ state ít thay đổi (theme, user, language, hoặc state nghiệp vụ ổn định trong 1 module). Dùng skill này khi người dùng yêu cầu "tạo context", "thêm provider", "chia sẻ state qua nhiều component", hoặc khi prop drilling qua nhiều cấp component trở nên cồng kềnh. Nếu state cần chia sẻ thay đổi liên tục hoặc phức tạp (filter, danh sách, giỏ hàng...), gợi ý dùng skill create-store (Zustand) thay vì skill này; xem mục "Context hay Zustand" để phân biệt.
---

# Tạo Context và Provider

Dự án dùng React Context cho state **toàn cục, ít thay đổi**: theme, thông tin user đăng nhập, ngôn ngữ hiện tại. Với state phức tạp hoặc thay đổi nhiều, dự án dùng Zustand (skill `create-store`), không dùng Context.

## Context hay Zustand — chọn đúng công cụ

| Đặc điểm state                                                                 | Dùng                                                 |
| ------------------------------------------------------------------------------ | ---------------------------------------------------- |
| Ít thay đổi trong suốt session (theme, user, ngôn ngữ)                         | **Context**                                          |
| Cần ở nhiều module khác nhau, đọc/viết thường xuyên (filter, cart, danh sách)  | **Zustand** (`shared/stores/`)                       |
| Chỉ thay đổi nhiều trong phạm vi 1 module (state UI tạm của 1 luồng nghiệp vụ) | **Zustand** module-level (`modules/<module>/store/`) |
| Cần inject theo cây component con (vd: theme áp dụng cho 1 nhánh UI riêng)     | **Context**                                          |

Nếu không chắc, hỏi người dùng: state này có thay đổi liên tục không, và có cần optimize re-render không — Context re-render toàn bộ consumer khi value đổi, Zustand chỉ re-render component dùng đúng phần state đó.

## Vị trí

- **Context toàn cục của app** (theme, user, language) → `src/app/providers/<Ten>Provider.tsx`
- **Context riêng của 1 module** → `src/modules/<module>/context/<module>.context.ts`

## Pattern: Context global (app/providers)

Tách riêng định nghĩa Context (file `.context.ts` nếu module, hoặc cùng file Provider nếu ở app/providers) khỏi Provider component. Ví dụ Provider toàn cục:

```typescript
// src/app/providers/AuthProvider.tsx
import { createContext, useContext, useState, useMemo, type ReactNode } from "react";
import type { User } from "@/modules/user/types";

interface AuthContextValue {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const value = useMemo(
    () => ({ user, setUser, isAuthenticated: Boolean(user) }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook đi kèm — luôn export cùng Provider, không bắt component tự gọi useContext + kiểm tra undefined
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext phải được dùng trong AuthProvider");
  }
  return context;
};
```

Đăng ký Provider vào `src/app/providers/AppProvider.tsx` (provider tổng hợp các provider con) hoặc bọc trực tiếp ở `App.tsx`, theo đúng cách `ThemeProvider`/`AuthProvider` hiện có đang được lồng vào nhau.

## Pattern: Context cấp module

Khi 1 module cần Context riêng (ví dụ chia sẻ filter giữa nhiều component con trong cùng 1 trang mà không qua URL params), tách file định nghĩa Context và file Provider riêng:

```typescript
// src/modules/<module>/context/<module>.context.ts
import { createContext, useContext } from "react";

interface <Module>ContextValue {
  // các field state
}

export const <Module>Context = createContext<<Module>ContextValue | undefined>(undefined);

export const use<Module>Context = () => {
  const context = useContext(<Module>Context);
  if (!context) {
    throw new Error("use<Module>Context phải được dùng trong <Module>Provider");
  }
  return context;
};
```

Provider component đặt trong `components/` của module (vd: `components/<Module>Provider.tsx`), bọc quanh các trang/component con cần dùng context đó — không bọc toàn app.

## Quy tắc chung

- Luôn `useMemo` giá trị `value` truyền vào `Context.Provider` để tránh re-render thừa cho mọi consumer khi component cha render lại.
- Luôn export kèm 1 custom hook (`use<Ten>Context`) để đọc context — không để component gọi trực tiếp `useContext(RawContext)`, vì hook cho phép kiểm tra và báo lỗi rõ ràng khi dùng ngoài Provider.
- Không nhồi quá nhiều state không liên quan vào 1 Context — nếu Context đang phình to và chứa nhiều state độc lập nhau, đó là dấu hiệu nên tách Context hoặc chuyển phần state hay đổi nhiều sang Zustand (xem skill `refactor`).
- Thông báo lỗi (`throw new Error(...)`) và comment viết **tiếng Việt**.

## Ví dụ

**Input:** "Cần chia sẻ ngôn ngữ hiện tại (vi/en) cho toàn app"

**Output:** Tạo `src/app/providers/LanguageProvider.tsx` theo pattern Context global ở trên, export `useLanguageContext`, đăng ký vào `AppProvider.tsx`. Không tạo ở cấp module vì đây là state toàn cục.

**Input:** "Module booking cần chia sẻ bước hiện tại (step 1/2/3) của form đặt phòng giữa nhiều component con"

**Output:** Hỏi lại: state này chỉ tồn tại trong lúc người dùng đang ở luồng đặt phòng (tạm, ít module khác cần) → phù hợp Context module-level tại `modules/booking/context/booking.context.ts`. Nếu state này cần giữ lại khi rời trang rồi quay lại, hoặc module khác (vd: trang thanh toán) cũng cần đọc, nên dùng Zustand store thay vì Context.
