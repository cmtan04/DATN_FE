import { Tag } from "antd";
import { TeamOutlined } from "@ant-design/icons";
import "./styles.scss";

export const LocationDetailTags = ({
  typeName,
  area,
  maxGuestCount,
}: {
  typeName?: string;
  area?: number;
  maxGuestCount?: number;
}) => {
  return (
    <div className="detail_tag">
      <Tag color="blue">{typeName}</Tag>
      <Tag color="green">{area} m²</Tag>
      {maxGuestCount !== undefined && maxGuestCount > 0 && (
        <Tag color="default" icon={<TeamOutlined />}>
          Toi da {maxGuestCount} khach
        </Tag>
      )}
    </div>
  );
};
