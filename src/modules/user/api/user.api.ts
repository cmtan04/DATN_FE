import { axiosClient } from "@shared/services/axiosClient";
import { USER_ENDPOINTS } from "./user.endpoints";
import type {
  ChangePasswordPayload,
  NotificationItem,
  UpdateCurrentUserPayload,
  User,
} from "../type";
import dayjs from "dayjs";

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

  async changePassword(
    payload: ChangePasswordPayload,
  ): Promise<{ message: string }> {
    const { data } = await axiosClient.post(
      USER_ENDPOINTS.CHANGE_PASSWORD,
      payload,
    );
    return data;
  },

  async getUserBookings(): Promise<any[]> {
    const { data } = await axiosClient.get<any[]>("/booking");

    return data.map((b) => {
      const checkInDate = dayjs(b.startDate);
      const checkOutDate = dayjs(b.endDate);
      const nights = Math.max(1, checkOutDate.diff(checkInDate, "day"));

      let mappedStatus: any = "pending";
      const upperStatus = b.status.toUpperCase();
      if (upperStatus === "CONFIRMED") {
        if (dayjs().isAfter(checkOutDate)) {
          mappedStatus = "completed";
        } else {
          mappedStatus = "confirmed";
        }
      } else if (upperStatus === "PENDING_PAYMENT" || upperStatus === "CREATED") {
        mappedStatus = "pending";
      } else if (upperStatus === "CANCELLED" || upperStatus === "EXPIRED") {
        mappedStatus = "cancelled";
      }

      return {
        id: String(b.id),
        hotelId: Number(b.location.id),
        hotelName: b.location.name,
        hotelImg: b.location.thumbnailUrl || "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=280&fit=crop&auto=format",
        hotelLocation: b.location.address || "Chua cap nhat dia chi",
        roomName: b.location.name,
        roomSize: `${b.location.area}m²`,
        checkIn: checkInDate.format("YYYY-MM-DD"),
        checkOut: checkOutDate.format("YYYY-MM-DD"),
        nights: nights,
        guests: b.guestCount || 1,
        pricePerNight: b.location.price,
        subtotal: b.totalAmount,
        tax: 0,
        total: b.totalAmount,
        status: mappedStatus,
        bookedAt: b.createdAt,
        confirmationCode: b.bookingCode,
      };
    });
  },
  async cancelBooking(bookingId: string | number): Promise<void> {
    await axiosClient.delete(`/booking/${bookingId}`);
  },
};
