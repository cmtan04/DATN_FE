import type {
  LocationAddressDto,
  LocationDetailDto,
  LocationMediaDto,
  LocationServiceDto,
} from "../types";

const LOCATION_GALLERY_MEDIA_TYPES = ["image", "video", "image360"];

const isGalleryMedia = (
  media?: LocationMediaDto | null,
): media is LocationMediaDto =>
  Boolean(media?.url && LOCATION_GALLERY_MEDIA_TYPES.includes(media.type));

const sortLocationMediaByDisplayOrder = (
  mediaItems: LocationMediaDto[],
): LocationMediaDto[] =>
  [...mediaItems].sort(
    (firstMedia, secondMedia) =>
      Number(firstMedia.displayOrder ?? Number.MAX_SAFE_INTEGER) -
      Number(secondMedia.displayOrder ?? Number.MAX_SAFE_INTEGER),
  );

export const formatLocationPrice = (price?: number, unit?: string) => {
  const value = Number(price ?? 0);
  if (!value) return "Lien he";

  return `${value.toLocaleString()} VND${unit ? `/${unit}` : ""}`;
};

export const formatLocationArea = (area?: number | null) =>
  typeof area === "number" && area > 0 ? `${area} m2` : "Chua cap nhat";

export const formatLocationDate = (value?: string | Date) => {
  if (!value) return "Chua cap nhat";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleDateString("vi-VN");
};

export const getLocationGalleryItems = (
  location: LocationDetailDto,
): LocationMediaDto[] => {
  const galleryMedia = sortLocationMediaByDisplayOrder(
    location.media?.filter(isGalleryMedia) ?? [],
  );

  if (galleryMedia.length) {
    return galleryMedia;
  }

  return isGalleryMedia(location.thumbnailMedia) ? [location.thumbnailMedia] : [];
};

export const getLocationDescriptionMediaItems = (
  location: LocationDetailDto,
): LocationMediaDto[] => {
  return (
    location.media?.filter((media) =>
      ["image", "video", "image360"].includes(media.type),
    ) ?? []
  );
};

export const getLocationServiceDescription = (
  service: LocationServiceDto,
) => (service.isFree ? "Mien phi" : "Dich vu tinh phi");

export const getLocationDisplayAddresses = (
  location: LocationDetailDto,
): LocationAddressDto[] => {
  return location.address ? [location.address] : [];
};

export const hasValidLocationCoordinates = (
  address?: LocationAddressDto,
): address is LocationAddressDto & { lat: number; lng: number } =>
  typeof address?.lat === "number" &&
  Number.isFinite(address.lat) &&
  typeof address.lng === "number" &&
  Number.isFinite(address.lng);
