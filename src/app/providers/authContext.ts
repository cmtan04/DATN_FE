import { createContext } from "react";
import type {
  AuthResponse,
  LoginRequest,
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
  setUser: (user: User | null) => void;
  signIn: (values: LoginRequest) => Promise<AuthResponse>;
  signUp: (values: RegisterRequest) => Promise<AuthResponse>;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);
