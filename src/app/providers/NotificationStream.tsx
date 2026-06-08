import { useAuth } from "./useAuth";
import { useNotificationStream } from "@/modules/user/hooks/useNotificationStream";
export const NotificationStream = () => {
  const { isAuthenticated, user } = useAuth();

  useNotificationStream({
    enabled: isAuthenticated,
    userId: user?.id,
  });

  return null;
};