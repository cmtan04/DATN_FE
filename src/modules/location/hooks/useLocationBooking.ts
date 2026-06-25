import { useMutation } from "@tanstack/react-query";
import { useProtectedNavigation } from "@shared/hooks/useProtectedNavigation";
import {
  createBooking,
  updateBookingStatus,
} from "../api/location.api";
import type { BookingStatus } from "../types";
import { ROUTER_PATH } from "@/app/router/routes";

export const useLocationBooking = (locationid: string | number) => {
  const navigateToProtectedRoute = useProtectedNavigation();

  const createBookingMutation = useMutation({
    mutationFn: (params: {
      locationId: string | number;
      startDate: string;
      endDate: string;
      totalAmount?: number;
      roomNumber?: number;
      currency?: string;
    }) => {
      return createBooking({
        locationId: Number(params.locationId),
        startDate: params.startDate,
        endDate: params.endDate,
        totalAmount: params.totalAmount ?? 0,
        roomNumber: params.roomNumber ?? 1,
        currency: params.currency || "vnd",
      });
    },
    onSettled: () => {
      navigateToProtectedRoute(
        `/${ROUTER_PATH.LOCATION_BOOKING.replace(":id", String(locationid))}`,
      );
    },
  });

  const updateBookingStatusMutation = useMutation({
    mutationFn: (params: {
      bookingId: string | number;
      status: BookingStatus;
    }) => {
      return updateBookingStatus(params);
    },
    onSuccess: () => {
      // Handle successful booking status update, e.g., show a success message or refresh booking details
      alert("Booking status updated successfully!");
    },
    onError: () => {
      // Handle errors, e.g., show an error message
      alert("Failed to update booking status. Please try again.");
    },
  });

  const cancelBookingMutation = useMutation({
    mutationFn: async (bookingId: string | number) => {
      const { userApi } = await import("@modules/user/api/user.api");
      return userApi.cancelBooking(bookingId);
    },
    onSuccess: () => {
      // Handle successful booking cancellation, e.g., show a success message or refresh booking list
      alert("Booking cancelled successfully!");
    },
    onError: () => {
      // Handle errors, e.g., show an error message
      alert("Failed to cancel booking. Please try again.");
    },
  });
  return {
    createBooking: createBookingMutation.mutateAsync,
    updateBookingStatus: updateBookingStatusMutation.mutateAsync,
    cancelBooking: cancelBookingMutation.mutateAsync,
  };
};
