import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import { Footer, TopBar } from "@shared/components";
import "./webLayout.scss";

export const WebLayout = () => (
  <Layout className="web-layout">
    <TopBar />
    <Layout.Content className="web-layout__content">
      <Outlet />
    </Layout.Content>
    <Footer />
  </Layout>
);
