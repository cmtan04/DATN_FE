import {
  EnvironmentOutlined,
  SearchOutlined,
  TagOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Button, Input, Radio, Spin } from "antd";
import { isAxiosError } from "axios";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Circle,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import { ROUTER_PATH } from "@app/router/routes";
import { getLocationsNearCoordinates } from "../../location/api/location.api";
import { useMapAddressPicker } from "../../location/hooks/useMapAddressPicker";
import type { LocationDto } from "../../location/types";
import "./style.scss";

const SEARCH_RADIUS_OPTIONS = [1, 3, 5, 10] as const;
const DEFAULT_RADIUS_KM = 3;
const DEFAULT_LIMIT = 100;
const DEFAULT_MESSAGE = "Da co loi xay ra. Vui long thu lai.";

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const SearchIcon = L.divIcon({
  className: "location-map__search-marker",
  html: "<span></span>",
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface LocationMapCanvasProps {
  center: [number, number];
  radiusKm: number;
  locations: LocationDto[];
  onCoordinateSelect: (value: { lat: number; lng: number }) => void;
  onOpenDetail: (location: LocationDto) => void;
}

const parseCoordinate = (value?: string | number | null) => {
  const parsed =
    typeof value === "number" ? value : Number.parseFloat(String(value ?? ""));

  return Number.isFinite(parsed) ? parsed : undefined;
};

const formatPrice = (price: number, unit?: string) =>
  `${price.toLocaleString()} VND${unit ? `/${unit}` : ""}`;

const getLocationPosition = (
  location: LocationDto,
): [number, number] | null => {
  const lat = parseCoordinate(location.address?.lat);
  const lng = parseCoordinate(location.address?.lng);

  if (lat === undefined || lng === undefined) {
    return null;
  }

  return [lat, lng];
};

const ChangeMapView = ({ center }: { center: [number, number] }) => {
  const map = useMap();

  useEffect(() => {
    map.setView(center, map.getZoom() || 14);
  }, [center, map]);

  return null;
};

const MapClickHandler = ({
  onCoordinateSelect,
}: {
  onCoordinateSelect: (value: { lat: number; lng: number }) => void;
}) => {
  useMapEvents({
    click(event) {
      onCoordinateSelect({
        lat: event.latlng.lat,
        lng: event.latlng.lng,
      });
    },
  });

  return null;
};

const LocationMapCanvas = ({
  center,
  radiusKm,
  locations,
  onCoordinateSelect,
  onOpenDetail,
}: LocationMapCanvasProps) => (
  <MapContainer center={center} zoom={14} className="location-map__canvas">
    <ChangeMapView center={center} />
    <MapClickHandler onCoordinateSelect={onCoordinateSelect} />
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    <Circle
      center={center}
      radius={radiusKm * 1000}
      pathOptions={{
        color: "#1677ff",
        fillColor: "#1677ff",
        fillOpacity: 0.08,
      }}
    />
    <Marker position={center} icon={SearchIcon} />

    {locations.map((location) => {
      const position = getLocationPosition(location);
      const address = location.address?.fullAddress;
      const price = location.price;

      if (!position) {
        return null;
      }

      return (
        <Marker key={location.id} position={position}>
          <Popup>
            <div className="location-map__popup">
              {location.thumbnailMedia?.url && (
                <img
                  className="location-map__popup-image"
                  src={location.thumbnailMedia.url}
                  alt=""
                />
              )}
              <h3 className="location-map__popup-title">{location.name}</h3>
              <p className="location-map__popup-address">
                <EnvironmentOutlined /> {address}
              </p>
              <p className="location-map__popup-price">
                <TagOutlined /> {formatPrice(price, location.priceUnit)}
              </p>
              <Button
                type="primary"
                block
                onClick={() => onOpenDetail(location)}
              >
                Xem chi tiet
              </Button>
            </div>
          </Popup>
        </Marker>
      );
    })}
  </MapContainer>
);

export const LocationMap = () => {
  const navigate = useNavigate();
  const { mapData, resolveCoordinates, searchState } = useMapAddressPicker({
    hasSearch: true,
  });
  const center = useMemo<[number, number]>(
    () => [mapData.lat, mapData.long],
    [mapData.lat, mapData.long],
  );
  const [radiusKm, setRadiusKm] =
    useState<(typeof SEARCH_RADIUS_OPTIONS)[number]>(DEFAULT_RADIUS_KM);

  const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
    queryKey: [
      "locations-near-coordinates",
      mapData.lat,
      mapData.long,
      radiusKm,
    ],
    queryFn: () =>
      getLocationsNearCoordinates({
        lat: mapData.lat,
        lng: mapData.long,
        radiusKm,
        page: 1,
        limit: DEFAULT_LIMIT,
      }),
    enabled: Number.isFinite(mapData.lat) && Number.isFinite(mapData.long),
  });

  const locations = data?.data ?? [];
  const errorMessage = isAxiosError(error)
    ? ((error.response?.data as { message?: string } | undefined)?.message ??
      DEFAULT_MESSAGE)
    : DEFAULT_MESSAGE;

  const handleOpenDetail = (locationItem: LocationDto) => {
    navigate(
      ROUTER_PATH.LOCATION_DETAIL.replace(":id", String(locationItem.id)),
    );
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
        <Radio.Group
          className="location-map__radius"
          value={radiusKm}
          onChange={(event) => setRadiusKm(event.target.value)}
          optionType="button"
          buttonStyle="solid"
          options={SEARCH_RADIUS_OPTIONS.map((value) => ({
            label: `${value} km`,
            value,
          }))}
        />
      </div>

      <div className="location-map__layout">
        <div className="location-map__map-wrap">
          <div className="location-map__search">
            <Input
              placeholder="Tim kiem dia diem..."
              prefix={<SearchOutlined />}
              size="large"
              value={searchState?.input}
              onChange={(event) =>
                searchState?.onInputChange(event.target.value)
              }
              onFocus={searchState?.onFocus}
              onPressEnter={() => {
                void searchState?.onSubmit();
              }}
            />
            {searchState?.isDropdownOpen && (
              <div className="location-map__suggestions">
                {searchState.isSearching && (
                  <div className="location-map__suggestion-state">
                    Dang tim dia diem...
                  </div>
                )}
                {!searchState.isSearching &&
                  searchState.results.map((result, index) => (
                    <button
                      key={`${result.lat}-${result.lon}-${index}`}
                      type="button"
                      className="location-map__suggestion"
                      onClick={() => searchState.onSelectResult(result)}
                    >
                      <span>{result.display_name}</span>
                    </button>
                  ))}
                {!searchState.isSearching &&
                  searchState.input.trim().length >= 2 &&
                  searchState.results.length === 0 && (
                    <div className="location-map__suggestion-state">
                      Khong tim thay ket qua phu hop.
                    </div>
                  )}
              </div>
            )}
          </div>
          <LocationMapCanvas
            center={center}
            radiusKm={radiusKm}
            locations={locations}
            onCoordinateSelect={(value) => {
              void resolveCoordinates(value);
            }}
            onOpenDetail={handleOpenDetail}
          />
        </div>

        <aside className="location-map__panel">
          <div className="location-map__panel-head">
            <h2>Phong gan day</h2>
            <span>
              {isFetching && !isLoading
                ? "Dang cap nhat..."
                : `${data?.meta.total ?? locations.length} ket qua`}
            </span>
          </div>

          {isLoading && (
            <div className="location-map__state">
              <Spin />
            </div>
          )}

          {isError && (
            <div className="location-map__state">
              <p>{errorMessage}</p>
              <Button onClick={() => void refetch()}>Thu lai</Button>
            </div>
          )}

          {!isLoading && !isError && locations.length === 0 && (
            <div className="location-map__state">
              Khong co phong nao trong ban kinh {radiusKm} km.
            </div>
          )}

          {!isLoading &&
            !isError &&
            locations.map((location) => {
              const address = location.address?.fullAddress;
              const price = location.price;
              const image = location.thumbnailMedia?.url;

              return (
                <button
                  key={location.id}
                  type="button"
                  className="location-map__item"
                  onClick={() => handleOpenDetail(location)}
                >
                  {image && <img src={image} alt="" />}
                  <span className="location-map__item-body">
                    <strong>{location.name}</strong>
                    <span>{address}</span>
                    <span className="location-map__item-footer">
                      {formatPrice(price, location.priceUnit)}
                    </span>
                  </span>
                </button>
              );
            })}
        </aside>
      </div>
    </main>
  );
};
