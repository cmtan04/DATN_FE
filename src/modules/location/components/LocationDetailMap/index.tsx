import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useRef } from "react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import type { LocationDetail } from "../../types";

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface LocationDetailMapProps {
  location: LocationDetail;
}

export const LocationDetailMap = ({ location }: LocationDetailMapProps) => {
  const markerRef = useRef<L.Marker | null>(null);

  const position: [number, number] = [
    location.address?.lat ?? 0,
    location.address?.lng ?? 0,
  ];

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
        <Marker ref={markerRef} position={position}></Marker>
      </MapContainer>
    </div>
  );
};
