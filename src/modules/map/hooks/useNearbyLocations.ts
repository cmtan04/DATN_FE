import { useQuery } from "@tanstack/react-query";
import { getLocationsNearCoordinates } from "../../location/api/location.api";

const DEFAULT_LIMIT = 100;

export const MAP_QUERY_KEYS = {
  nearbyLocations: (lat: number, lng: number, radiusKm: number) =>
    ["map", "nearby-locations", lat, lng, radiusKm] as const,
};

export const useNearbyLocations = ({
  lat,
  lng,
  radiusKm,
}: {
  lat: number;
  lng: number;
  radiusKm: number;
}) =>
  useQuery({
    // Danh sach phong gan day phu thuoc truc tiep vao tam ban do va ban kinh.
    queryKey: MAP_QUERY_KEYS.nearbyLocations(lat, lng, radiusKm),
    queryFn: () =>
      getLocationsNearCoordinates({
        lat,
        lng,
        radiusKm,
        page: 1,
        limit: DEFAULT_LIMIT,
      }),
    enabled: Number.isFinite(lat) && Number.isFinite(lng),
  });
