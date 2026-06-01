import { useQuery } from "@tanstack/react-query";
import {
  getLocationByFilter,
  type LocationQueryFilter,
} from "../api/location.api";
import { LOCATION_QUERY_KEYS } from "../constants/queryKeys";

export const useLocationMapLocations = (
  filter: LocationQueryFilter,
  total: number,
  enabled: boolean,
) =>
  useQuery({
    queryKey: LOCATION_QUERY_KEYS.map(filter, total),
    queryFn: () =>
      getLocationByFilter({
        ...filter,
        page: 1,
        limit: Math.max(total, 1),
      }),
    enabled: enabled && total > 0,
  });
