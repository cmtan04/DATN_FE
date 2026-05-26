import { Button, Card, Rate, Space, Tag, Typography } from "antd";
import "./locationCard.scss";

export interface LocationCardProps {
  code: string;
  title: string;
  address: string;
  priceLabel: string;
  areaLabel: string;
  typeLabel: string;
  imageUrl?: string;
  rating: number;
  viewCount: number;
  isFeatured?: boolean;
  isNew?: boolean;
  onViewDetail?: (code: string) => void;
}

export const LocationCard = ({
  code,
  title,
  address,
  priceLabel,
  areaLabel,
  typeLabel,
  imageUrl,
  rating,
  viewCount,
  isFeatured = false,
  isNew = false,
  onViewDetail,
}: LocationCardProps) => {
  const handleViewDetail = () => {
    onViewDetail?.(code);
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
            {isFeatured ? <Tag color="gold">Nổi bật</Tag> : null}
            {isNew ? <Tag color="blue">Mới</Tag> : null}
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
            <span>{viewCount.toLocaleString("vi-VN")} lượt xem</span>
          </div>
          <Button size="small" type="primary" onClick={handleViewDetail}>
            Chi tiết
          </Button>
        </div>
      </Space>
    </Card>
  );
};

