import { axiosClient } from "@shared/services/axiosClient";
import { getAccessToken } from "./auth.storage";
import { AUTH_ENDPOINT } from "./auth.endpoints";
import type { AuthResponse, LoginRequest, RegisterRequest } from "../types";

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

  hasAccessToken() {
    return Boolean(getAccessToken());
  },
};
