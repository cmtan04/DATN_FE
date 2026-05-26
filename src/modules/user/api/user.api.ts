import { axiosClient } from "@shared/services/axiosClient";
import { USER_ENDPOINTS } from "./user.endpoints";
import type { User } from "../type";

export const userApi = {
  async getCurrentUser() {
    const { data } = await axiosClient.get<User>(USER_ENDPOINTS.CURRENT_USER);
    return data;
  },

  async updateCurrentUser(payload: Partial<User>) {
    const { data } = await axiosClient.put<User>(
      USER_ENDPOINTS.CURRENT_USER,
      payload,
    );
    return data;
  },
};
