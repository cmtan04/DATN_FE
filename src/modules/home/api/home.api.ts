import { axiosClient } from "@shared/services/axiosClient";
import type {
  GetLocationsResponse,
  LocationListItem,
} from "@shared/types/location";

export const getfeaturedLocations = async (): Promise<LocationListItem[]> => {
  const response = await axiosClient.get<GetLocationsResponse>("/locations", {
    params: {
      page: 1,
      limit: 4,
      sortBy: "averageRating",
      sortOrder: "DESC",
    },
  });

  return response.data.data;
};

export const getNewLocations = async (): Promise<LocationListItem[]> => {
  const response = await axiosClient.get<GetLocationsResponse>("/locations", {
    params: {
      page: 1,
      limit: 4,
      sortBy: "createdAt",
      sortOrder: "DESC",
    },
  });

  return response.data.data;
};
