import { Col, Row, Typography } from "antd";
import { LocationCard } from "../LocationCard";
import type { LocationDto } from "../../types";

interface SimilarLocationsSectionProps {
  locations: LocationDto[];
  onOpenLocation: (id: string | number) => void;
}

export const SimilarLocationsSection = ({
  locations,
  onOpenLocation,
}: SimilarLocationsSectionProps) => {
  if (!locations.length) {
    return null;
  }

  return (
    <section className="location-detail__similar">
      <div className="location-detail__similar-head">
        <Typography.Title level={2}>Lua chon tuong tu</Typography.Title>
        <Typography.Paragraph>
          Cac phong/nha gan khu vuc nay de khach co them lua chon truoc khi
          quyet dinh.
        </Typography.Paragraph>
      </div>
      <Row gutter={[16, 16]}>
        {locations.map((item) => (
          <Col xs={24} md={6} key={item.id}>
            <LocationCard
              location={item}
              isFavourite={false}
              onClick={onOpenLocation}
            />
          </Col>
        ))}
      </Row>
    </section>
  );
};
