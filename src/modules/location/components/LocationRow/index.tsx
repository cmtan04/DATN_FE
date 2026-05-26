import {
  EnvironmentOutlined,
  HeartFilled,
  HeartOutlined,
  ShareAltOutlined,
  StarFilled,
} from "@ant-design/icons";
import { Tooltip } from "antd";
import { useState } from "react";
import {
  toggleFavoriteLocation,
  type FavoriteLocationPayload,
} from "../../utils/favoriteLocations";
import "./style.scss";

interface LocationRowProps {
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

export const LocationRow = (props: LocationRowProps) => {
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

  return (
    <article
      className="location-row-port"
      onClick={() => props.onClick?.(props.code)}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          props.onClick?.(props.code);
        }
      }}
    >
      <div className="location-row-port__image">
        {props.image ? <img src={props.image} alt="" /> : <span />}
        <div className="location-row-port__actions">
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
      <div className="location-row-port__content">
        <Tooltip title={props.name}>
          <h3>{props.name}</h3>
        </Tooltip>
        <div className="location-row-port__rate">
          {props.rate ?? 0} <StarFilled />
        </div>
        <p className="location-row-port__address">
          <EnvironmentOutlined /> {props.address}
        </p>
        <Tooltip title={props.description}>
          <p className="location-row-port__description">{props.description}</p>
        </Tooltip>
        <strong>
          {props.price?.toLocaleString()} VND/ {props.priceUnit || ""}
        </strong>
      </div>
    </article>
  );
};
