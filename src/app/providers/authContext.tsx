import { useCallback, useMemo, useState, useContext, createContext } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@modules/auth/api/auth.api";
import { getAuthErrorMessage } from "@modules/auth/api/auth.errors";
import {
  clearAuthToken,
  persistAuthToken,
} from "@modules/auth/api/auth.storage";
import { userApi } from "@modules/user/api/user.api";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from "@modules/auth/types";
import type { User } from "@modules/user/type";
import type { ReactNode } from "react";

const currentUserQueryKey = ["auth", "current-user"] as const;

interface AuthProviderProps {
  children: ReactNode;
}

export interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isBootstrapping: boolean;
  isSigningIn: boolean;
  isSigningUp: boolean;
  authError: string;
  setUser: (user: User | null) => void;
  signIn: (values: LoginRequest) => Promise<AuthResponse>;
  signUp: (values: RegisterRequest) => Promise<AuthResponse>;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [hasToken, setHasToken] = useState(() => authApi.hasAccessToken());
  const [authError, setAuthError] = useState("");

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

  const signInMutation = useMutation({
    mutationFn: (values: LoginRequest) => authApi.signIn(values),
    onMutate: () => {
      setAuthError("");
    },
    onSuccess: (response) => {
      persistAuthenticatedSession(response);
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
    queryClient.removeQueries({ queryKey: currentUserQueryKey });
  }, [queryClient]);

  const contextValue = useMemo(
    () => ({
      user: currentUser,
      isAuthenticated: Boolean(currentUser || hasToken),
      isBootstrapping: currentUserQuery.isFetching,
      isSigningIn: signInMutation.isPending,
      isSigningUp: signUpMutation.isPending,
      authError,
      setUser,
      signIn,
      signUp,
      signOut,
    }),
    [
      authError,
      currentUser,
      currentUserQuery.isFetching,
      hasToken,
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

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.");
  }

  return context;
};
