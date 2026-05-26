import type { User } from "@modules/user/type";

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
}

export interface AuthResponse {
  accessToken?: string;
  refreshToken?: string;
  user?: User;
  message?: string;
}

export interface SignUpFormValues extends RegisterRequest {
  confirmPassword: string;
  termsAccepted: boolean;
}

export interface SignInLocationState {
  from?: {
    pathname?: string;
    search?: string;
    hash?: string;
  };
};
