import type { ReactNode } from "react";
import "../pages/signIn/styles.scss";

interface AuthLayoutProps {
  children: ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => (
  <main className="auth-page">
    <section className="auth-page__form-panel">
      <div className="auth-page__form-shell">{children}</div>
    </section>

    <section className="auth-page__visual-panel" aria-hidden="true"></section>
  </main>
);
