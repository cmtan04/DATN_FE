import { create } from "zustand";

interface NotificationItem {
  id: number;
  message: string;
  isRead: boolean;
}

interface NotificationState {
  notifications: NotificationItem[];
  isOpen: boolean;
  addNotification: (message: string) => void;
  toggleOpen: () => void;
  markAsRead: (id: number) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  isOpen: false,

  addNotification: (message: string) =>
    set((state) => ({
      notifications: [
        { id: Date.now(), message, isRead: false },
        ...state.notifications,
      ],
    })),

  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),

  markAsRead: (id: number) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n,
      ),
    })),
}));
