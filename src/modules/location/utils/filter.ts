import type { LocationQueryFilter } from "../api/location.api";

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 6;

const cleanString = (value?: string | null): string | undefined =>
  value?.trim() || undefined;

const parsePositiveInt = (value?: string | null): number | undefined => {
  if (!value) return undefined;
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : undefined;
};

const parseCsv = (value?: string | null): string[] | undefined => {
  const values = value
    ?.split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return values?.length ? values : undefined;
};

const parseOptionalBoolean = (value?: string | null): boolean | undefined => {
  if (value === "true" || value === "1") return true;
  if (value === "false" || value === "0") return false;
  return undefined;
};

export const parseFilterFromURL = (
  searchParams: URLSearchParams,
): LocationQueryFilter => ({
  searchValue: cleanString(searchParams.get("q")),
  locationTypeId: parsePositiveInt(searchParams.get("locationTypeId")),
  addressRegion: cleanString(searchParams.get("region")),
  amenityKeywords: parseCsv(searchParams.get("amenities")),
  bedroomCount: parsePositiveInt(searchParams.get("bedrooms")),
  ownerLiving: parseOptionalBoolean(searchParams.get("ownerLiving")),
  privateBathroom: parseOptionalBoolean(searchParams.get("privateBathroom")),
  furnitureLevel: cleanString(searchParams.get("furniture")),
  minPrice: parsePositiveInt(searchParams.get("minPrice")),
  maxPrice: parsePositiveInt(searchParams.get("maxPrice")),
  minArea: parsePositiveInt(searchParams.get("minArea")),
  maxArea: parsePositiveInt(searchParams.get("maxArea")),
  page: parsePositiveInt(searchParams.get("page")) ?? DEFAULT_PAGE,
  limit: parsePositiveInt(searchParams.get("limit")) ?? DEFAULT_LIMIT,
  sortBy: cleanString(searchParams.get("sortBy")),
  sortOrder: (searchParams.get("sortOrder") as "ASC" | "DESC") || undefined,
});

export const buildURLFromFilter = (
  filter: LocationQueryFilter,
): URLSearchParams => {
  const params = new URLSearchParams();

  if (filter.searchValue) params.set("q", filter.searchValue);
  if (filter.locationTypeId) {
    params.set("locationTypeId", String(filter.locationTypeId));
  }
  if (filter.addressRegion) params.set("region", filter.addressRegion);
  if (filter.amenityKeywords?.length) {
    params.set("amenities", filter.amenityKeywords.join(","));
  }
  if (filter.bedroomCount) params.set("bedrooms", String(filter.bedroomCount));
  if (filter.ownerLiving !== undefined) {
    params.set("ownerLiving", String(filter.ownerLiving));
  }
  if (filter.privateBathroom !== undefined) {
    params.set("privateBathroom", String(filter.privateBathroom));
  }
  if (filter.furnitureLevel) params.set("furniture", filter.furnitureLevel);
  if (filter.minPrice !== undefined) {
    params.set("minPrice", String(filter.minPrice));
  }
  if (filter.maxPrice !== undefined) {
    params.set("maxPrice", String(filter.maxPrice));
  }
  if (filter.minArea !== undefined) {
    params.set("minArea", String(filter.minArea));
  }
  if (filter.maxArea !== undefined) {
    params.set("maxArea", String(filter.maxArea));
  }
  if (filter.sortBy) params.set("sortBy", filter.sortBy);
  if (filter.sortOrder) params.set("sortOrder", filter.sortOrder);
  if ((filter.page ?? DEFAULT_PAGE) > DEFAULT_PAGE) {
    params.set("page", String(filter.page));
  }
  if ((filter.limit ?? DEFAULT_LIMIT) !== DEFAULT_LIMIT) {
    params.set("limit", String(filter.limit));
  }

  return params;
};
