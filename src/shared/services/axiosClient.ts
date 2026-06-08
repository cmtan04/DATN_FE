import { ROUTER_PATH } from "@/app/router/routes";
import type { AuthResponse } from "@/modules/auth/types";
import axios, {
  AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";
import * as authStorage from "@/shared/services/auth.storage";

const baseURL = import.meta.env.VITE_API_BASE_URL || "";
const REFRESH_TOKEN_ENDPOINT = "/auth/refresh-token";

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

type PendingRequest = {
  resolve: (accessToken: string) => void;
  reject: (error: unknown) => void;
};

export const axiosClient = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let pendingRequests: PendingRequest[] = [];

const redirectToSignIn = () => {
  authStorage.clearAuthToken();
  window.location.href = ROUTER_PATH.SIGNIN;
};

const setAuthorizationHeader = (
  config: InternalAxiosRequestConfig,
  accessToken: string,
) => {
  config.headers.set("Authorization", `Bearer ${accessToken}`);
};

const flushPendingRequests = (error: unknown, accessToken?: string) => {
  pendingRequests.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
      return;
    }

    if (accessToken) {
      resolve(accessToken);
    }
  });

  pendingRequests = [];
};

const refreshAccessToken = async (refreshToken: string) => {
  const { data } = await axios.post<AuthResponse>(
    `${baseURL}${REFRESH_TOKEN_ENDPOINT}`,
    { refreshToken },
    {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 10000,
    },
  );

  if (!data.accessToken) {
    throw new Error("Refresh token response is missing accessToken.");
  }

  authStorage.persistAuthToken({
    accessToken: data.accessToken,
    refreshToken: data.refreshToken || refreshToken,
  });

  return data.accessToken;
};

axiosClient.interceptors.request.use(
  (config) => {
    const accessToken = authStorage.getAccessToken();

    if (accessToken) {
      setAuthorizationHeader(config, accessToken);
    }

    return config;
  },
  (error) => Promise.reject(error),
);

axiosClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    const refreshToken = authStorage.getRefreshToken();

    if (!refreshToken) {
      redirectToSignIn();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingRequests.push({
          resolve: (accessToken) => {
            setAuthorizationHeader(originalRequest, accessToken);
            resolve(axiosClient(originalRequest));
          },
          reject,
        });
      });
    }

    isRefreshing = true;

    try {
      const newAccessToken = await refreshAccessToken(refreshToken);
      flushPendingRequests(null, newAccessToken);
      setAuthorizationHeader(originalRequest, newAccessToken);
      return axiosClient(originalRequest);
    } catch (refreshError) {
      flushPendingRequests(refreshError);
      redirectToSignIn();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
