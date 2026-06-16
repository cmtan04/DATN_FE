import { useMutation, useQueryClient } from "@tanstack/react-query";
import { HOME_QUERY_KEYS } from "@modules/home/constants/queryKeys";
import { toggleFavoriteLocation } from "../api/location.api";
import { LOCATION_QUERY_KEYS } from "../constants/queryKeys";
import type { LocationDetail } from "../types";

export const useToggleLocationFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) => toggleFavoriteLocation(id),
    onSuccess: (response, id) => {
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
};
