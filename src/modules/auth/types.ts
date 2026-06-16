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

export interface AuthMessageResponse {
  status?: boolean;
  message?: string;
  resetToken?: string; // Assuming the API response includes a reset token for password reset
}

export interface GetOtpRequest {
  email: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface ResetPasswordRequest {
  resetToken: string;
  password: string;
}

export interface ForgotPasswordOtpFormValues {
  otp: string;
}

export interface ForgotPasswordResetFormValues {
  newPassword: string;
  confirmPassword: string;
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

export interface AuthRedirectLocation {
  pathname?: string;
  search?: string;
  hash?: string;
}

export type LoginRequiredSource = "intercept" | "protected-route";

export interface SignInLocationState {
  from?: AuthRedirectLocation;
}
