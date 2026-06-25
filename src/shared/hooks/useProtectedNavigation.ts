import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import type { AuthRedirectLocation } from "@modules/auth/types";

const toRedirectLocation = (targetPath: string): AuthRedirectLocation => {
  const normalizedTarget = targetPath.startsWith("/")
    ? targetPath
    : `/${targetPath}`;
  const targetUrl = new URL(normalizedTarget, window.location.origin);

  return {
    pathname: targetUrl.pathname,
    search: targetUrl.search,
    hash: targetUrl.hash,
  };
};

export const useProtectedNavigation = () => {
  const navigate = useNavigate();
  const { isAuthenticated, openLoginRequired } = useAuth();

  return useCallback(
    (targetPath: string) => {
      if (isAuthenticated) {
        navigate(targetPath);
        return;
      }

      openLoginRequired(toRedirectLocation(targetPath), "intercept");
    },
    [isAuthenticated, navigate, openLoginRequired],
  );
};
