import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { ROUTER_PATH } from "@app/router";
import type { RegionKey } from "../types";
import { getfeaturedLocations, getNewLocations } from "../api/home.api";
import { HOME_QUERY_KEYS } from "@/shared/constants/queryKeys";
import { useHomeData } from "./useHomeData";

export const useHomePage = () => {
  const navigate = useNavigate();
  const [selectedRegion, setSelectedRegion] = useState<RegionKey>("north");
  const homeDataQuery = useHomeData();

  const currentRegion = useMemo(
    () =>
      homeDataQuery.data?.regions.find(
        (region) => region.key === selectedRegion,
      ),
    [homeDataQuery.data?.regions, selectedRegion],
  );

  const {
    data: featuredLocations,
    isLoading: isFeaturedLocationsLoading,
    isError: isFeaturedLocationsError,
  } = useQuery({
    queryKey: HOME_QUERY_KEYS.featuredLocations,
    queryFn: () => getfeaturedLocations(),
  });

  const {
    data: newLocations,
    isLoading: isNewLocationsLoading,
    isError: isNewLocationsError,
  } = useQuery({
    queryKey: HOME_QUERY_KEYS.newLocations,
    queryFn: () => getNewLocations(),
  });

  const data = useMemo(
    () =>
      homeDataQuery.data
        ? {
            ...homeDataQuery.data,
            featuredLocations,
            newLocations,
          }
        : undefined,
    [featuredLocations, homeDataQuery.data, newLocations],
  );

  const isLoading =
    homeDataQuery.isLoading ||
    isFeaturedLocationsLoading ||
    isNewLocationsLoading;
  const isError =
    homeDataQuery.isError || isFeaturedLocationsError || isNewLocationsError;

  const handleKeywordNavigate = (value: string) => {
    const keyword = value.trim();

    if (!keyword) {
      navigate(ROUTER_PATH.LOCATIONS);
      return;
    }

    navigate(`${ROUTER_PATH.LOCATIONS}?q=${encodeURIComponent(keyword)}`);
  };

  const handleSearch = (value: string) => {
    handleKeywordNavigate(value);
  };

  const handleViewDetail = (id: string | number) => {
    navigate(`${ROUTER_PATH.LOCATIONS}/${id}`);
  };

  const handleRegionClick = (region: RegionKey) => {
    navigate(`${ROUTER_PATH.LOCATIONS}?region=${region}`);
  };

  const handleViewHighestRating = () => {
    navigate(`${ROUTER_PATH.LOCATIONS}?sortBy=averageRating&sortOrder=DESC`);
  };

  const handleViewNewest = () => {
    navigate(`${ROUTER_PATH.LOCATIONS}?sortBy=createdAt&sortOrder=DESC`);
  };

  return {
    data,
    isLoading,
    isError,
    selectedRegion,
    currentRegion,
    setSelectedRegion,
    handleSearch,
    handleKeywordNavigate,
    handleViewDetail,
    handleRegionClick,
    handleViewHighestRating,
    handleViewNewest,
  };
};
