import { Spin } from "antd";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@app/providers/authContext";
import { ROUTER_PATH } from "./routes";

export const ProtectedRoute = () => {
  const location = useLocation();
  const { isAuthenticated, isBootstrapping } = useAuth();

  if (isBootstrapping) {
    return (
      <div style={{ minHeight: 320, display: "grid", placeItems: "center" }}>
        <Spin />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate to={ROUTER_PATH.SIGNIN} replace state={{ from: location }} />
    );
  }

  return <Outlet />;
};
