import { EnvironmentOutlined, TagOutlined } from "@ant-design/icons";
import { Button } from "antd";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import {
  Circle,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
  ZoomControl,
} from "react-leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import type { LocationListItem } from "../../location/types";
import type { MapCoordinates } from "../types";
import {
  formatLocationMapPrice,
  getLocationMapPosition,
} from "../utils/locationMap";

type LocationId = LocationListItem["id"];

interface LocationMapCanvasProps {
  center: [number, number];
  radiusKm: number;
  locations: LocationListItem[];
  activePopupLocationId: LocationId | null;
  onCoordinateSelect: (value: MapCoordinates) => void;
  onOpenDetail: (location: LocationListItem) => void;
  onPopupOpen: (id: LocationId) => void;
  onPopupClose: (id: LocationId) => void;
}

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

const ChangeMapView = ({ center }: { center: [number, number] }) => {
  const map = useMap();

  useEffect(() => {
    map.setView(center, map.getZoom() || 14);
  }, [center, map]);

  return null;
};

const ClosePopupWhenInactive = ({
  activePopupLocationId,
}: {
  activePopupLocationId: LocationId | null;
}) => {
  const map = useMap();

  useEffect(() => {
    if (activePopupLocationId === null) {
      map.closePopup();
    }
  }, [activePopupLocationId, map]);

  return null;
};

const MapClickHandler = ({
  isPopupOpen,
  onCoordinateSelect,
}: {
  isPopupOpen: boolean;
  onCoordinateSelect: (value: MapCoordinates) => void;
}) => {
  useMapEvents({
    click(event) {
      if (isPopupOpen) {
        return;
      }

      onCoordinateSelect({
        lat: event.latlng.lat,
        lng: event.latlng.lng,
      });
    },
  });

  return null;
};

const LocationPopupContent = ({
  location,
  onOpenDetail,
}: {
  location: LocationListItem;
  onOpenDetail: (location: LocationListItem) => void;
}) => (
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
      <EnvironmentOutlined /> {location.address?.fullAddress}
    </p>
    <p className="location-map__popup-price">
      <TagOutlined />{" "}
      {formatLocationMapPrice(location.price, location.priceUnit)}
    </p>
    <Button type="primary" block onClick={() => onOpenDetail(location)}>
      Xem chi tiet
    </Button>
  </div>
);

export const LocationMapCanvas = ({
  center,
  radiusKm,
  locations,
  activePopupLocationId,
  onCoordinateSelect,
  onOpenDetail,
  onPopupOpen,
  onPopupClose,
}: LocationMapCanvasProps) => (
  <MapContainer
    center={center}
    zoom={14}
    zoomControl={false}
    className="location-map__canvas"
  >
    <ChangeMapView center={center} />
    <ClosePopupWhenInactive activePopupLocationId={activePopupLocationId} />
    <MapClickHandler
      isPopupOpen={activePopupLocationId !== null}
      onCoordinateSelect={onCoordinateSelect}
    />
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
      const position = getLocationMapPosition(location);

      if (!position) {
        return null;
      }

      return (
        <Marker
          key={location.id}
          position={position}
          eventHandlers={{
            popupopen: () => onPopupOpen(location.id),
            popupclose: () => onPopupClose(location.id),
          }}
        >
          <Popup>
            <LocationPopupContent
              location={location}
              onOpenDetail={onOpenDetail}
            />
          </Popup>
        </Marker>
      );
    })}
    <ZoomControl position="bottomleft" />
  </MapContainer>
);
