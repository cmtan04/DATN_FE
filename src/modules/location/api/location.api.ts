import { axiosClient } from "@shared/services/axiosClient";
import type {
  LocationDetailDto,
  LocationFilterDto,
  LocationRadiusSearchParamDto,
  LocationTypeDto,
  PaginatedLocationDto,
} from "../types";
import { LocationEndpoint } from "./location.endpoints";

export type LocationQueryFilter = Omit<
  Partial<LocationFilterDto>,
  "sortBy" | "sortOrder"
> & {
  searchValue?: string;
  locationTypeId?: number;
  addressRegion?: string;
  amenityKeywords?: string[];
  bedroomCount?: number;
  ownerLiving?: boolean;
  privateBathroom?: boolean;
  furnitureLevel?: string;
  hasRent?: number;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
};

const toLocationQueryParams = (filter: LocationQueryFilter) => ({
  keyword: filter.searchValue ?? filter.keyword,
  locationTypeId: filter.locationTypeId,
  addressRegion: filter.addressRegion ?? filter.region,
  amenityKeywords: filter.amenityKeywords?.join(","),
  bedroomCount: filter.bedroomCount,
  ownerLiving: filter.ownerLiving,
  privateBathroom: filter.privateBathroom,
  furnitureLevel: filter.furnitureLevel,
  minPrice: filter.minPrice,
  maxPrice: filter.maxPrice,
  minArea: filter.minArea,
  maxArea: filter.maxArea,
  page: filter.page,
  limit: filter.limit,
  sortBy: filter.sortBy,
  sortOrder: filter.sortOrder,
});

export const getAllLocationType = async (): Promise<LocationTypeDto[]> => {
  const response = await axiosClient.get<LocationTypeDto[]>(
    LocationEndpoint.GET_ALL_LOCATION_TYPE,
  );

  return [{ id: 0, name: "Tất cả" }, ...response.data];
};

export const getLocationByFilter = async (
  filter: LocationQueryFilter,
): Promise<PaginatedLocationDto> => {
  const response = await axiosClient.get<PaginatedLocationDto>(
    LocationEndpoint.GET_LOCATIONS,
    { params: toLocationQueryParams(filter) },
  );

  return response.data;
};

export const getLocationsNearCoordinates = async (
  params: LocationRadiusSearchParamDto,
): Promise<PaginatedLocationDto> => {
  const response = await axiosClient.get<PaginatedLocationDto>(
    LocationEndpoint.GET_LOCATIONS,
    { params },
  );

  return response.data;
};

export const getLocationDetail = async (
  id: string | number,
): Promise<LocationDetailDto> => {
  const response = await axiosClient.get<{ data: LocationDetailDto[] }>(
    `${LocationEndpoint.GET_LOCATION_BY_CODE}/${id}`,
  );

  return response.data.data[0];
};

export const getRelatedLocations = async (
  id: string | number,
): Promise<PaginatedLocationDto> => {
  const response = await axiosClient.get<PaginatedLocationDto>(
    `${LocationEndpoint.GET_RELATED_LOCATIONS}`.replace(":id", String(id)),
  );
  return response.data;
};
