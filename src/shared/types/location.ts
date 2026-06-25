export type LocationSortBy = "price" | "area" | "averageRating" | "createdAt";
export type LocationSortOrder = "ASC" | "DESC";

export interface GetLocationsQuery {
  page: number;
  limit: number;
  guestCount?: number;
  quantity?: number;
  startDate?: string;
  endDate?: string;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  locationTypeId?: number;
  keyword?: string;
  sortBy?: LocationSortBy;
  sortOrder?: LocationSortOrder;
  lat?: number;
  lng?: number;
  radiusKm?: number;
}

export interface LocationAddress {
  id: number;
  fullAddress: string;
  lat: number;
  lng: number;
  province?: string;
  district?: string;
  country?: string;
  region?: string;
  normalFullAddress?: string;
}

export interface LocationType {
  id: number;
  name: string;
  code: string;
  canHaveMultiRoom?: boolean;
}

export interface LocationMedia {
  id: number;
  type: string;
  url: string;
  displayOrder?: number;
}

export interface LocationOwner {
  id: number;
  fullName: string | null;
  phoneNumber: string | null;
}

export interface LocationServiceItem {
  name: string;
  isFree: boolean;
  price?: number;
  priceUnit?: string;
  isActive: boolean;
}

export interface LocationListItem {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  priceUnit: string;
  area: number;
  maxGuestCount: number;
  averageRating: number;
  isFavourite: boolean;
  address: LocationAddress | null;
  type: LocationType | null;
  thumbnailMedia: LocationMedia | null;
}

export interface GetLocationsResponse {
  data: LocationListItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface LocationDetail {
  id: number;
  name: string;
  description?: string | null;
  owner: LocationOwner | null;
  price: number;
  priceUnit: string;
  area: number;
  maxGuestCount: number;
  averageRating: number;
  isFavourite: boolean;
  createdAt: string;
  address: LocationAddress | null;
  type: LocationType | null;
  media: LocationMedia[];
  services: LocationServiceItem[];
}

export type GetLocationDetailResponse = LocationDetail | null;

export type BookingStatus =
  | "CREATED"
  | "PENDING_PAYMENT"
  | "CONFIRMED"
  | "CANCELLED"
  | "EXPIRED";

export interface GetAvailableRoomsRequest {
  locationId: number;
  startDate: string | Date; // Thường FE gửi lên API dạng string (ISO string) hoặc đối tượng Date
  endDate: string | Date;
}

export interface GetAvailableRoomsResponse {
  availableRooms: number;
}

export interface CreateBookingRequest {
  locationId: number;
  startDate: string | Date;
  endDate: string | Date;
  roomNumber: number;
  note?: string; // Dấu ? giữ nguyên vì đây là trường optional
  totalAmount: number;
  currency: string;
}

export interface Booking {
  id: number;
  bookingCode: string;
  locationId: number;
  startDate: string | Date;
  endDate: string | Date;
  roomNumber: number;
  note?: string;
  status: BookingStatus;
  totalAmount: number;
  currency: string;
}

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

export interface LocationRadiusSearchParam {
  lat: number;
  lng: number;
  radiusKm: number;
  page?: number;
  limit?: number;
}
