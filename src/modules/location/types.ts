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

export interface MapAddressDto {
  lat: number;
  long: number;
  fullAddress: string;
}

export interface NominatimResponseDto {
  lat: string;
  lon: string;
  display_name: string;
  address?: {
    tourism?: string;
    office?: string;
    residential?: string;
    amenity?: string;
    shop?: string;
    building?: string;
    house_number?: string;
    road?: string;
    pedestrian?: string;
    hamlet?: string;
    suburb?: string;
    neighbourhood?: string;
    quarter?: string;
    village?: string;
    city_district?: string;
    county?: string;
    city?: string;
    town?: string;
    state?: string;
    province?: string;
    region?: string;
    state_district?: string;
    country?: string;
    postcode?: string;
  };
}
