import {
  HeartFilled,
  HeartOutlined,
  StarFilled,
  TeamOutlined,
} from "@ant-design/icons";
import { Button, Card, Tag, Tooltip, Typography } from "antd";
import type { LocationListItem } from "@shared/types/location";
import { resolveMediaUrl } from "@shared/utils/media";
import { useToggleLocationFavourite } from "@/modules/location/hooks/useToggleLocationFavourite";
import "./styles.scss";

export interface LocationCardProps {
  location: LocationListItem;
  onClick?: (id: string | number) => void;
  onViewDetail?: (id: string | number) => void;
}

const DEFAULT_ADDRESS = "Chua cap nhat dia chi";
const DEFAULT_TYPE = "Chua phan loai";

const formatLocationPrice = (price: number, priceUnit: string) =>
  `${price.toLocaleString("vi-VN")} ${priceUnit}`;

export const LocationCard = ({
  location,
  onClick,
  onViewDetail,
}: LocationCardProps) => {
  const { liked, isTogglingFavourite, handleToggleFavourite } =
    useToggleLocationFavourite(location.id, location.isFavourite);

  const title = location.name;
  const address = location.address?.fullAddress ?? DEFAULT_ADDRESS;
  const priceLabel = formatLocationPrice(location.price, location.priceUnit);
  const areaLabel = `${location.area} m2`;
  const typeLabel = location.type?.name ?? DEFAULT_TYPE;
  const imageUrl = location.thumbnailMedia?.url
    ? resolveMediaUrl(location.thumbnailMedia.url)
    : undefined;
  const rating = location.averageRating ?? 0;
  const ratingLabel =
    rating > 0 ? `${Number(rating).toFixed(1)}` : "Chua co danh gia";
  const maxGuestCount = Number(location.maxGuestCount);
  const shouldShowMaxGuestCount =
    Number.isFinite(maxGuestCount) && maxGuestCount > 0;

  const handleViewDetail = () => {
    if (onClick) {
      onClick(location.id);
      return;
    }

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
          <Button
            className="location-card__favorite"
            type="default"
            shape="circle"
            aria-label={liked ? "Bo yeu thich" : "Them vao yeu thich"}
            icon={
              liked ? (
                <HeartFilled className="location-card__favorite-icon" />
              ) : (
                <HeartOutlined />
              )
            }
            loading={isTogglingFavourite}
            disabled={isTogglingFavourite}
            onClick={handleToggleFavourite}
          />
          <Tag className="location-card__type">{typeLabel}</Tag>
        </div>
      }
      onClick={handleViewDetail}
    >
      <div className="location-card__body">
        <div className="location-card__main">
          <div className="location-card__copy">
            <Tooltip title={title}>
              <Typography.Title level={3} className="location-card__title">
                {title}
              </Typography.Title>
            </Tooltip>
            <Tooltip title={address}>
              <Typography.Paragraph className="location-card__address">
                {address}
              </Typography.Paragraph>
            </Tooltip>
          </div>

          <div className="location-card__meta">
            <Tag icon={rating > 0 ? <StarFilled /> : undefined}>
              {ratingLabel}
            </Tag>
            <Tag>{areaLabel}</Tag>
            {shouldShowMaxGuestCount && (
              <Tag icon={<TeamOutlined />}>Toi da {maxGuestCount} khach</Tag>
            )}
          </div>
        </div>

        <div className="location-card__footer">
          <span className="location-card__price">{priceLabel}</span>
        </div>
      </div>
    </Card>
  );
};
