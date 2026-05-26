import type { ProfileLocationFilter } from "../types";

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 6;

const cleanString = (value?: string | null): string | undefined =>
  value?.trim() || undefined;

const parsePositiveInt = (value?: string | null): number | undefined => {
  if (!value) return undefined;
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : undefined;
};

export const parseFilterFromURL = (
  searchParams: URLSearchParams,
): ProfileLocationFilter => ({
  searchValue: cleanString(searchParams.get("q")),
  locationType: cleanString(searchParams.get("typeCode")),
  addressCity: cleanString(searchParams.get("city")),
  addressRegion: cleanString(searchParams.get("region")),
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
  filter: ProfileLocationFilter,
): URLSearchParams => {
  const params = new URLSearchParams();

  if (filter.searchValue) params.set("q", filter.searchValue);
  if (filter.locationType) params.set("typeCode", filter.locationType);
  if (filter.addressCity) params.set("city", filter.addressCity);
  if (filter.addressRegion) params.set("region", filter.addressRegion);
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
