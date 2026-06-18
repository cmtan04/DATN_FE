import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  ZoomControl,
} from "react-leaflet";
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

const RefreshMapSize = ({
  lat,
  lng,
}: {
  lat: number;
  lng: number;
}) => {
  const map = useMap();

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      map.invalidateSize();
      map.setView([lat, lng], map.getZoom() || 16);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [lat, lng, map]);

  return null;
};

export const LocationDetailMap = ({ location }: LocationDetailMapProps) => {
  const position: [number, number] = [
    location.address?.lat ?? 0,
    location.address?.lng ?? 0,
  ];

  const handleOpenGoogleMaps = () => {
    const [lat, lng] = position;
    // Bổ sung thêm tên địa điểm vào query giúp Google Maps hiển thị nhãn tên rõ ràng
    const query = `${lat},${lng}`;
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

    window.open(googleMapsUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="location-detail__map">
      <MapContainer
        center={position}
        zoom={16}
        zoomControl={false}
        className="location-detail__map-canvas"
      >
        <RefreshMapSize lat={position[0]} lng={position[1]} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} />
        <ZoomControl position="topleft" />
      </MapContainer>
      <button
        onClick={handleOpenGoogleMaps}
        style={{
          position: "absolute",
          top: "16px",
          right: "16px",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          backgroundColor: "#ffffff",
          color: "#3c4043",
          fontWeight: 500,
          fontSize: "14px",
          padding: "10px 16px",
          borderRadius: "8px",
          border: "1px solid #dadce0",
          cursor: "pointer",
          boxShadow:
            "0 1px 3px rgba(60,64,67,0.3), 0 4px 8px 3px rgba(60,64,67,0.15)",
        }}
      >
        <svg
          style={{ marginRight: "6px" }}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="#4285F4"
        >
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
        </svg>
        Mở trong Google Maps
      </button>
    </div>
  );
};
