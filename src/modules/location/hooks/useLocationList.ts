import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useRef } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { ROUTER_PATH } from "@app/router/routes";
import {
  getLocationByFilter,
  type LocationQueryFilter,
} from "../api/location.api";
import { LOCATION_QUERY_KEYS } from "../constants/queryKeys";
import { buildURLFromFilter, parseFilterFromURL } from "../utils/filter";

export const useLocationList = () => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const navigate = useNavigate();
  const hasHandledState = useRef(false);

  useEffect(() => {
    if (hasHandledState.current) return;
    const routeState = location.state as {
      location?: string;
      guestCount?: string;
    } | null;
    if (!routeState?.location && !routeState?.guestCount) return;

    hasHandledState.current = true;
    const params = new URLSearchParams(searchParams);
    if (routeState.location) {
      params.set("region", routeState.location);
    }
    if (routeState.guestCount) {
      params.set("guestCount", routeState.guestCount);
    }

    navigate(`${ROUTER_PATH.LOCATIONS}?${params.toString()}`, {
      replace: true,
      state: null,
    });
  }, [location.state, navigate, searchParams]);

  const filter = parseFilterFromURL(searchParams);

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
    queryKey: LOCATION_QUERY_KEYS.list(filter),
    queryFn: ({ pageParam = 1 }) =>
      getLocationByFilter({ ...filter, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const currentPage = Number(lastPage.meta.page) || 1;
      const totalPages = Number(lastPage.meta.totalPages) || 1;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    placeholderData: keepPreviousData,
  });

  const locations = locationData?.pages.flatMap((page) => page.data) ?? [];
  const total = locationData?.pages[0]?.meta.total ?? 0;
  const isEmpty = !isLoading && !isError && locations.length === 0;

  const updateFilter = useCallback(
    (newFilter: LocationQueryFilter) => {
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
    (keyword: string, guestCount?: number) => {
      const trimmed = keyword.trim();
      if (!trimmed) return;
      updateFilter({
        ...filter,
        searchValue: trimmed,
        guestCount,
      });
    },
    [filter, updateFilter],
  );

  const handleFilterApply = useCallback(
    (sidebarFilter: LocationQueryFilter) => {
      updateFilter({
        ...sidebarFilter,
        searchValue: filter.searchValue,
        guestCount: filter.guestCount,
      });
    },
    [filter.guestCount, filter.searchValue, updateFilter],
  );

  const openLocationDetail = useCallback(
    (id: string | number) => {
      navigate(ROUTER_PATH.LOCATION_DETAIL.replace(":id", String(id)));
    },
    [navigate],
  );

  return {
    locations,
    total,
    isEmpty,
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isError,
    error,
    refetch,
    filter,
    updateFilter,
    handleFilterApply,
    handleSearch,
    openLocationDetail,
  };
};
