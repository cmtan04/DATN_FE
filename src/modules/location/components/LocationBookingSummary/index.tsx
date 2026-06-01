import { Button, Card, Descriptions, Tooltip, Typography } from "antd";
import type { LocationDetailDto } from "../../types";
import {
  formatLocationArea,
  formatLocationPrice,
} from "../../utils/locationDetailFormatters";

interface LocationBookingSummaryProps {
  isOwner: boolean;
  location: LocationDetailDto;
  onOpenBooking: () => void;
}

export const LocationBookingSummary = ({
  isOwner,
  location,
  onOpenBooking,
}: LocationBookingSummaryProps) => (
  <Card className="location-detail__summary">
    <Typography.Text className="location-detail__price">
      {formatLocationPrice(location.price, location.priceUnit)}
    </Typography.Text>
    <Descriptions
      column={1}
      size="small"
      items={[
        {
          key: "type",
          label: "Loai hinh",
          children: location.type?.name ?? "Chua cap nhat",
        },
        {
          key: "area",
          label: "Dien tich",
          children: formatLocationArea(location.area),
        },
      ]}
    />
    <Tooltip title={isOwner ? "Chu phong khong the dat phong cua minh" : ""}>
      <Button
        block
        type="primary"
        className="location-detail__booking-button"
        disabled={isOwner}
        onClick={onOpenBooking}
      >
        Dat phong
      </Button>
    </Tooltip>
  </Card>
);
