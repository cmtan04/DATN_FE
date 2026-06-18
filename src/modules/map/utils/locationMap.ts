import type { LocationListItem } from "../../location/types";

export const parseCoordinate = (value?: string | number | null) => {
  const parsed =
    typeof value === "number" ? value : Number.parseFloat(String(value ?? ""));

  return Number.isFinite(parsed) ? parsed : undefined;
};

export const formatLocationMapPrice = (price: number, unit?: string) =>
  `${price.toLocaleString()} VND${unit ? `/${unit}` : ""}`;

export const formatRadius = (radiusKm: number) =>
  `${Number.isInteger(radiusKm) ? radiusKm : radiusKm.toFixed(1)} km`;

export const getLocationMapPosition = (
  location: LocationListItem,
): [number, number] | null => {
  const lat = parseCoordinate(location.address?.lat);
  const lng = parseCoordinate(location.address?.lng);

  if (lat === undefined || lng === undefined) {
    return null;
  }

  return [lat, lng];
};
