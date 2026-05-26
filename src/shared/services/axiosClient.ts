import axios, { type InternalAxiosRequestConfig } from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "";

export const axiosClient = axios.create({
  baseURL: baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },  
});

axiosClient.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = localStorage.getItem("refreshToken");
      
      if (refreshToken) {
        // SỬA 1: Thêm baseURL vào đường dẫn
        // SỬA 2: Đổi key thành refresh_token cho khớp Backend
        return axios.post(`${baseURL}/auth/refresh-token`, { 
            refreshToken: refreshToken 
          })
          .then(res => {
            if (res.status === 200 || res.status === 201) {
              // SỬA 3: Đổi key nhận về thành access_token
              const newAccessToken = res.data.access_token; 
              
              localStorage.setItem("accessToken", newAccessToken);
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
              return axiosClient(originalRequest);
            }
          })
          .catch(refreshError => {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            // SỬA 4: Thêm dấu / để đưa về root domain
            window.location.href = "/auth/login"; 
            return Promise.reject(refreshError);
          });
      } else {
        localStorage.removeItem("accessToken");
        window.location.href = "/auth/login";
      }
    }
    
    return Promise.reject(error);
  }
);