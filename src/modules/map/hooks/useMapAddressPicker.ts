import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { hasDefaultCoordinates } from "@shared/constants/location";
import { getCurrentCoordinates } from "@shared/utils/geolocation";
import { reverseGeocode, searchPlaces } from "../api/nominatim";
import type {
  InitialMapAddress,
  MapAddressDto,
  MapCoordinates,
  NominatimResponseDto,
} from "../types";
import {
  createEmptyMapAddress,
  createMapAddressFromNominatim,
} from "../utils/address";

interface UseMapAddressPickerOptions {
  initialAddress?: InitialMapAddress | null;
  hasSearch?: boolean;
  debounceMs?: number;
  resultLimit?: number;
  onAddressResolved?: (value: MapAddressDto) => void;
}

export interface MapAddressSearchState {
  input: string;
  results: NominatimResponseDto[];
  isSearching: boolean;
  isDropdownOpen: boolean;
  onInputChange: (value: string) => void;
  onFocus: () => void;
  onSubmit: () => Promise<void>;
  onSelectResult: (result: NominatimResponseDto) => void;
  onOpenChange: (value: boolean) => void;
}

const createMapViewDataFromInitialAddress = (
  address?: InitialMapAddress | null,
): MapAddressDto =>
  createEmptyMapAddress(address?.latitude, address?.longitude);

// Hook nay gom tat ca cach chon vi tri cua man Map ve mot nguon du lieu chung.
// UI co the search dia chi, click truc tiep tren ban do, hoac tu dong lay vi tri hien tai;
// sau moi luong do, mapData luon la source of truth cho lat/lng va fullAddress.
export const useMapAddressPicker = ({
  initialAddress,
  hasSearch = false,
  debounceMs = 350,
  resultLimit = 5,
  onAddressResolved,
}: UseMapAddressPickerOptions) => {
  // initialAddress duoc xem la "da co dia chi that" neu co bat ky phan dia chi nao
  // hoac toa do khac toa do mac dinh. Neu khong co, hook se tu lay vi tri hien tai
  // de route /map khong bi dung mai o diem mac dinh.
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

  // mapData la state chinh ma page dung de dat tam ban do va goi API phong gan day.
  // Khi initialAddress hop le, khoi tao tu do; neu khong, dung empty/default truoc
  // roi effect ben duoi se thu lay vi tri hien tai cua trinh duyet.
  const [mapData, setMapData] = useState(() =>
    hasResolvedInitialAddress && initialAddress
      ? createMapViewDataFromInitialAddress(initialAddress)
      : createEmptyMapAddress(),
  );

  // searchInput tach rieng khoi mapData vi nguoi dung co the dang go tu khoa tam thoi,
  // chua chac da chon dia diem de cap nhat tam ban do.
  const [searchInput, setSearchInput] = useState(
    hasResolvedInitialAddress ? (initialAddress?.fullAddress ?? "") : "",
  );
  const [searchResults, setSearchResults] = useState<NominatimResponseDto[]>(
    [],
  );
  const [isSearching, setIsSearching] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Khi user chon suggestion hoac click ban do, hook se setSearchInput bang fullAddress
  // vua resolve duoc. Lan set input do chi de dong bo hien thi, khong phai mot lenh search moi,
  // nen ref nay giup bo qua dung mot chu ky effect tiep theo.
  const skipNextSearchRef = useRef(false);

  // React StrictMode co the chay effect nhieu hon mot lan trong dev. Ref nay dam bao
  // viec hoi navigator.geolocation chi duoc kich hoat mot lan cho moi mount cua hook.
  const hasRequestedCurrentLocationRef = useRef(false);

  useEffect(() => {
    const keyword = searchInput.trim();

    if (skipNextSearchRef.current) {
      skipNextSearchRef.current = false;
      return;
    }

    // Tat search hoac keyword qua ngan thi xoa suggestion va dong dropdown.
    // setTimeout(0) giu viec update state nam sau render hien tai, tranh canh tranh
    // voi cac handler dang chay khi input vua duoc cap nhat.
    if (!hasSearch || keyword.length < 2) {
      const timeoutId = globalThis.setTimeout(() => {
        setSearchResults([]);
        setIsSearching(false);
        setIsDropdownOpen(false);
      }, 0);

      return () => globalThis.clearTimeout(timeoutId);
    }

    // Debounce giup khong goi Nominatim sau moi phim bam. AbortController huy request cu
    // khi user tiep tuc go hoac component unmount, de ket qua cu khong ghi de ket qua moi.
    const controller = new AbortController();
    const timeoutId = globalThis.setTimeout(async () => {
      try {
        setIsSearching(true);
        const results = await searchPlaces(keyword, {
          signal: controller.signal,
          limit: resultLimit,
        });
        setSearchResults(results);
        setIsDropdownOpen(true);
      } catch (error) {
        // AbortError la luong binh thuong khi request bi huy, khong can hien loi.
        // Loi that thi mo dropdown voi danh sach rong de UI co the bao khong co ket qua.
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
      globalThis.clearTimeout(timeoutId);
    };
  }, [debounceMs, hasSearch, resultLimit, searchInput]);

  const applyResolvedResult = useCallback(
    (result: NominatimResponseDto) => {
      // Luong nay dung khi user chon suggestion hoac enter voi ket qua dau tien.
      // Nominatim tra lat/lon dang string, nen can parse ve number truoc khi dua vao mapData.
      const nextMapData = createMapAddressFromNominatim(
        result,
        Number.parseFloat(result.lat),
        Number.parseFloat(result.lon),
      );

      setMapData(nextMapData);
      setSearchResults([]);
      setIsDropdownOpen(false);

      // Dong bo input voi dia chi da chon nhung khong kick lai search suggestion.
      skipNextSearchRef.current = true;
      setSearchInput(nextMapData.fullAddress);
      onAddressResolved?.(nextMapData);
    },
    [onAddressResolved],
  );

  const resolveCoordinates = useCallback(
    async ({ lat, lng }: MapCoordinates) => {
      try {
        // Luong nay dung cho click tren ban do va lay current location: ta da co toa do,
        // nhung can reverse geocode de hien thi fullAddress de doc hon trong o search.
        const result = await reverseGeocode(lat, lng);
        const nextMapData = createMapAddressFromNominatim(result, lat, lng);
        setMapData(nextMapData);
        skipNextSearchRef.current = true;
        setSearchInput(nextMapData.fullAddress);
        onAddressResolved?.(nextMapData);
      } catch {
        // Neu reverse geocode loi, van cap nhat toa do de map/query gan day tiep tuc hoat dong.
        // fullAddress luc nay la chuoi fallback tu createEmptyMapAddress.
        const nextMapData = createEmptyMapAddress(lat, lng);
        setMapData(nextMapData);
        onAddressResolved?.(nextMapData);
      }
    },
    [onAddressResolved],
  );

  useEffect(() => {
    // Neu da co initialAddress that thi ton trong du lieu dau vao, khong tu lay location nua.
    // Neu chua co, hook chi hoi vi tri hien tai mot lan roi resolve thanh mapData.
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
    // Enter se uu tien ket qua dang hien co, giup user khong phai click suggestion dau tien.
    if (searchResults.length > 0) {
      applyResolvedResult(searchResults[0]);
      return;
    }

    const keyword = searchInput.trim();
    if (!keyword) {
      return;
    }

    try {
      // Neu dropdown chua co ket qua, submit se search nhanh 1 ket qua phu hop nhat.
      const results = await searchPlaces(keyword, { limit: 1 });
      if (results[0]) {
        applyResolvedResult(results[0]);
      }
    } catch {
      setSearchResults([]);
      setIsDropdownOpen(true);
    }
  }, [applyResolvedResult, searchInput, searchResults]);

  const searchState = useMemo<MapAddressSearchState | undefined>(
    () =>
      // searchState chi duoc expose khi man hinh can UI search. Cac noi chi can click map
      // co the dung hook ma khong phai render/quan ly dropdown suggestion.
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
