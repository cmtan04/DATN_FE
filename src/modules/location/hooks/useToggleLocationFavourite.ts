import { useMutation, useQueryClient } from "@tanstack/react-query";
import { HOME_QUERY_KEYS } from "@modules/home/constants/queryKeys";
import { toggleFavoriteLocation } from "../api/location.api";
import { LOCATION_QUERY_KEYS } from "../constants/queryKeys";
import type { LocationDetail } from "../types";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { message } from "antd";

export const useToggleLocationFavourite = (
  id: string | number,
  initialLiked: boolean,
) => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  const toggleFavouriteMutation = useMutation({
    mutationFn: () => toggleFavoriteLocation(id),
    onSuccess: (response) => {
      queryClient.setQueryData<LocationDetail | null>(
        LOCATION_QUERY_KEYS.detail(id),
        (currentLocation) =>
          currentLocation
            ? { ...currentLocation, isFavourite: response.isFavourite }
            : currentLocation,
      );

      void queryClient.invalidateQueries({
        queryKey: HOME_QUERY_KEYS.featuredLocations,
      });
      void queryClient.invalidateQueries({
        queryKey: HOME_QUERY_KEYS.newLocations,
      });
      void queryClient.invalidateQueries({
        queryKey: LOCATION_QUERY_KEYS.all,
      });
    },
  });

  const handleToggleFavourite = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.stopPropagation();
    if (!isAuthenticated) {
      message.info(
        "Vui lòng đăng nhập để thêm địa điểm vào danh sách yêu thích!",
      );
      return;
    }
    toggleFavouriteMutation
      .mutateAsync()
      .then((response) => {
        message.success(
          response.isFavourite
            ? "Đã thêm địa điểm vào yêu thích!"
            : "Đã bỏ yêu thích địa điểm!",
        );
      })
      .catch((error) => {
        message.error(`Đã có lỗi xảy ra. Vui lòng thử lại!`);
        console.error("Toggle favorite error:", error);
      });
  };

  return {
    handleToggleFavourite,
    isTogglingFavourite: toggleFavouriteMutation.isPending,
    liked: toggleFavouriteMutation.data?.isFavourite ?? initialLiked,
  };
};
