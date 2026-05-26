export interface ProfileLocationFilter {
  searchValue?: string;
  hasRent?: number;
  locationType?: string;
  typeName?: string;
  addressDistrict?: string;
  addressCity?: string;
  addressRegion?: string;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}

export interface LocationTypeDto {
  typeCode: string;
  typeName: string;
  typeDescription?: string;
  typeLogo?: string;
  typeBackGround?: string;
}

export interface LocationPricingDto {
  price: number;
  priceUnit: string;
  priceAfterDeal?: number;
}

export interface LocationAvailabilityDto {
  hasTimeLimit?: boolean;
  availableFrom?: string;
  availableTo?: string;
  isRented?: boolean;
}

export interface LocationAddressDto {
  addressCode?: string;
  addressDetail?: string;
  fullAddress: string;
  ward: string;
  city: string;
  country: string;
  region: string;
  latitude: number;
  longitude: number;
  description?: string;
  note?: string;
  name?: string;
  district?: string;
  province?: string;
  postalCode?: string;
}

export interface AddressDto {
  addressCode?: string;
  addressName: string;
  fullAddress: string;
  addressWard: string;
  addressDistrict: string;
  addressCity: string;
  addressProvince: string;
  addressCountry: string;
  addressPortal: string;
  addressLat: string;
  addressLong: string;
  addressRegion: string;
  addressDescription?: string;
  addressNote?: string;
  addressStatus?: string;
  addressType?: string;
}

export interface LocationMediaDto {
  mediaCode?: string;
  url: string;
  type: "IMAGE" | "VIDEO";
  displayOrder?: number;
  isLogo?: boolean;
}

export interface LocationOwnerDto {
  userCode: string;
  username: string;
  email: string;
  avatarUrl?: string | null;
  phone?: string | null;
  fullAddress?: string | null;
  city?: string | null;
}

export interface LocationTypeSummaryDto {
  code: string;
  name: string;
  description?: string;
  logo?: string;
  background?: string;
}

export interface LocationSummaryDto {
  locationCode: string;
  name: string;
  description?: string;
  note?: string;
  logo?: string;
  area?: number | null;
  rating: number;
  pricing: LocationPricingDto;
  availability: LocationAvailabilityDto;
  type: LocationTypeSummaryDto;
  primaryAddress: LocationAddressDto | null;
  owner: LocationOwnerDto;
  distanceKm?: number;
}

export interface ServiceDto {
  serviceCode: string;
  serviceName: string;
  description?: string;
  serviceDescription?: string;
  serviceLogo?: string;
  servicePrice?: number | string;
  servicePriceType?: "FREE" | "PAID";
  serviceDiscount?: number;
  isActive?: boolean | number;
}

export interface LocationDetailApiDto extends LocationSummaryDto {
  addresses: LocationAddressDto[];
  services: ServiceDto[];
  media: LocationMediaDto[];
}

export interface PaginatedLocationApiDto {
  data: LocationSummaryDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface LocationDto {
  locationCode: string;
  typeCode: string;
  typeName: string;
  typeDescription?: string;
  typeLogo?: string;
  typeBackGround?: string;
  locationName: string;
  locationDescription?: string;
  locationNote?: string;
  locationLogo?: string;
  locationPrice: number;
  locationPriceUnit: string;
  locationPriceAfterDeal: number;
  locationArea?: number | null;
  minTime?: string;
  maxTime?: string;
  hasRent: number;
  renterCode: string | null;
  locationRate: number;
  ownerCode: string;
  ownerName: string;
  ownerEmail: string;
  ownerAvatar?: string | null;
  ownerPhone?: string | null;
  ownerAddress?: string | null;
  ownerCity?: string | null;
  distanceKm?: number;
  services?: ServiceDto[];
  address?: AddressDto[];
  media?: LocationMediaDto[];
}

export interface PaginatedLocationDto {
  data: LocationDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
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
  addressDetail: string;
  fullAddress: string;
  addressWard: string;
  addressCity: string;
  addressCountry: string;
  addressLat: string;
  addressLong: string;
  addressRegion: string;
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
