import { Button, Card, Rate, Space, Tag, Typography } from "antd";
import type { LocationDto } from "@shared/types/location";
import "./locationCard.scss";

export interface LocationCardProps {
  location: LocationDto;
  isFeatured?: boolean;
  isNew?: boolean;
  onViewDetail?: (id: string | number) => void;
}

const DEFAULT_ADDRESS = "Chua cap nhat dia chi";
const DEFAULT_TYPE = "Chua phan loai";

const formatLocationPrice = (price: number, priceUnit: string) =>
  `${price.toLocaleString("vi-VN")} ${priceUnit}`;

const formatLocationArea = (area: number) => `${area} m2`;

export const LocationCard = ({
  location,
  isFeatured = false,
  isNew = false,
  onViewDetail,
}: LocationCardProps) => {
  const title = location.name;
  const address = location.address?.fullAddress ?? DEFAULT_ADDRESS;
  const priceLabel = formatLocationPrice(location.price, location.priceUnit);
  const areaLabel = formatLocationArea(location.area);
  const typeLabel = location.type?.name ?? DEFAULT_TYPE;
  const imageUrl = location.thumbnailMedia?.url;
  const rating = location.averageRating ?? 0;

  const handleViewDetail = () => {
    onViewDetail?.(location.id);
  };

  return (
    <Card
      hoverable
      className="location-card"
      cover={
        <div className="location-card__media">
          {imageUrl ? (
            <img src={imageUrl} alt={title} loading="lazy" />
          ) : (
            <div className="location-card__media-fallback" />
          )}
          <div className="location-card__tags">
            {isFeatured ? <Tag color="gold">Noi bat</Tag> : null}
            {isNew ? <Tag color="blue">Moi</Tag> : null}
          </div>
        </div>
      }
    >
      <Space direction="vertical" size={8} className="location-card__body">
        <div className="location-card__copy">
          <Typography.Title level={3} className="location-card__title">
            {title}
          </Typography.Title>
          <Typography.Paragraph className="location-card__address">
            {address}
          </Typography.Paragraph>
        </div>

        <div className="location-card__meta">
          <span className="location-card__price">{priceLabel}</span>
          <span>{areaLabel}</span>
          <span>{typeLabel}</span>
        </div>

        <div className="location-card__footer">
          <div className="location-card__rating">
            <Rate disabled allowHalf value={rating} />
            <span>{rating.toLocaleString("vi-VN")} diem</span>
          </div>
          <Button size="small" type="primary" onClick={handleViewDetail}>
            Chi tiet
          </Button>
        </div>
      </Space>
    </Card>
  );
};
