import { Button, Spin } from "antd";
import type { LocationListItem } from "../../location/types";
import { formatLocationMapPrice, formatRadius } from "../utils/locationMap";

interface LocationResultPanelProps {
  locations: LocationListItem[];
  radiusKm: number;
  total: number;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  errorMessage: string;
  onRetry: () => void;
  onOpenDetail: (location: LocationListItem) => void;
}

export const LocationResultPanel = ({
  locations,
  radiusKm,
  total,
  isLoading,
  isFetching,
  isError,
  errorMessage,
  onRetry,
  onOpenDetail,
}: LocationResultPanelProps) => (
  <aside className="location-map__panel">
    <div className="location-map__panel-head">
      <h2>Kết quả tìm kiếm</h2>
      <span>
        {isFetching && !isLoading ? "Dang cap nhat..." : `${total} phòng`}
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
        <Button onClick={onRetry}>Thử lại</Button>
      </div>
    )}

    {!isLoading && !isError && locations.length === 0 && (
      <div className="location-map__state">
        Không có phòng nào trong bán kính {formatRadius(radiusKm)}.
      </div>
    )}

    {!isLoading &&
      !isError &&
      locations.map((location) => {
        const image = location.thumbnailMedia?.url;

        return (
          <button
            key={location.id}
            type="button"
            className="location-map__item"
            onClick={() => onOpenDetail(location)}
          >
            {image && <img src={image} alt="" />}
            <span className="location-map__item-body">
              <strong>{location.name}</strong>
              <span>{location.address?.fullAddress}</span>
              <span className="location-map__item-footer">
                {formatLocationMapPrice(location.price, location.priceUnit)}
              </span>
            </span>
          </button>
        );
      })}
  </aside>
);
