export type {
  GetLocationDetailResponse,
  GetLocationsQuery,
  GetLocationsResponse,
  LocationAddress,
  LocationDetail,
  LocationListItem,
  LocationMedia,
  LocationOwner,
  LocationServiceItem,
  LocationSortBy,
  LocationSortOrder,
  LocationType,
} from "@shared/types/location";

export interface UpdateLocationServicePayload {
  name: string;
  isFree: boolean;
  price?: number;
  priceUnit?: string;
  isActive?: boolean;
}

export interface UpdateLocationContentPayload {
  description?: string;
  services?: UpdateLocationServicePayload[];
}

export interface LocationRadiusSearchParamDto {
  lat: number;
  lng: number;
  radiusKm: number;
  page?: number;
  limit?: number;
}
