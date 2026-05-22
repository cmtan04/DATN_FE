import { WebRouter } from "./router/Route";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import { App as AntdApp, ConfigProvider } from "antd";
import "./color.scss";
function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });
  return (
    <QueryClientProvider client={queryClient}>
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
        <AntdApp>
          <WebRouter />
        </AntdApp>
      </ConfigProvider>
    </QueryClientProvider>
  );
}

export default App;
