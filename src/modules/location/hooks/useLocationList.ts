import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { ROUTER_PATH } from "@app/router/routes";
import {
  getLocationByFilter,
  normalizeLocationTypeCode,
} from "../api/location.api";
import { LocationEndpoint } from "../api/location.endpoints";
import type { ProfileLocationFilter } from "../types";
import { buildURLFromFilter, parseFilterFromURL } from "../utils/filter";

const DEFAULT_SEARCH_SUGGESTIONS = [
  "Ha Noi",
  "Phu Quoc",
  "Hoi An",
  "Quan Dong Da",
  "Duong Giai Phong",
];

const REGION_SUGGESTIONS: Record<string, string[]> = {
  north: ["Ha Noi", "Hai Phong", "Quang Ninh"],
  central: ["Da Nang", "Hoi An", "Hue"],
  south: ["Ho Chi Minh", "Phu Quoc", "Can Tho"],
};

export const useLocationList = () => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const hasHandledState = useRef(false);

  useEffect(() => {
    if (hasHandledState.current) return;
    const routeState = location.state as {
      rent?: string;
      location?: string;
    } | null;
    if (!routeState?.rent && !routeState?.location) return;

    hasHandledState.current = true;
    const params = new URLSearchParams(searchParams);

    if (routeState.rent) {
      const typeCode = normalizeLocationTypeCode(routeState.rent);
      if (typeCode) params.set("typeCode", typeCode);
    }
    if (routeState.location) {
      params.set("region", routeState.location);
    }

    navigate(`${ROUTER_PATH.LOCATIONS}?${params.toString()}`, {
      replace: true,
      state: null,
    });
  }, [location.state, navigate, searchParams]);

  const filter = parseFilterFromURL(searchParams);
  const scopedRegion = searchParams.get("region");
  const searchSuggestions =
    location.pathname.startsWith(ROUTER_PATH.LOCATIONS) && scopedRegion
      ? REGION_SUGGESTIONS[scopedRegion] || []
      : DEFAULT_SEARCH_SUGGESTIONS;

  const {
    data: locationData,
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isError,
    error,
    refetch,
  } = useInfiniteQuery({
    queryKey: [
      LocationEndpoint.GET_LOCATION_BY_FILTER,
      filter.searchValue,
      filter.locationType,
      filter.addressCity,
      filter.addressRegion,
      filter.minPrice,
      filter.maxPrice,
      filter.minArea,
      filter.maxArea,
      filter.sortBy,
      filter.sortOrder,
    ],
    queryFn: ({ pageParam = 1 }) =>
      getLocationByFilter({ ...filter, page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const currentPage = Number(lastPage.page) || 1;
      const totalPages = Number(lastPage.totalPages) || 1;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    placeholderData: keepPreviousData,
  });

  const updateFilter = useCallback(
    (newFilter: ProfileLocationFilter) => {
      const nextParams = buildURLFromFilter({
        ...newFilter,
        page: undefined,
      });
      setSearchParams(nextParams, {
        replace: true,
        preventScrollReset: true,
      });
    },
    [setSearchParams],
  );

  const handleSearch = useCallback(
    (keyword: string) => {
      const trimmed = keyword.trim();
      if (!trimmed) return;
      updateFilter({
        searchValue: trimmed,
      });
    },
    [updateFilter],
  );

  const handleFilterApply = useCallback(
    (sidebarFilter: ProfileLocationFilter) => {
      updateFilter({
        ...sidebarFilter,
        searchValue: filter.searchValue,
        addressRegion: filter.addressRegion,
      });
    },
    [filter.addressRegion, filter.searchValue, updateFilter],
  );

  const handleCardClick = useCallback(
    (code: string) => {
      navigate(ROUTER_PATH.LOCATION_DETAIL.replace(":code", code));
    },
    [navigate],
  );

  return {
    locationData,
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isError,
    error,
    refetch,
    searchSuggestions,
    filter,
    updateFilter,
    handleFilterApply,
    handleSearch,
    handleCardClick,
    isFilterOpen,
    setIsFilterOpen,
  };
};
