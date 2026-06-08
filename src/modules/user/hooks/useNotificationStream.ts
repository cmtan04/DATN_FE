import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getAccessToken } from "@modules/auth";
import type { NotificationItem } from "../type";
import { notificationsQueryKey } from "./useNotifications";

interface UseNotificationStreamParams {
  enabled: boolean;
  userId?: number;
}

export const useNotificationStream = ({
  enabled,
  userId,
}: UseNotificationStreamParams) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const token = getAccessToken();

    if (!enabled || !userId || !token) {
      return;
    }

    const eventSource = new EventSource(buildNotificationStreamUrl(userId, token));

    eventSource.onmessage = (event: MessageEvent<string>) => {
      const notification = parseNotification(event.data);

      if (!notification) {
        return;
      }

      queryClient.setQueryData<NotificationItem[]>(
        notificationsQueryKey,
        (current = []) => {
          if (current.some((item) => item.id === notification.id)) {
            return current;
          }

          return [notification, ...current];
        },
      );
    };

    return () => {
      eventSource.close();
    };
  }, [enabled, queryClient, userId]);
};

const buildNotificationStreamUrl = (userId: number, token: string) => {
  const baseURL = import.meta.env.VITE_API_BASE_URL || "";
  const normalizedBaseURL = baseURL.replace(/\/$/, "");
  const url = new URL(
    `${normalizedBaseURL}/notifications/stream/${userId}`,
    window.location.origin,
  );

  url.searchParams.set("token", token);

  return url.toString();
};

const parseNotification = (rawData: string): NotificationItem | null => {
  try {
    const value = JSON.parse(rawData) as unknown;

    return isNotificationItem(value) ? value : null;
  } catch {
    return null;
  }
};

const isNotificationItem = (value: unknown): value is NotificationItem => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const notification = value as Partial<NotificationItem>;

  return (
    typeof notification.id === "number" &&
    typeof notification.title === "string" &&
    typeof notification.message === "string" &&
    typeof notification.userId === "number" &&
    typeof notification.isRead === "boolean" &&
    typeof notification.createdAt === "string" &&
    typeof notification.updatedAt === "string"
  );
};
