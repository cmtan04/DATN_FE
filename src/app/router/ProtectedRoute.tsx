import { Spin } from "antd";
import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@app/providers/useAuth";

export const ProtectedRoute = () => {
  const location = useLocation();
  const {
    isAuthenticated,
    isBootstrapping,
    isLoginRequiredOpen,
    suppressedLoginRequiredRoute,
    clearSuppressedLoginRequired,
    openLoginRequired,
  } = useAuth();

  const isSuppressedRoute =
    suppressedLoginRequiredRoute?.pathname === location.pathname &&
    (suppressedLoginRequiredRoute?.search ?? "") === location.search &&
    (suppressedLoginRequiredRoute?.hash ?? "") === location.hash;

  useEffect(() => {
    if (
      !isBootstrapping &&
      !isAuthenticated &&
      !isLoginRequiredOpen &&
      !isSuppressedRoute
    ) {
      openLoginRequired(
        {
          pathname: location.pathname,
          search: location.search,
          hash: location.hash,
        },
        "protected-route",
      );
    }
  }, [
    clearSuppressedLoginRequired,
    isAuthenticated,
    isBootstrapping,
    isLoginRequiredOpen,
    isSuppressedRoute,
    location.hash,
    location.pathname,
    location.search,
    openLoginRequired,
  ]);

  useEffect(() => {
    if (!isSuppressedRoute) {
      return;
    }

    return () => {
      clearSuppressedLoginRequired();
    };
  }, [clearSuppressedLoginRequired, isSuppressedRoute]);

  if (isBootstrapping) {
    return (
      <div style={{ minHeight: 320, display: "grid", placeItems: "center" }}>
        <Spin />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <Outlet />;
};
