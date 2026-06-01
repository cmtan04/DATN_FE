import type { MapAddressDto, NominatimResponseDto } from "../types";
import {
  DEFAULT_LOCATION_LATITUDE,
  DEFAULT_LOCATION_LONGITUDE,
} from "./locationDefaults";

const trimText = (value?: string | null) => value?.trim() ?? "";

const uniqueParts = (parts: Array<string | undefined>) =>
  parts
    .map((part) => trimText(part))
    .filter(Boolean)
    .filter(
      (part, index, values) =>
        values.findIndex((value) => value === part) === index,
    );

const normalizeCityName = (value?: string): string =>
  trimText(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/^(thanh\s*pho|tp\.?|tinh)\s+/i, "")
    .replace(/\s+/g, " ");

const CITY_TO_REGION = [
  {
    label: "Mien Bac",
    cities: [
      "Ha Noi",
      "Hai Phong",
      "Tuyen Quang",
      "Lao Cai",
      "Thai Nguyen",
      "Phu Tho",
      "Bac Ninh",
      "Hung Yen",
      "Ninh Binh",
      "Lai Chau",
      "Dien Bien",
      "Son La",
      "Lang Son",
      "Quang Ninh",
      "Cao Bang",
    ],
  },
  {
    label: "Mien Trung",
    cities: [
      "Hue",
      "Da Nang",
      "Thanh Hoa",
      "Nghe An",
      "Ha Tinh",
      "Quang Tri",
      "Quang Ngai",
      "Gia Lai",
      "Khanh Hoa",
      "Lam Dong",
      "Dak Lak",
    ],
  },
  {
    label: "Mien Nam",
    cities: [
      "Thanh Pho Ho Chi Minh",
      "Can Tho",
      "Dong Nai",
      "Tay Ninh",
      "Vinh Long",
      "An Giang",
      "Dong Thap",
      "Ca Mau",
      "Thanh Pho Thu Duc",
    ],
  },
] as const;

export const getRegionByCity = (city?: string): string => {
  const normalizedCity = normalizeCityName(city);

  if (!normalizedCity) {
    return "";
  }

  const matchedRegion = CITY_TO_REGION.find((region) =>
    region.cities.some((cityName) => {
      const normalizedCandidate = normalizeCityName(cityName);

      return (
        normalizedCandidate === normalizedCity ||
        normalizedCandidate.includes(normalizedCity) ||
        normalizedCity.includes(normalizedCandidate)
      );
    }),
  );

  return matchedRegion?.label ?? "";
};

export const createEmptyMapAddress = (
  lat = DEFAULT_LOCATION_LATITUDE,
  lng = DEFAULT_LOCATION_LONGITUDE,
): MapAddressDto =>
  ({
  lat,
  long: lng,
  addressDetail: "",
  fullAddress: "",
  addressWard: "",
  addressCity: "",
  addressCountry: "",
  addressLat: String(lat),
  addressLong: String(lng),
  addressRegion: "",
}) as MapAddressDto;

export const buildAddressDetailFromNominatim = (
  data: NominatimResponseDto,
): string => {
  const address = data.address || {};
  const primaryLine = [
    address.tourism ||
      address.office ||
      address.amenity ||
      address.residential ||
      address.shop ||
      address.building,
    address.house_number ? `so ${address.house_number}` : undefined,
    address.road || address.pedestrian,
  ]
    .filter(Boolean)
    .join(", ")
    .trim();

  return primaryLine || " ";
};

export const createFullAddressFromNominatim = (
  data: NominatimResponseDto,
): string => {
  const address = data.address || {};

  return (
    uniqueParts([
      buildAddressDetailFromNominatim(data),
      address.suburb || address.neighbourhood || address.quarter,
      address.city_district || address.county,
      address.city || address.town || address.village,
      address.state || address.province,
      address.country,
    ]).join(", ") || trimText(data.display_name)
  );
};

export const createMapAddressFromNominatim = (
  data: NominatimResponseDto,
  lat: number,
  lng: number,
): MapAddressDto => {
  const address = data.address || {};
  const city = address.city || address.state || address.province || "";

  return {
    lat,
    long: lng,
    addressDetail: buildAddressDetailFromNominatim(data),
    fullAddress: createFullAddressFromNominatim(data),
    addressWard:
      address.suburb ||
      address.neighbourhood ||
      address.quarter ||
      address.city_district ||
      address.county ||
      address.village ||
      "",
    addressCity: city,
    addressCountry: address.country || "",
    addressLat: String(lat),
    addressLong: String(lng),
    addressRegion: address.region || getRegionByCity(city),
  } as MapAddressDto;
};
