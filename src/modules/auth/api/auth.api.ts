import { axiosClient } from "@shared/services/axiosClient";
import { getAccessToken } from "../../../shared/services/auth.storage";
import { AUTH_ENDPOINT } from "./auth.endpoints";
import type {
  AuthMessageResponse,
  AuthResponse,
  GetOtpRequest,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  VerifyOtpRequest,
} from "../types";

export const authApi = {
  async signIn(payload: LoginRequest) {
    const { data } = await axiosClient.post<AuthResponse>(
      AUTH_ENDPOINT.signIn,
      payload,
    );
    return data;
  },

  async signUp(payload: RegisterRequest) {
    const { data } = await axiosClient.post<AuthResponse>(
      AUTH_ENDPOINT.signUp,
      payload,
    );
    return data;
  },

  async getOtp(payload: GetOtpRequest) {
    const { data } = await axiosClient.post<AuthMessageResponse>(
      AUTH_ENDPOINT.getOtp,
      payload,
    );
    return data;
  },

  async verifyOtp(payload: VerifyOtpRequest) {
    const { data } = await axiosClient.post<AuthMessageResponse>(
      AUTH_ENDPOINT.verifyOtp,
      payload,
    );
    return data;
  },

  async resetPassword(payload: ResetPasswordRequest) {
    const { data } = await axiosClient.post<AuthMessageResponse>(
      AUTH_ENDPOINT.resetPassword,
      payload,
    );
    return data;
  },

  hasAccessToken() {
    return Boolean(getAccessToken());
  },
};
