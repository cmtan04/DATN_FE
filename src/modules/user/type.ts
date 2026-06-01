export interface User {
  id: number;
  email: string;
  userRole?: number;
  ownerRequestStatus?: number;
  status?: string;
  fullName?: string;
  phoneNumber?: string;
  profile?: {
    fullName: string;
    phoneNumber: string;
    avatarUrl?: string;
  } | null;
}

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
