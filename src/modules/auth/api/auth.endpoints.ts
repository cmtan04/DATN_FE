export const AUTH_ENDPOINT = {
  signIn: "/auth/sign-in",
  signUp: "/auth/sign-up",
  getOtp: "/otp/send",
  verifyOtp: "/otp/verify",
  resetPassword: "/auth/reset-password",
  refreshToken: "/auth/refresh-token",
} as const;
