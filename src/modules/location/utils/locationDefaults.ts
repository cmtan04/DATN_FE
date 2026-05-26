export const DEFAULT_LOCATION_LATITUDE = 21.0285;
export const DEFAULT_LOCATION_LONGITUDE = 105.8542;

export const hasDefaultCoordinates = (
  latitude?: number | null,
  longitude?: number | null,
) =>
  latitude === DEFAULT_LOCATION_LATITUDE &&
  longitude === DEFAULT_LOCATION_LONGITUDE;
