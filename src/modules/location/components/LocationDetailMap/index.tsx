import { EnvironmentOutlined } from "@ant-design/icons";
import { Empty } from "antd";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useMemo, useRef } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import type { LocationAddressDto, LocationDetailDto } from "../../types";
import { hasValidLocationCoordinates } from "../../utils/locationDetailFormatters";

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface LocationDetailMapProps {
  location: LocationDetailDto;
  addresses: LocationAddressDto[];
}

export const LocationDetailMap = ({
  location,
  addresses,
}: LocationDetailMapProps) => {
  const markerRef = useRef<L.Marker | null>(null);
  const mapAddress = useMemo(
    () =>
      addresses.find(hasValidLocationCoordinates) ??
      (hasValidLocationCoordinates(location.address)
        ? location.address
        : undefined),
    [addresses, location.address],
  );

  useEffect(() => {
    markerRef.current?.openPopup();
  }, [mapAddress]);

  if (!mapAddress) {
    return (
      <div className="location-detail__map-empty">
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Dia diem nay chua co toa do de hien thi tren ban do"
        />
      </div>
    );
  }

  const position: [number, number] = [mapAddress.lat, mapAddress.lng];

  return (
    <div className="location-detail__map">
      <MapContainer
        center={position}
        zoom={16}
        scrollWheelZoom
        className="location-detail__map-canvas"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker ref={markerRef} position={position}>
          <Popup autoClose={false} closeOnClick={false}>
            <div className="location-detail__map-popup">
              <h3>{location.name}</h3>
              <p>
                <EnvironmentOutlined />{" "}
                {mapAddress.fullAddress || "Chua cap nhat dia chi"}
              </p>
              <span>
                {mapAddress.lat}, {mapAddress.lng}
              </span>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};
