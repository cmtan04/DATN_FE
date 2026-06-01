import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userApi } from "../api/user.api";

export const notificationsQueryKey = ["notifications", "me"] as const;

export const useNotifications = (enabled = true) =>
  useQuery({
    queryKey: notificationsQueryKey,
    queryFn: () => userApi.listNotifications(),
    enabled,
  });

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: number) =>
      userApi.markNotificationRead(notificationId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: notificationsQueryKey });
    },
  });
};

