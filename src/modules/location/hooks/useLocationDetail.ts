import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { ROUTER_PATH } from "@app/router/routes";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { useProtectedNavigation } from "@shared/hooks/useProtectedNavigation";
import { getLocationDetail, getRelatedLocations } from "../api/location.api";
import { LOCATION_QUERY_KEYS } from "../constants/queryKeys";

const DEFAULT_MESSAGE = "Đã có lỗi xảy ra. Vui lòng thử lại!";

interface UseLocationDetailOptions {
  includeSimilar?: boolean;
}

export const useLocationDetail = (
  id?: string,
  { includeSimilar = true }: UseLocationDetailOptions = {},
) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const navigateToProtectedRoute = useProtectedNavigation();

  const locationDetailQuery = useQuery({
    queryKey: LOCATION_QUERY_KEYS.detail(id ?? ""),
    queryFn: () => getLocationDetail(id as string),
    enabled: Boolean(id),
  });

  const location = locationDetailQuery.data;

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

  return {
    location,
    isLoading: locationDetailQuery.isLoading,
    isError: locationDetailQuery.isError,
    isFetching: locationDetailQuery.isFetching,
    errorMessage: DEFAULT_MESSAGE,
    isOwner,
    isRelatedLocationLoading: relatedLocationsQuery.isLoading,
    relatedLocations: relatedLocationsQuery.data?.data ?? [],
    refetch: locationDetailQuery.refetch,
    handleBackToList,
    handleOpenBooking,
    handleOpenRelatedLocation,
  };
};
