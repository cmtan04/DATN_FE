export type LocationSortBy = "price" | "area" | "rating" | "createdAt";
export type LocationSortOrder = "ASC" | "DESC";

export interface LocationFilterDto {
  page: number;
  limit: number;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  locationTypeId?: number;
  region?: string;
  keyword?: string;
  sortBy: LocationSortBy;
  sortOrder: LocationSortOrder;
}

export interface LocationTypeDto {
  id?: number;
  name: string;
  code?: string;
}

export interface LocationPricingDto {
  price: number;
  priceUnit: string;
  priceAfterDeal?: number;
}

export interface LocationAddressDto {
  id: number;
  fullAddress: string;
  province: string;
  district: string;
  country: string;
  region: string;
  lat: number;
  lng: number;
}

export interface LocationMediaDto {
  id: number;
  url: string;
  type: "image" | "video" | "image360" | string;
  displayOrder?: number;
}

export interface LocationServiceDto {
  id: number;
  name: string;
  isFree: boolean;
  price?: number;
  priceUnit?: string;
  isActive?: boolean | number;
}

export interface LocationOwnerDto {
  id: number;
  fullName: string | null;
  phone: string | null;
}

export interface LocationDto {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  priceUnit: string;
  area: number;
  averageRating: number;
  createdAt: string;
  type: LocationTypeDto | null;
  address?: LocationAddressDto;
  thumbnailMedia?: LocationMediaDto;
}

export interface LocationDetailDto extends LocationDto {
  owner: LocationOwnerDto | null;
  media?: LocationMediaDto[];
  services?: LocationServiceDto[];
}

export interface PaginatedLocationDto {
  data: LocationDto[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
