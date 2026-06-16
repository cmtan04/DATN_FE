import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import { LoginRequiredModal } from "@modules/auth/components/LoginRequiredModal";
import { Footer, NavBar } from "@shared/components";
import "./webLayout.scss";

export const WebLayout = () => (
  <Layout className="web-layout">
    <NavBar />
    <Layout.Content className="web-layout__content">
      <Outlet />
    </Layout.Content>
    <Footer />
    <LoginRequiredModal />
  </Layout>
);
