import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTER_PATH } from "@app/router";
import type { RegionKey } from "../types";
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

  const handleKeywordNavigate = (value: string) => {
    const keyword = value.trim();

    if (!keyword) {
      navigate(ROUTER_PATH.LOCATIONS);
      return;
    }

    navigate(`${ROUTER_PATH.LOCATIONS}?keyword=${encodeURIComponent(keyword)}`);
  };

  const handleSearch = (value: string) => {
    handleKeywordNavigate(value);
  };

  const handleViewDetail = (code: string) => {
    navigate(`${ROUTER_PATH.LOCATIONS}/${code}`);
  };

  const handleRegionClick = (region: RegionKey) => {
    navigate(`${ROUTER_PATH.LOCATIONS}?region=${region}`);
  };

  const handleViewAll = () => {
    navigate(ROUTER_PATH.LOCATIONS);
  };

  const handleViewNewest = () => {
    navigate(`${ROUTER_PATH.LOCATIONS}?sort=newest`);
  };

  return {
    data: homeDataQuery.data,
    isLoading: homeDataQuery.isLoading,
    isError: homeDataQuery.isError,
    selectedRegion,
    currentRegion,
    setSelectedRegion,
    handleSearch,
    handleKeywordNavigate,
    handleViewDetail,
    handleRegionClick,
    handleViewAll,
    handleViewNewest,
  };
};
