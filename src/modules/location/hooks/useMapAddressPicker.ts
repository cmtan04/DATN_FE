import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { reverseGeocode, searchPlaces } from "../api/nominatim";
import type { MapAddressDto, NominatimResponseDto } from "../types";
import {
  createEmptyMapAddress,
  createMapAddressFromNominatim,
} from "../utils/address";
import { getCurrentCoordinates } from "../utils/geolocation";
import { hasDefaultCoordinates } from "../utils/locationDefaults";

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

interface UseMapAddressPickerOptions {
  initialAddress?: InitialMapAddress | null;
  hasSearch?: boolean;
  debounceMs?: number;
  resultLimit?: number;
  onAddressResolved?: (value: MapAddressDto) => void;
}

const createMapViewDataFromInitialAddress = (
  address?: InitialMapAddress | null,
): MapAddressDto =>
  createEmptyMapAddress(address?.latitude, address?.longitude);

export const useMapAddressPicker = ({
  initialAddress,
  hasSearch = false,
  debounceMs = 350,
  resultLimit = 5,
  onAddressResolved,
}: UseMapAddressPickerOptions) => {
  const hasResolvedInitialAddress = Boolean(
    initialAddress?.fullAddress?.trim() ||
      initialAddress?.addressDetail?.trim() ||
      initialAddress?.ward?.trim() ||
      initialAddress?.city?.trim() ||
      initialAddress?.country?.trim() ||
      !hasDefaultCoordinates(
        initialAddress?.latitude,
        initialAddress?.longitude,
      ),
  );
  const [mapData, setMapData] = useState(() =>
    hasResolvedInitialAddress && initialAddress
      ? createMapViewDataFromInitialAddress(initialAddress)
      : createEmptyMapAddress(),
  );
  const [searchInput, setSearchInput] = useState(
    hasResolvedInitialAddress ? (initialAddress?.fullAddress ?? "") : "",
  );
  const [searchResults, setSearchResults] = useState<NominatimResponseDto[]>(
    [],
  );
  const [isSearching, setIsSearching] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const skipNextSearchRef = useRef(false);
  const hasRequestedCurrentLocationRef = useRef(false);

  useEffect(() => {
    const keyword = searchInput.trim();

    if (skipNextSearchRef.current) {
      skipNextSearchRef.current = false;
      return;
    }

    if (!hasSearch || keyword.length < 2) {
      const timeoutId = window.setTimeout(() => {
        setSearchResults([]);
        setIsSearching(false);
        setIsDropdownOpen(false);
      }, 0);

      return () => window.clearTimeout(timeoutId);
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(async () => {
      try {
        setIsSearching(true);
        const results = await searchPlaces(keyword, {
          signal: controller.signal,
          limit: resultLimit,
        });
        setSearchResults(results);
        setIsDropdownOpen(true);
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          setSearchResults([]);
          setIsDropdownOpen(true);
        }
      } finally {
        setIsSearching(false);
      }
    }, debounceMs);

    return () => {
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, [debounceMs, hasSearch, resultLimit, searchInput]);

  const applyResolvedResult = useCallback(
    (result: NominatimResponseDto) => {
      const nextMapData = createMapAddressFromNominatim(
        result,
        Number.parseFloat(result.lat),
        Number.parseFloat(result.lon),
      );

      setMapData(nextMapData);
      setSearchResults([]);
      setIsDropdownOpen(false);
      skipNextSearchRef.current = true;
      setSearchInput(nextMapData.fullAddress);
      onAddressResolved?.(nextMapData);
    },
    [onAddressResolved],
  );

  const resolveCoordinates = useCallback(
    async ({ lat, lng }: MapCoordinates) => {
      try {
        const result = await reverseGeocode(lat, lng);
        const nextMapData = createMapAddressFromNominatim(result, lat, lng);
        setMapData(nextMapData);
        skipNextSearchRef.current = true;
        setSearchInput(nextMapData.fullAddress);
        onAddressResolved?.(nextMapData);
      } catch {
        const nextMapData = createEmptyMapAddress(lat, lng);
        setMapData(nextMapData);
        onAddressResolved?.(nextMapData);
      }
    },
    [onAddressResolved],
  );

  useEffect(() => {
    if (hasResolvedInitialAddress || hasRequestedCurrentLocationRef.current) {
      return;
    }

    hasRequestedCurrentLocationRef.current = true;

    void (async () => {
      const currentCoordinates = await getCurrentCoordinates();
      await resolveCoordinates(currentCoordinates);
    })();
  }, [hasResolvedInitialAddress, resolveCoordinates]);

  const handleSearchSubmit = useCallback(async () => {
    if (searchResults.length > 0) {
      applyResolvedResult(searchResults[0]);
      return;
    }

    const keyword = searchInput.trim();
    if (!keyword) {
      return;
    }

    try {
      const results = await searchPlaces(keyword, { limit: 1 });
      if (results[0]) {
        applyResolvedResult(results[0]);
      }
    } catch {
      setSearchResults([]);
      setIsDropdownOpen(true);
    }
  }, [applyResolvedResult, searchInput, searchResults]);

  const searchState = useMemo(
    () =>
      hasSearch
        ? {
            input: searchInput,
            results: searchResults,
            isSearching,
            isDropdownOpen,
            onInputChange: setSearchInput,
            onFocus: () => {
              if (searchResults.length > 0) {
                setIsDropdownOpen(true);
              }
            },
            onSubmit: handleSearchSubmit,
            onSelectResult: applyResolvedResult,
            onOpenChange: setIsDropdownOpen,
          }
        : undefined,
    [
      applyResolvedResult,
      handleSearchSubmit,
      hasSearch,
      isDropdownOpen,
      isSearching,
      searchInput,
      searchResults,
    ],
  );

  return {
    mapData,
    setMapData,
    resolveCoordinates,
    searchState,
  };
};
