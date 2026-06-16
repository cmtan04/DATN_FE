import {  Empty, Tag, Typography } from "antd";
import type { LocationServiceItem } from "../../types";
import { formatLocationPrice } from "../../utils/locationDetailFormatters";

interface LocationAmenitiesCardProps {
  services: LocationServiceItem[];
}

const getServicePriceLabel = (service: LocationServiceItem) => {
  const price = Number(service.price ?? 0);

  if (service.isFree || !price) {
    return "Mien phi";
  }

  return formatLocationPrice(service.price, service.priceUnit);
};

export const LocationAmenitiesCard = ({
  services,
}: LocationAmenitiesCardProps) => (
  <>
    {services.length ? (
      <div className="location-detail__amenities-grid">
        {services.map((service, index) => (
          <div
            className="location-detail__amenity-card"
            key={`${service.name}-${service.priceUnit ?? "free"}-${index}`}
          >
            <Typography.Text
              className="location-detail__amenity-name"
              strong
            >
              {service.name}
            </Typography.Text>
            <Tag
              className="location-detail__amenity-price"
              color={service.isFree ? "success" : "error"}
            >
              {getServicePriceLabel(service)}
            </Tag>
          </div>
        ))}
      </div>
    ) : (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description="Chua co tien ich"
      />
    )}
  </>
);
