import { createContext } from "react";
import type {
  AuthRedirectLocation,
  AuthResponse,
  LoginRequest,
  LoginRequiredSource,
  RegisterRequest,
} from "@modules/auth/types";
import type { User } from "@modules/user/type";

export interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isBootstrapping: boolean;
  isSigningIn: boolean;
  isSigningUp: boolean;
  authError: string;
  isLoginRequiredOpen: boolean;
  loginRequiredRoute: AuthRedirectLocation | null;
  loginRequiredSource: LoginRequiredSource | null;
  suppressedLoginRequiredRoute: AuthRedirectLocation | null;
  setUser: (user: User | null) => void;
  signIn: (values: LoginRequest) => Promise<AuthResponse>;
  signUp: (values: RegisterRequest) => Promise<AuthResponse>;
  signOut: () => void;
  openLoginRequired: (
    location: AuthRedirectLocation,
    source?: LoginRequiredSource,
  ) => void;
  closeLoginRequired: () => void;
  resolveBackFromProtected: () => void;
  clearSuppressedLoginRequired: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);
