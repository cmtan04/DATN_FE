export interface MapCoordinates {
  lat: number;
  lng: number;
}

export interface InitialMapAddress {
  fullAddress?: string;
  addressDetail?: string;
  ward?: string;
  city?: string;
  country?: string;
  region?: string;
  latitude?: number;
  longitude?: number;
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
