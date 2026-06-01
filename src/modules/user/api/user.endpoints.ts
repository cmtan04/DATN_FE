export const USER_ENDPOINTS = {
  CURRENT_USER: "/users/me",
  OWNER_REQUEST: "/users/me/owner-request",
  NOTIFICATIONS: "/notifications/me",
  NOTIFICATION_READ: (notificationId: number) =>
    `/notifications/${notificationId}/read`,
};
