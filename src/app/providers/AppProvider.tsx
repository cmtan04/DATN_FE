import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { App as AntdApp, ConfigProvider } from "antd";
import type { ThemeConfig } from "antd";
import { AuthProvider } from "./AuthProvider";
import { NotificationStream } from "./NotificationStream";
import type { ReactNode } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const appTheme: ThemeConfig = {
  token: {
    colorPrimary: "#0b3d6b",
    colorPrimaryActive: "#0a3260",
    colorPrimaryHover: "#d4a849",
    colorInfo: "#0b3d6b",
    colorSuccess: "#16a34a",
    colorError: "#d4183d",
    colorBgBase: "#f8f7f4",
    colorBgContainer: "#ffffff",
    colorTextBase: "#0f1923",
    colorTextSecondary: "#6b7280",
    colorBorder: "rgba(15, 25, 35, 0.1)",
    borderRadius: 8,
    borderRadiusLG: 16,
    fontFamily: "Inter, sans-serif",
  },
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <NotificationStream />
      <ConfigProvider theme={appTheme}>
        <AntdApp>{children}</AntdApp>
      </ConfigProvider>
    </AuthProvider>
  </QueryClientProvider>
);
