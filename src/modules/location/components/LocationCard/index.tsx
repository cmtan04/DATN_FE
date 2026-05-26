import {
  EnvironmentOutlined,
  FileTextOutlined,
  HeartFilled,
  HeartOutlined,
  HomeOutlined,
  ShareAltOutlined,
  StarFilled,
  TagOutlined,
} from "@ant-design/icons";
import { Tooltip } from "antd";
import { useState } from "react";
import {
  toggleFavoriteLocation,
  type FavoriteLocationPayload,
} from "../../utils/favoriteLocations";
import "./style.scss";

interface LocationCardProps {
  code: string;
  typeName: string;
  name: string;
  description?: string;
  address?: string;
  rate?: number;
  price?: number;
  priceUnit?: string;
  image?: string;
  isFavourite: boolean;
  onClick?: (code: string) => void;
}

export const LocationCard = (props: LocationCardProps) => {
  const [isFavourite, setIsFavourite] = useState(props.isFavourite);

  const favoritePayload: FavoriteLocationPayload = {
    locationCode: props.code,
    typeName: props.typeName,
    name: props.name,
    description: props.description,
    address: props.address,
    rate: props.rate,
    price: props.price,
    priceUnit: props.priceUnit,
    image: props.image,
  };

  const handleFavourite = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setIsFavourite((prev) => !prev);
    toggleFavoriteLocation(favoritePayload);
  };

  const handleShare = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    const detailUrl = `${window.location.origin}/locations/${props.code}`;
    void navigator.clipboard?.writeText(detailUrl);
  };

  const handleOpenDetail = () => {
    props.onClick?.(props.code);
  };

  return (
    <Tooltip title={props.address} placement="topRight">
      <article
        className="location-card-port"
        onClick={handleOpenDetail}
        role="button"
        tabIndex={0}
        aria-label={`Xem chi tiet ${props.name}`}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            handleOpenDetail();
          }
        }}
      >
        <div className="location-card-port__image">
          {props.image ? <img src={props.image} alt="" /> : <span />}
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
            <HomeOutlined /> {props.name}
          </h3>
          <div className="location-card-port__rate">
            {props.rate ?? 0} <StarFilled />
          </div>
          <p>
            <FileTextOutlined /> {props.description}
          </p>
          <p>
            <EnvironmentOutlined /> {props.address}
          </p>
          <strong>
            <TagOutlined /> {props.price?.toLocaleString()} VND/
            {props.priceUnit || ""}
          </strong>
        </div>
      </article>
    </Tooltip>
  );
};
