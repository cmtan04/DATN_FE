import { axiosClient } from "@shared/services/axiosClient";
import type {
  LocationAddressDto,
  LocationDetailApiDto,
  LocationDto,
  LocationRadiusSearchParamDto,
  LocationSummaryDto,
  LocationTypeDto,
  PaginatedLocationApiDto,
  PaginatedLocationDto,
  ProfileLocationFilter,
} from "../types";
import { LocationEndpoint } from "./location.endpoints";

const LOCATION_TYPE_CODE_MAP: Record<string, string> = {
  motel: "ROOM",
  room: "ROOM",
  apartment: "APARTMENT",
  office: "OFFICE",
  "full-house": "HOUSE",
  full_house: "HOUSE",
  house: "HOUSE",
  dorm: "DORM",
  venue: "SHOP",
  shop: "SHOP",
};

export const normalizeLocationTypeCode = (value?: string | null) => {
  if (!value) return undefined;

  return value
    .split(",")
    .map((item) => {
      const trimmedValue = item.trim();
      return LOCATION_TYPE_CODE_MAP[trimmedValue.toLowerCase()] ?? trimmedValue;
    })
    .filter(Boolean)
    .join(",");
};

const mapAddress = (address: LocationAddressDto) => ({
  addressCode: address.addressCode,
  addressName: address.addressDetail ?? "",
  fullAddress: address.fullAddress,
  addressWard: address.ward,
  addressDistrict: address.ward,
  addressCity: address.city,
  addressProvince: address.city,
  addressCountry: address.country,
  addressPortal: "",
  addressLat: String(address.latitude),
  addressLong: String(address.longitude),
  addressRegion: address.region,
  addressDescription: address.description,
  addressNote: address.note,
  addressStatus: "0",
  addressType: "1",
});

const mapLocationSummary = (location: LocationSummaryDto): LocationDto => ({
  locationCode: location.locationCode,
  typeCode: location.type.code,
  typeName: location.type.name,
  typeDescription: location.type.description,
  typeLogo: location.type.logo,
  typeBackGround: location.type.background,
  locationName: location.name,
  locationDescription: location.description,
  locationNote: location.note,
  locationLogo: location.logo,
  locationPrice: Number(location.pricing.price ?? 0),
  locationPriceUnit: location.pricing.priceUnit || "thang",
  locationPriceAfterDeal: Number(location.pricing.priceAfterDeal ?? 0),
  locationArea: location.area,
  minTime: location.availability.availableFrom,
  maxTime: location.availability.availableTo,
  hasRent: location.availability.isRented ? 1 : 0,
  renterCode: location.availability.isRented ? "RENTED" : null,
  locationRate: Number(location.rating ?? 0),
  ownerCode: location.owner.userCode,
  ownerName: location.owner.username,
  ownerEmail: location.owner.email,
  ownerAvatar: location.owner.avatarUrl,
  ownerPhone: location.owner.phone,
  ownerAddress: location.owner.fullAddress,
  ownerCity: location.owner.city,
  distanceKm:
    typeof location.distanceKm === "number"
      ? Number(location.distanceKm)
      : undefined,
  address: location.primaryAddress ? [mapAddress(location.primaryAddress)] : [],
  services: [],
  media: [],
});

const mapLocationDetail = (location: LocationDetailApiDto): LocationDto => ({
  ...mapLocationSummary(location),
  services: location.services?.map((service) => ({
    ...service,
    servicePrice: Number(service.servicePrice ?? 0),
    isActive: 1,
  })),
  address: location.addresses?.map(mapAddress),
  media: location.media,
});

const mapLocationListResponse = (
  response: PaginatedLocationApiDto,
): PaginatedLocationDto => ({
  ...response,
  data: response.data.map(mapLocationSummary),
});

const toLocationQueryParams = (filter: ProfileLocationFilter) => ({
  keyword: filter.searchValue,
  typeCode: normalizeLocationTypeCode(filter.locationType),
  typeName: filter.typeName,
  addressCity: filter.addressCity,
  addressRegion: filter.addressRegion,
  minPrice: filter.minPrice,
  maxPrice: filter.maxPrice,
  minArea: filter.minArea,
  maxArea: filter.maxArea,
  isRented:
    typeof filter.hasRent === "number"
      ? Number(filter.hasRent) === 1
      : undefined,
  page: filter.page,
  limit: filter.limit,
  sortBy: filter.sortBy,
  sortOrder: filter.sortOrder,
});

export const getAllLocationType = async (): Promise<LocationTypeDto[]> => {
  const response = await axiosClient.get<LocationTypeDto[]>(
    LocationEndpoint.GET_ALL_LOCATION_TYPE,
  );

  return response.data.map((type) => ({
    typeCode: type.typeCode,
    typeName: type.typeName,
    typeDescription: type.typeDescription,
    typeLogo: type.typeLogo,
    typeBackGround: type.typeBackGround,
  }));
};

export const getLocationByFilter = async (
  filter: ProfileLocationFilter,
): Promise<PaginatedLocationDto> => {
  const response = await axiosClient.get<PaginatedLocationApiDto>(
    LocationEndpoint.GET_LOCATIONS,
    { params: toLocationQueryParams(filter) },
  );

  return mapLocationListResponse(response.data);
};

export const getLocationsNearCoordinates = async (
  params: LocationRadiusSearchParamDto,
): Promise<PaginatedLocationDto> => {
  const response = await axiosClient.get<PaginatedLocationApiDto>(
    LocationEndpoint.GET_LOCATIONS,
    { params },
  );

  return mapLocationListResponse(response.data);
};

export const getLocationByCode = async (
  locationCode: string,
): Promise<LocationDto> => {
  const response = await axiosClient.get<LocationDetailApiDto>(
    `${LocationEndpoint.GET_LOCATION_BY_CODE}/${locationCode}`,
  );

  return mapLocationDetail(response.data);
};
