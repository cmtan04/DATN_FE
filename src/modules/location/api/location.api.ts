import { axiosClient } from "@shared/services/axiosClient";
import type {
  GetLocationsQuery,
  GetLocationsResponse,
  LocationDetail,
  LocationRadiusSearchParamDto,
  LocationType,
} from "../types";
import { LocationEndpoint } from "./location.endpoints";

export type LocationQueryFilter = Omit<
  Partial<GetLocationsQuery>,
  "sortBy" | "sortOrder"
> & {
  searchValue?: string;
  locationTypeId?: number;
  guestCount?: number;
  hasRent?: number;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
};

const toLocationQueryParams = (filter: LocationQueryFilter) => ({
  keyword: filter.searchValue ?? filter.keyword,
  locationTypeId: filter.locationTypeId,
  guestCount: filter.guestCount,
  minPrice: filter.minPrice,
  maxPrice: filter.maxPrice,
  minArea: filter.minArea,
  maxArea: filter.maxArea,
  page: filter.page,
  limit: filter.limit,
  sortBy: filter.sortBy,
  sortOrder: filter.sortOrder,
});

export const getAllLocationType = async (): Promise<LocationType[]> => {
  const response = await axiosClient.get<LocationType[]>(
    LocationEndpoint.GET_ALL_LOCATION_TYPE,
  );

  return [{ id: 0, name: "Tat ca", code: "ALL" }, ...response.data];
};

export const getLocationByFilter = async (
  filter: LocationQueryFilter,
): Promise<GetLocationsResponse> => {
  const response = await axiosClient.get<GetLocationsResponse>(
    LocationEndpoint.GET_LOCATIONS,
    { params: toLocationQueryParams(filter) },
  );

  return response.data;
};

export const getLocationsNearCoordinates = async (
  params: LocationRadiusSearchParamDto,
): Promise<GetLocationsResponse> => {
  const response = await axiosClient.get<GetLocationsResponse>(
    LocationEndpoint.GET_LOCATIONS,
    { params },
  );

  return response.data;
};

export const getLocationDetail = async (
  id: string | number,
): Promise<LocationDetail | null> => {
  const response = await axiosClient.get<unknown>(
    `${LocationEndpoint.GET_LOCATION_BY_CODE}/${id}`,
  );

  return response.data as LocationDetail;
};

export const getRelatedLocations = async (
  id: string | number,
): Promise<GetLocationsResponse> => {
  const response = await axiosClient.get<GetLocationsResponse>(
    `${LocationEndpoint.GET_RELATED_LOCATIONS}`.replace(":id", String(id)),
  );

  return response.data;
};

export const toggleFavoriteLocation = async (
  id: string | number,
): Promise<{ isFavourite: boolean }> => {
  const response = await axiosClient.post<any>(
    LocationEndpoint.TOGGLE_FAVORITE_LOCATION(id),
  );
  return { isFavourite: response.data.isFavourite };
};

export const getAvailableRooms = async (params: {
  locationId: string | number;
  startDate: string;
  endDate: string;
}): Promise<number> => {
  const response = await axiosClient.get<any>(
    LocationEndpoint.GET_AVAILABLE_ROOMS,
    { params },
  );
  return response.data.availableRooms;
};
