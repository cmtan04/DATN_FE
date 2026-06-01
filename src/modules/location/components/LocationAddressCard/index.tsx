import { Card, Empty, List, Tag } from "antd";
import { LocationDetailMap } from "../LocationDetailMap";
import type { LocationAddressDto, LocationDetailDto } from "../../types";

interface LocationAddressCardProps {
  addresses: LocationAddressDto[];
  location: LocationDetailDto;
}

export const LocationAddressCard = ({
  addresses,
  location,
}: LocationAddressCardProps) => (
  <Card title="Dia chi" className="location-detail__card">
    <LocationDetailMap location={location} addresses={addresses} />
    {addresses.length ? (
      <List
        className="location-detail__address-list"
        dataSource={addresses}
        renderItem={(address) => (
          <List.Item>
            <List.Item.Meta
              title={address.fullAddress}
              description={[address.district, address.province, address.region]
                .filter(Boolean)
                .join(", ")}
            />
            {address.lat !== undefined && address.lng !== undefined && (
              <Tag>
                {address.lat}, {address.lng}
              </Tag>
            )}
          </List.Item>
        )}
      />
    ) : (
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Chua co dia chi" />
    )}
  </Card>
);
