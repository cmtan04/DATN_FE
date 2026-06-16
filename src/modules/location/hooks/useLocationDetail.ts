import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { ROUTER_PATH } from "@app/router/routes";
import { useAuth } from "@app/providers/useAuth";
import { useProtectedNavigation } from "@shared/hooks/useProtectedNavigation";
import { getLocationDetail, getRelatedLocations } from "../api/location.api";
import { LOCATION_QUERY_KEYS } from "../constants/queryKeys";
import { useToggleLocationFavorite } from "./useToggleLocationFavorite";
import { message } from "antd";

const DEFAULT_MESSAGE = "Đã có lỗi xảy ra. Vui lòng thử lại!";

interface UseLocationDetailOptions {
  includeSimilar?: boolean;
}

export const useLocationDetail = (
  id?: string,
  { includeSimilar = true }: UseLocationDetailOptions = {},
) => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const toggleFavoriteMutation = useToggleLocationFavorite();
  const navigateToProtectedRoute = useProtectedNavigation();

  const locationDetailQuery = useQuery({
    queryKey: LOCATION_QUERY_KEYS.detail(id ?? ""),
    queryFn: () => getLocationDetail(id as string),
    enabled: Boolean(id),
  });

  const location = locationDetailQuery.data;

  // 2. Định nghĩa state liked ban đầu là false
  const [liked, setLiked] = useState<boolean>(false);

  // 3. Đồng bộ trạng thái liked từ API khi dữ liệu location tải xong
  useEffect(() => {
    if (location) {
      // Hãy thay thế `location.isFavourite` bằng thuộc tính thực tế trong object location của bạn
      setLiked(Boolean(location.isFavourite));
    }
  }, [location]);

  const relatedLocationsQuery = useQuery({
    queryKey: LOCATION_QUERY_KEYS.related(id ?? ""),
    queryFn: () => getRelatedLocations(id as string),
    enabled: Boolean(includeSimilar && id && location?.id),
  });

  const isOwner = Boolean(user?.id && location?.owner?.id === user.id);

  const handleBackToList = () => {
    navigate(ROUTER_PATH.LOCATIONS);
  };

  const handleOpenRelatedLocation = (locationId: string | number) => {
    navigate(
      `/${ROUTER_PATH.LOCATION_DETAIL.replace(":id", String(locationId))}`,
    );
  };

  const handleOpenBooking = () => {
    if (!location?.id) return;

    navigateToProtectedRoute(
      `/${ROUTER_PATH.LOCATION_BOOKING.replace(":id", String(location.id))}`,
    );
  };
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
    toggleFavoriteMutation
      .mutateAsync(Number(id))
      .then((response) => {
        setLiked(response.isFavourite);
        message.success(
          response.isFavourite
            ? "Đã thêm địa điểm vào yêu thích!"
            : "Đã bỏ yêu thích địa điểm!",
        );
      })
      .catch((error) => {
        message.error(
          `Đã có lỗi xảy ra khi ${liked ? "bỏ" : "thêm"} địa điểm yêu thích. Vui lòng thử lại!`,
        );
        console.error("Toggle favorite error:", error);
      });
  };
  return {
    location,
    isLoading: locationDetailQuery.isLoading,
    isError: locationDetailQuery.isError,
    isFetching: locationDetailQuery.isFetching,
    errorMessage: DEFAULT_MESSAGE,
    isOwner,
    liked,
    isTogglingFavorite: toggleFavoriteMutation.isPending,
    isRelatedLocationLoading: relatedLocationsQuery.isLoading,
    relatedLocations: relatedLocationsQuery.data?.data ?? [],
    refetch: locationDetailQuery.refetch,
    handleBackToList,
    handleOpenBooking,
    handleOpenRelatedLocation,
    handleToggleFavourite,
  };
};
