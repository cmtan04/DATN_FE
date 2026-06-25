export type { User } from "@/shared/types/user.types";

export interface UpdateCurrentUserPayload {
  fullName?: string;
  phoneNumber?: string;
  avatarUrl?: string;
}

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  userId: number;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}
