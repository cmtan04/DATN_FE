import { PhoneOutlined } from "@ant-design/icons";
import { Avatar, Button, Card, Space, Typography } from "antd";
import type { LocationOwner } from "../../types";

interface LocationOwnerCardProps {
  isOwner: boolean;
  owner: LocationOwner | null;
}

export const LocationOwnerCard = ({
  isOwner,
  owner,
}: LocationOwnerCardProps) => (
  <Card title="Chu so huu" className="location-detail__card">
    <Space align="start" className="location-detail__owner">
      <Avatar size={56}>{owner?.fullName?.charAt(0)}</Avatar>
      <div>
        <Typography.Title level={4}>
          {owner?.fullName || "Chua cap nhat"}
        </Typography.Title>
      </div>
    </Space>

    <Space direction="vertical" className="location-detail__contact">
      {!isOwner && owner?.phoneNumber && (
        <Button
          block
          type="primary"
          icon={<PhoneOutlined />}
          href={`tel:${owner.phoneNumber}`}
        >
          Goi dien
        </Button>
      )}
    </Space>
  </Card>
);
