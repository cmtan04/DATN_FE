import {
  EnvironmentOutlined,
  ShareAltOutlined,
  HeartFilled,
  HeartOutlined,
} from "@ant-design/icons";
import { Button, Rate, Space } from "antd";
import type { LocationDetail } from "../../../types";
import { useToggleLocationFavourite } from "../../../hooks/useToggleLocationFavourite";
import "./styles.scss";

export const LocationDetailHeader = ({
  location,
}: {
  location: LocationDetail;
}) => {
  const { liked, isTogglingFavourite, handleToggleFavourite } =
    useToggleLocationFavourite(location.id, location.isFavourite);

  return (
    <div className="hotelHeader">
      <h1>{location.name}</h1>
      <div className="meta">
        <div className="ratingBadge">
          <Rate disabled defaultValue={1} count={1} className="rateStar" />
          <span className="score">
            {Number(location.averageRating).toFixed(1)}
          </span>
        </div>
        <div className="divider" />
        <span className="locationText">
          <EnvironmentOutlined /> {location.address?.fullAddress}
        </span>
        <Space className="actions">
          <Button
            shape="circle"
            icon={
              liked ? <HeartFilled className="heartRed" /> : <HeartOutlined />
            }
            loading={isTogglingFavourite}
            disabled={isTogglingFavourite}
            onClick={handleToggleFavourite}
          />
          <Button shape="circle" icon={<ShareAltOutlined />} />
        </Space>
      </div>
    </div>
  );
};
