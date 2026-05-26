import type { ReactNode } from "react";
import { Typography } from "antd";
import "../pages/signIn/styles.scss";

interface AuthLayoutProps {
  children: ReactNode;
  visualTitle: string;
  visualDescription: string;
}

export const AuthLayout = ({
  children,
  visualTitle,
  visualDescription,
}: AuthLayoutProps) => (
  <main className="auth-page">
    <section className="auth-page__form-panel">
      <div className="auth-page__form-shell">{children}</div>
    </section>

    <section className="auth-page__visual-panel" aria-hidden="true">
      <div className="auth-page__visual-copy">
        <Typography.Title level={2}>{visualTitle}</Typography.Title>
        <Typography.Text>{visualDescription}</Typography.Text>
      </div>
    </section>
  </main>
);
