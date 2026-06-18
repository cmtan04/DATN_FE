import { EnvironmentOutlined, TagOutlined } from "@ant-design/icons";
import { Button } from "antd";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useMemo } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import {
  DEFAULT_LOCATION_LATITUDE,
  DEFAULT_LOCATION_LONGITUDE,
} from "@shared/constants/location";
import type { LocationListItem } from "../../types";
import "./style.scss";

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface LocationListMapProps {
  locations: LocationListItem[];
  onOpenDetail: (id: string | number) => void;
}

interface MappedLocation {
  id: string | number;
  name: string;
  image?: string;
  price: number;
  priceUnit?: string;
  address?: string;
  position: [number, number];
}

const parseCoordinate = (value?: string | number | null) => {
  const parsed =
    typeof value === "number" ? value : Number.parseFloat(String(value ?? ""));

  return Number.isFinite(parsed) ? parsed : undefined;
};

const formatPrice = (price: number, unit?: string) =>
  `${price.toLocaleString()} VND${unit ? `/${unit}` : ""}`;

const FitMapToLocations = ({
  positions,
}: {
  positions: Array<[number, number]>;
}) => {
  const map = useMap();

  useEffect(() => {
    if (positions.length === 0) {
      map.setView([DEFAULT_LOCATION_LATITUDE, DEFAULT_LOCATION_LONGITUDE], 12);
      return;
    }

    if (positions.length === 1) {
      map.setView(positions[0], 15);
      return;
    }

    map.fitBounds(L.latLngBounds(positions), {
      padding: [40, 40],
      maxZoom: 15,
    });
  }, [map, positions]);

  return null;
};

export const LocationListMap = ({
  locations,
  onOpenDetail,
}: LocationListMapProps) => {
  const mappedLocations = useMemo<MappedLocation[]>(
    () =>
      locations
        .map<MappedLocation | undefined>((location) => {
          const lat = parseCoordinate(location.address?.lat);
          const lng = parseCoordinate(location.address?.lng);

          if (lat === undefined || lng === undefined) {
            return undefined;
          }

          return {
            id: location.id,
            name: location.name,
            image: location.thumbnailMedia?.url,
            price: location.price,
            priceUnit: location.priceUnit,
            address: location.address?.fullAddress,
            position: [lat, lng],
          };
        })
        .filter(
          (location): location is MappedLocation => location !== undefined,
        ),
    [locations],
  );

  const positions = useMemo(
    () => mappedLocations.map((location) => location.position),
    [mappedLocations],
  );

  if (mappedLocations.length === 0) {
    return (
      <div className="location-list-map__empty">
        <p className="location-list-map__empty-title">
          Chua co dia diem nao co toa do de hien thi tren ban do
        </p>
        <p className="location-list-map__empty-description">
          Hay thu bo loc khac hoac kiem tra du lieu dia chi cua phong.
        </p>
      </div>
    );
  }

  return (
    <div className="location-list-map">
      <MapContainer
        center={[DEFAULT_LOCATION_LATITUDE, DEFAULT_LOCATION_LONGITUDE]}
        zoom={12}
        className="location-list-map__canvas"
      >
        <FitMapToLocations positions={positions} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {mappedLocations.map((location) => (
          <Marker key={location.id} position={location.position}>
            <Popup>
              <div className="location-list-map__popup">
                {location.image && (
                  <img
                    className="location-list-map__popup-image"
                    src={location.image}
                    alt=""
                  />
                )}
                <h3 className="location-list-map__popup-title">
                  {location.name}
                </h3>
                <p className="location-list-map__popup-address">
                  <EnvironmentOutlined /> {location.address}
                </p>
                <p className="location-list-map__popup-price">
                  <TagOutlined />{" "}
                  {formatPrice(location.price, location.priceUnit)}
                </p>
                <Button
                  type="primary"
                  block
                  onClick={() => onOpenDetail(location.id)}
                >
                  Xem chi tiet
                </Button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
