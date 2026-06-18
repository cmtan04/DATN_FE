import { Slider } from "antd";
import { isAxiosError } from "axios";
import { useMemo, useState } from "react";
import type { MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTER_PATH } from "@app/router/routes";
import {
  LocationMapCanvas,
  LocationMapSearch,
  LocationResultPanel,
} from "../components";
import {
  DEFAULT_MAP_ERROR_MESSAGE,
  DEFAULT_RADIUS_KM,
  MAX_RADIUS_KM,
  MIN_RADIUS_KM,
  RADIUS_STEP_KM,
} from "../constants";
import { useMapAddressPicker } from "../hooks/useMapAddressPicker";
import { useNearbyLocations } from "../hooks/useNearbyLocations";
import { formatRadius } from "../utils/locationMap";
import type { LocationListItem } from "../../location/types";
import "./style.scss";

type LocationId = LocationListItem["id"];

export const LocationMap = () => {
  const navigate = useNavigate();
  const { mapData, resolveCoordinates, searchState } = useMapAddressPicker({
    hasSearch: true,
  });
  const center = useMemo<[number, number]>(
    () => [mapData.lat, mapData.long],
    [mapData.lat, mapData.long],
  );
  // sliderRadiusKm cap nhat lien tuc de hien thi UI muot; radiusKm chi doi khi tha slider de tranh goi API lien tuc.
  const [sliderRadiusKm, setSliderRadiusKm] = useState(DEFAULT_RADIUS_KM);
  const [radiusKm, setRadiusKm] = useState(DEFAULT_RADIUS_KM);
  const [activePopupLocationId, setActivePopupLocationId] =
    useState<LocationId | null>(null);

  // Search dia chi va click ban do deu quy ve mapData; query phong gan day chi can lat/lng/radiusKm.
  const { data, isLoading, isFetching, isError, error, refetch } =
    useNearbyLocations({
      lat: mapData.lat,
      lng: mapData.long,
      radiusKm,
    });

  const locations = data?.data ?? [];
  const total = data?.meta.total ?? locations.length;
  const errorMessage = isAxiosError(error)
    ? ((error.response?.data as { message?: string } | undefined)?.message ??
      DEFAULT_MAP_ERROR_MESSAGE)
    : DEFAULT_MAP_ERROR_MESSAGE;

  const handleOpenDetail = (locationItem: LocationListItem) => {
    navigate(
      ROUTER_PATH.LOCATION_DETAIL.replace(":id", String(locationItem.id)),
    );
  };

  const handlePopupClose = (id: LocationId) => {
    setActivePopupLocationId((currentId) =>
      currentId === id ? null : currentId,
    );
  };

  const handleOverlayClick = (event: MouseEvent<HTMLButtonElement>) => {
    // Overlay nam tren ban do de click ngoai popup chi dong popup, khong de Leaflet nhan click va doi toa do/marker.
    event.preventDefault();
    event.stopPropagation();
    setActivePopupLocationId(null);
  };

  return (
    <main className="location-map">
      <div className="location-map__header">
        <div>
          <h1 className="location-map__title">Tim phong gan ban</h1>
          <p className="location-map__subtitle">
            Chon vi tri tren ban do hoac tim dia chi de xem phong trong ban
            kinh.
          </p>
        </div>
        <div className="location-map__radius">
          <div className="location-map__radius-head">
            <span className="location-map__radius-label">
              Ban kinh tim kiem
            </span>
            <strong className="location-map__radius-value">
              {formatRadius(sliderRadiusKm)}
            </strong>
          </div>
          <Slider
            min={MIN_RADIUS_KM}
            max={MAX_RADIUS_KM}
            step={RADIUS_STEP_KM}
            value={sliderRadiusKm}
            tooltip={{ formatter: (value) => formatRadius(value ?? 0) }}
            onChange={(value) => setSliderRadiusKm(value)}
            onChangeComplete={(value) => setRadiusKm(value)}
          />
        </div>
      </div>

      <div className="location-map__layout">
        <div className="location-map__map-wrap">
          {searchState && <LocationMapSearch searchState={searchState} />}
          {activePopupLocationId !== null && (
            <button
              type="button"
              aria-label="Dong popup ban do"
              className="location-map__popup-overlay"
              onMouseDown={handleOverlayClick}
              onClick={handleOverlayClick}
            />
          )}
          <LocationMapCanvas
            center={center}
            radiusKm={radiusKm}
            locations={locations}
            activePopupLocationId={activePopupLocationId}
            onCoordinateSelect={(value) => {
              void resolveCoordinates(value);
            }}
            onOpenDetail={handleOpenDetail}
            onPopupOpen={setActivePopupLocationId}
            onPopupClose={handlePopupClose}
          />
        </div>

        <LocationResultPanel
          locations={locations}
          radiusKm={radiusKm}
          total={total}
          isLoading={isLoading}
          isFetching={isFetching}
          isError={isError}
          errorMessage={errorMessage}
          onRetry={() => void refetch()}
          onOpenDetail={handleOpenDetail}
        />
      </div>
    </main>
  );
};
