import { useCallback, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@modules/auth/api/auth.api";
import { getAuthErrorMessage } from "@modules/auth/api/auth.errors";
import {
  clearAuthToken,
  persistAuthToken,
} from "@/shared/services/auth.storage";
import { ROUTER_PATH } from "@app/router";
import { userApi } from "@modules/user/api/user.api";
import { HOME_QUERY_KEYS } from "@modules/home/constants/queryKeys";
import { LOCATION_QUERY_KEYS } from "@modules/location/constants/queryKeys";
import type {
  AuthRedirectLocation,
  AuthResponse,
  LoginRequest,
  LoginRequiredSource,
  RegisterRequest,
} from "@modules/auth/types";
import { AuthContext } from "./authContext";
import type { User } from "@modules/user/type";
import type { ReactNode } from "react";

const currentUserQueryKey = ["auth", "current-user"] as const;

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {

  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [hasToken, setHasToken] = useState(() => authApi.hasAccessToken());
  const [authError, setAuthError] = useState("");
  const [loginRequiredRoute, setLoginRequiredRoute] =
    useState<AuthRedirectLocation | null>(null);
  const [loginRequiredSource, setLoginRequiredSource] =
    useState<LoginRequiredSource | null>(null);
  const [suppressedLoginRequiredRoute, setSuppressedLoginRequiredRoute] =
    useState<AuthRedirectLocation | null>(null);
      // const navigate = useNavigate();


  // AuthContext gom toàn bộ luồng xác thực để page chỉ cần gọi một API ổn định:
  // đăng nhập, đăng kí, đăng xuất, bootstrap user và trạng thái loading/error.
  // Cách này giúp tránh rải localStorage, mutation và xử lý lỗi auth ở nhiều hook/page.

  // Bootstrap user từ access token đã lưu. Nếu token cũ không còn hợp lệ,
  // provider chủ động xóa phiên đăng nhập để UI không giữ trạng thái user sai.
  const currentUserQuery = useQuery({
    queryKey: currentUserQueryKey,
    queryFn: async () => {
      try {
        return await userApi.getCurrentUser();
      } catch (error) {
        clearAuthToken();
        setHasToken(false);
        setUser(null);
        throw error;
      }
    },
    enabled: hasToken && !user,
    retry: false,
  });

  const currentUser = user ?? currentUserQuery.data ?? null;

  // Lưu token và user sau khi đăng nhập/đăng kí thành công.
  // Backend có thể không trả user ngay, nên phần user chỉ được set khi response có dữ liệu.
  const persistAuthenticatedSession = useCallback((response: AuthResponse) => {
    persistAuthToken(response);
    setHasToken(authApi.hasAccessToken());

    if (response.user) {
      setUser(response.user);
    }
  }, []);

  const invalidateAuthSensitiveLocationQueries = useCallback(() => {
    void queryClient.invalidateQueries({
      queryKey: HOME_QUERY_KEYS.featuredLocations,
    });
    void queryClient.invalidateQueries({
      queryKey: HOME_QUERY_KEYS.newLocations,
    });
    void queryClient.invalidateQueries({
      queryKey: LOCATION_QUERY_KEYS.all,
    });
  }, [queryClient]);

  const signInMutation = useMutation({
    mutationFn: (values: LoginRequest) => authApi.signIn(values),
    onMutate: () => {
      setAuthError("");
    },
    onSuccess: (response) => {
      persistAuthenticatedSession(response);
      invalidateAuthSensitiveLocationQueries();
    },
    onError: (error) => {
      setAuthError(getAuthErrorMessage(error));
    },
  });

  const signUpMutation = useMutation({
    mutationFn: (values: RegisterRequest) => authApi.signUp(values),
    onMutate: () => {
      setAuthError("");
    },
    onSuccess: (response) => {
      persistAuthenticatedSession(response);
      invalidateAuthSensitiveLocationQueries();
    },
    onError: (error) => {
      setAuthError(getAuthErrorMessage(error));
    },
  });

  const signIn = useCallback(
    (values: LoginRequest) => signInMutation.mutateAsync(values),
    [signInMutation],
  );

  const signUp = useCallback(
    (values: RegisterRequest) => signUpMutation.mutateAsync(values),
    [signUpMutation],
  );

  // Đăng xuất phải dọn cả token local, state user và cache current-user.
  // Nếu không remove cache, tài khoản cũ có thể bị hiển thị lại khi user đổi phiên.
  const signOut = useCallback(() => {
    clearAuthToken();
    setHasToken(false);
    setUser(null);
    setAuthError("");
    setLoginRequiredRoute(null);
    setLoginRequiredSource(null);
    setSuppressedLoginRequiredRoute(null);
    queryClient.removeQueries({ queryKey: currentUserQueryKey });
    window.location.href = ROUTER_PATH.HOME; // Đổi cách điều hướng để đảm bảo reload lại toàn bộ state sau khi đăng xuất
  }, [queryClient]);

  const openLoginRequired = useCallback(
    (
      location: AuthRedirectLocation,
      source: LoginRequiredSource = "protected-route",
    ) => {
      if (
        location.pathname === ROUTER_PATH.SIGNIN ||
        location.pathname === ROUTER_PATH.SIGNUP
      ) {
        return;
      }

      setLoginRequiredSource(source);
      setLoginRequiredRoute((currentRoute) => {
        if (
          currentRoute?.pathname === location.pathname &&
          currentRoute?.search === location.search &&
          currentRoute?.hash === location.hash
        ) {
          return currentRoute;
        }

        return location;
      });
    },
    [],
  );

  const closeLoginRequired = useCallback(() => {
    setLoginRequiredRoute(null);
    setLoginRequiredSource(null);
  }, []);

  const resolveBackFromProtected = useCallback(() => {
    if (loginRequiredSource === "protected-route") {
      setSuppressedLoginRequiredRoute(loginRequiredRoute);
    }

    setLoginRequiredRoute(null);
    setLoginRequiredSource(null);
  }, [loginRequiredRoute, loginRequiredSource]);

  const clearSuppressedLoginRequired = useCallback(() => {
    setSuppressedLoginRequiredRoute(null);
  }, []);

  const contextValue = useMemo(
    () => ({
      user: currentUser,
      isAuthenticated: Boolean(currentUser || hasToken),
      isBootstrapping: currentUserQuery.isFetching,
      isSigningIn: signInMutation.isPending,
      isSigningUp: signUpMutation.isPending,
      authError,
      isLoginRequiredOpen: Boolean(loginRequiredRoute),
      loginRequiredRoute,
      loginRequiredSource,
      suppressedLoginRequiredRoute,
      setUser,
      signIn,
      signUp,
      signOut,
      openLoginRequired,
      closeLoginRequired,
      resolveBackFromProtected,
      clearSuppressedLoginRequired,
    }),
    [
      clearSuppressedLoginRequired,
      authError,
      closeLoginRequired,
      currentUser,
      currentUserQuery.isFetching,
      hasToken,
      loginRequiredRoute,
      loginRequiredSource,
      openLoginRequired,
      resolveBackFromProtected,
      suppressedLoginRequiredRoute,
      signIn,
      signInMutation.isPending,
      signOut,
      signUp,
      signUpMutation.isPending,
    ],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
