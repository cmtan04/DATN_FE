import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { ROUTER_PATH } from "@app/router/routes";
import { useAuth } from "@app/providers/useAuth";
import { getLocationDetail, getRelatedLocations } from "../api/location.api";
import { LOCATION_QUERY_KEYS } from "../constants/queryKeys";
import {
  getLocationDescriptionMediaItems,
  getLocationDisplayAddresses,
  getLocationGalleryItems,
} from "../utils/locationDetailFormatters";
import { resolveMediaUrl } from "../utils/media";

const DEFAULT_MESSAGE = "Da co loi xay ra. Vui long thu lai.";

interface UseLocationDetailOptions {
  includeSimilar?: boolean;
}

export const useLocationDetail = (
  id?: string,
  { includeSimilar = true }: UseLocationDetailOptions = {},
) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const detailQuery = useQuery({
    queryKey: LOCATION_QUERY_KEYS.detail(id ?? ""),
    queryFn: () => getLocationDetail(id as string),
    enabled: Boolean(id),
  });

  const location = detailQuery.data;
  const similarLocations = useQuery({
    queryKey: LOCATION_QUERY_KEYS.related(id ?? ""),
    queryFn: () => getRelatedLocations(id as string),
    enabled: Boolean(includeSimilar && id && location?.id),
  });

  const galleryItems = useMemo(
    () => (location ? getLocationGalleryItems(location) : []),
    [location],
  );
  const descriptionMediaItems = useMemo(
    () => (location ? getLocationDescriptionMediaItems(location) : []),
    [location],
  );
  const addresses = useMemo(
    () => (location ? getLocationDisplayAddresses(location) : []),
    [location],
  );
  const activeServices = useMemo(
    () => location?.services?.filter((service) => service.isActive !== 0) ?? [],
    [location?.services],
  );
  const includedServices = useMemo(
    () => activeServices.filter((service) => service.isFree),
    [activeServices],
  );
  const addonServices = useMemo(
    () => activeServices.filter((service) => !service.isFree),
    [activeServices],
  );
  const heroBackgroundMedia = galleryItems.find(
    (media) => media.type === "image" || media.type === "image360",
  );
  const heroBackgroundImage = heroBackgroundMedia?.url
    ? resolveMediaUrl(heroBackgroundMedia.url)
    : undefined;
  const primaryAddress = addresses[0];
  const isOwner = Boolean(user?.id && location?.owner?.id === user.id);
  const errorMessage = isAxiosError(detailQuery.error)
    ? ((detailQuery.error.response?.data as { message?: string } | undefined)
        ?.message ?? DEFAULT_MESSAGE)
    : DEFAULT_MESSAGE;

  const handleBackToList = () => {
    navigate(ROUTER_PATH.LOCATIONS);
  };

  const handleOpenSimilarLocation = (locationId: string | number) => {
    navigate(
      `/${ROUTER_PATH.LOCATION_DETAIL.replace(":id", String(locationId))}`,
    );
  };

  const handleOpenBooking = () => {
    if (!location?.id) return;

    navigate(
      `/${ROUTER_PATH.LOCATION_BOOKING.replace(":id", String(location.id))}`,
    );
  };

  return {
    ...detailQuery,
    addonServices,
    addresses,
    data: detailQuery.data,
    descriptionMediaItems,
    errorMessage,
    galleryItems,
    handleBackToList,
    handleOpenBooking,
    handleOpenSimilarLocation,
    heroBackgroundImage,
    includedServices,
    isOwner,
    isSimilarLoading: similarLocations.isLoading,
    location,
    primaryAddress,
    similarLocationItems: similarLocations.data?.data ?? [],
  };
};
