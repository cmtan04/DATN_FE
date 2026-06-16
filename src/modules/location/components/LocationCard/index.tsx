import {
  HeartFilled,
  HeartOutlined,
  StarFilled,
  TeamOutlined,
} from "@ant-design/icons";
import { Button, Card, Tag, Tooltip, Typography, message } from "antd";
import { useEffect, useState } from "react";
import type { LocationListItem } from "@shared/types/location";
import { resolveMediaUrl } from "@shared/utils/media";
import { useToggleLocationFavorite } from "@modules/location/hooks/useToggleLocationFavorite";
import "./styles.scss";
import { useAuth } from "@/app/providers/useAuth";

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
  const { isAuthenticated } = useAuth();
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
  const [liked, setLiked] = useState<boolean>(location.isFavourite);
  const toggleFavoriteMutation = useToggleLocationFavorite();

  useEffect(() => {
    setLiked(location.isFavourite);
  }, [location.isFavourite]);

  const handleViewDetail = () => {
    if (onClick) {
      onClick(location.id);
      return;
    }

    onViewDetail?.(location.id);
  };

  const handleFavorite = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (!isAuthenticated) {
      message.info(
        "Vui lòng đăng nhập để thêm địa điểm vào danh sách yêu thích!",
      );
      return;
    }
    toggleFavoriteMutation
      .mutateAsync(location.id)
      .then((response) => {
        setLiked(response.isFavourite);
        message.success(
          response.isFavourite
            ? "Đã thêm địa điểm vào yêu thích!"
            : "Đã bỏ yêu thích địa điểm!",
        );
      })
      .catch((error) => {
        message.error(
          `Đã có lỗi xảy ra khi ${liked ? "bỏ" : "thêm"} địa điểm yêu thích. Vui lòng thử lại!`,
        );
        console.error("Toggle favorite error:", error);
      });
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
            loading={toggleFavoriteMutation.isPending}
            disabled={toggleFavoriteMutation.isPending}
            onClick={handleFavorite}
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
