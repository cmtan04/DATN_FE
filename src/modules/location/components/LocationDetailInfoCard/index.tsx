import { Card, Descriptions, Divider, Typography } from "antd";
import type { LocationDetailDto } from "../../types";
import {
  formatLocationArea,
  formatLocationDate,
  formatLocationPrice,
} from "../../utils/locationDetailFormatters";

interface LocationDetailInfoCardProps {
  location: LocationDetailDto;
}

export const LocationDetailInfoCard = ({
  location,
}: LocationDetailInfoCardProps) => (
  <Card title="Thong tin chi tiet" className="location-detail__card">
    <Descriptions
      column={{ xs: 1, sm: 2 }}
      items={[
        {
          key: "price",
          label: "Gia thue",
          children: formatLocationPrice(location.price, location.priceUnit),
        },
        {
          key: "area",
          label: "Dien tich",
          children: formatLocationArea(location.area),
        },
        {
          key: "from",
          label: "Ngay tao",
          children: formatLocationDate(location.createdAt),
        },
      ]}
    />
    <Divider />
    <Typography.Title level={4}>Mo ta phong</Typography.Title>
    <Typography.Paragraph className="location-detail__paragraph">
      {location.description || "Chu phong chua cap nhat mo ta."}
    </Typography.Paragraph>
  </Card>
);
