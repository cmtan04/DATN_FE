import {
  EnvironmentOutlined,
  HeartFilled,
  HeartOutlined,
  HomeOutlined,
  ShareAltOutlined,
  StarFilled,
  TagOutlined,
} from "@ant-design/icons";
import { Tooltip } from "antd";
import { useState } from "react";
import type { LocationDto } from "../../types";
import {
  toggleFavoriteLocation,
  type FavoriteLocationPayload,
} from "../../utils/favoriteLocations";
import { resolveMediaUrl } from "../../utils/media";
import "./style.scss";

interface LocationCardProps {
  location: LocationDto;
  isFavourite: boolean;
  onClick?: (id: string | number) => void;
}

const DEFAULT_ADDRESS = "Chua cap nhat dia chi";
const DEFAULT_TYPE = "Chua phan loai";

const formatLocationPrice = (price: number, priceUnit: string) =>
  `${price.toLocaleString("vi-VN")} ${priceUnit}`;

const formatLocationArea = (area: number) => `${area} m2`;

export const LocationCard = (props: LocationCardProps) => {
  const { location } = props;
  const [isFavourite, setIsFavourite] = useState(props.isFavourite);
  const address = location.address?.fullAddress ?? DEFAULT_ADDRESS;
  const typeName = location.type?.name ?? DEFAULT_TYPE;
  const rate = location.averageRating ?? 0;
  const image = location.thumbnailMedia?.url
    ? resolveMediaUrl(location.thumbnailMedia.url)
    : undefined;

  const favoritePayload: FavoriteLocationPayload = {
    id: location.id,
    typeName,
    name: location.name,
    address,
    rate,
    price: location.price,
    priceUnit: location.priceUnit,
    image,
  };

  const handleFavourite = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setIsFavourite((prev) => !prev);
    toggleFavoriteLocation(favoritePayload);
  };

  const handleShare = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    const detailUrl = `${window.location.origin}/locations/${location.id}`;
    void navigator.clipboard?.writeText(detailUrl);
  };

  const handleOpenDetail = () => {
    props.onClick?.(location.id);
  };

  return (
    <Tooltip title={address} placement="topRight">
      <article
        className="location-card-port"
        onClick={handleOpenDetail}
        role="button"
        tabIndex={0}
        aria-label={`Xem chi tiet ${location.name}`}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            handleOpenDetail();
          }
        }}
      >
        <div className="location-card-port__image">
          {image ? <img src={image} alt="" /> : <span />}
          <div className="location-card-port__actions">
            <button type="button" onClick={handleFavourite}>
              {isFavourite ? (
                <HeartFilled style={{ color: "#ff1818" }} />
              ) : (
                <HeartOutlined />
              )}
            </button>
            <button type="button" onClick={handleShare}>
              <ShareAltOutlined />
            </button>
          </div>
        </div>
        <div className="location-card-port__content">
          <h3>
            <HomeOutlined /> {location.name}
          </h3>
          <div className="location-card-port__rate">
            {rate} <StarFilled />
          </div>
          <div className="location-card-port__meta">
            <span>{formatLocationArea(location.area)}</span>
            <span>{typeName}</span>
          </div>
          <p>
            <EnvironmentOutlined /> {address}
          </p>
          <strong>
            <TagOutlined /> {formatLocationPrice(location.price, location.priceUnit)}
          </strong>
        </div>
      </article>
    </Tooltip>
  );
};
