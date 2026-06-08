import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { App as AntdApp, ConfigProvider } from "antd";
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

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <NotificationStream />
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#00293a",
            colorPrimaryActive: "#001c29",
            colorPrimaryHover: "#00609c",
            fontFamily: "DM Sans, system-ui, sans-serif",
          },
        }}
      >
        <AntdApp>{children}</AntdApp>
      </ConfigProvider>
    </AuthProvider>
  </QueryClientProvider>
);
