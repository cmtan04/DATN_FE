import { axiosClient } from "@shared/services/axiosClient";
import type {
  LocationDto,
  PaginatedLocationDto,
} from "@shared/types/location";

export const getfeaturedLocations = async (): Promise<LocationDto[]> => {
  const response = await axiosClient.get<PaginatedLocationDto>("/locations", {
    params: {
      page: 1,
      limit: 4,
      sortBy: "rating",
      sortOrder: "DESC",
    },
  });

  return response.data.data;
};

export const getNewLocations = async (): Promise<LocationDto[]> => {
  const response = await axiosClient.get<PaginatedLocationDto>("/locations", {
    params: {
      page: 1,
      limit: 4,
      sortBy: "createdAt",
      sortOrder: "DESC",
    },
  });

  return response.data.data;
};
