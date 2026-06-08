import type { AuthResponse } from "../../modules/auth/types";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);

export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);

export const persistAuthToken = (response: AuthResponse) => {
  if (response.accessToken) {
    localStorage.setItem(ACCESS_TOKEN_KEY, response.accessToken);
  }

  if (response.refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);
  }
};

export const clearAuthToken = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};
