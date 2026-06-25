import { Spin } from "antd";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { ROUTER_PATH } from "@app/router/routes";
import { useAuth } from "@/modules/auth/hooks/useAuth";

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
    return <Navigate to={ROUTER_PATH.SIGNIN} state={{ from: location }} replace />;
  }

  return <Outlet />;
};

