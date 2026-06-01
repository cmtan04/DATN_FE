import { ArrowLeftOutlined, EnvironmentOutlined, StarFilled } from "@ant-design/icons";
import { Breadcrumb, Button, Space, Tag, Typography } from "antd";
import { ROUTER_PATH } from "@app/router/routes";
import type { LocationAddressDto, LocationDetailDto } from "../../types";

interface LocationDetailHeroProps {
  heroBackgroundImage?: string;
  location: LocationDetailDto;
  onBackToList: () => void;
  primaryAddress?: LocationAddressDto;
}

export const LocationDetailHero = ({
  heroBackgroundImage,
  location,
  onBackToList,
  primaryAddress,
}: LocationDetailHeroProps) => (
  <section
    className={`location-detail__intro ${
      heroBackgroundImage ? "location-detail__intro--cover" : ""
    }`}
    style={
      heroBackgroundImage
        ? { backgroundImage: `url(${heroBackgroundImage})` }
        : undefined
    }
  >
    <div className="location-detail__nav">
      <Breadcrumb
        items={[
          { title: "Trang chu" },
          { title: "Danh sach phong", href: ROUTER_PATH.LOCATIONS },
          { title: location.name },
        ]}
      />
      <Button icon={<ArrowLeftOutlined />} onClick={onBackToList}>
        Quay lai
      </Button>
    </div>

    <div className="location-detail__hero">
      <div>
        <Space wrap className="location-detail__tags">
          <Tag color="blue">{location.type?.name ?? "Chua phan loai"}</Tag>
        </Space>
        <Typography.Title level={1}>{location.name}</Typography.Title>
        {primaryAddress?.fullAddress && (
          <p className="location-detail__address">
            <EnvironmentOutlined /> {primaryAddress.fullAddress}
          </p>
        )}
      </div>
      <div className="location-detail__rating">
        <StarFilled />
        <strong>{location.averageRating || 0}</strong>
      </div>
    </div>
  </section>
);
