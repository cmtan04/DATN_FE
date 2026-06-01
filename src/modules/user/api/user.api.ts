import { axiosClient } from "@shared/services/axiosClient";
import { USER_ENDPOINTS } from "./user.endpoints";
import type { NotificationItem, UpdateCurrentUserPayload, User } from "../type";

export const userApi = {
  async getCurrentUser() {
    const { data } = await axiosClient.get<User>(USER_ENDPOINTS.CURRENT_USER);
    return data;
  },

  async updateCurrentUser(payload: UpdateCurrentUserPayload) {
    const { data } = await axiosClient.patch<User>(
      USER_ENDPOINTS.CURRENT_USER,
      payload,
    );
    return data;
  },

  async submitOwnerRequest() {
    const { data } = await axiosClient.post<User>(USER_ENDPOINTS.OWNER_REQUEST);
    return data;
  },

  async listNotifications() {
    const { data } = await axiosClient.get<NotificationItem[]>(
      USER_ENDPOINTS.NOTIFICATIONS,
    );
    return data;
  },

  async markNotificationRead(notificationId: number) {
    const { data } = await axiosClient.patch<NotificationItem>(
      USER_ENDPOINTS.NOTIFICATION_READ(notificationId),
    );
    return data;
  },
};
