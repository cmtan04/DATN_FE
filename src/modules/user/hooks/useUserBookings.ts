import { useQuery } from "@tanstack/react-query";
import { userApi } from "../api/user.api";

export const useUserBookings = () => {
  return useQuery({
    queryKey: ["user-bookings"],
    queryFn: () => userApi.getUserBookings(),
  });
};
