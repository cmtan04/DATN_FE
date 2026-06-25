import { Col, Row, Typography } from "antd";
import { LocationCard } from "@/shared/components/LocationCard";
import type { LocationListItem } from "../../types";

interface SimilarLocationsSectionProps {
  locations: LocationListItem[];
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
    <section>
      <div className="location-detail__similar-head">
        <Typography.Title level={2}>Lựa chọn tương tự</Typography.Title>
      </div>
      <Row gutter={[16, 16]}>
        {locations.map((item) => (
          <Col xs={24} md={6} key={item.id}>
            <LocationCard location={item} onClick={onOpenLocation} />
          </Col>
        ))}
      </Row>
    </section>
  );
};
