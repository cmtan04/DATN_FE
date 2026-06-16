import { Button, Col, Empty, Row, Skeleton, Typography } from "antd";
import { LocationCard } from "@/modules/location/components/LocationCard";
import type { HomeLocation } from "../types";

interface HomeLocationSectionProps {
  title: string;
  description: string;
  actionLabel: string;
  locations?: HomeLocation[];
  isLoading: boolean;
  onActionClick: () => void;
  onViewDetail: (id: string | number) => void;
  isNew?: boolean;
}

const skeletonItems = Array.from({ length: 3 }, (_, index) => index);

export const HomeLocationSection = ({
  title,
  description,
  actionLabel,
  locations = [],
  isLoading,
  onActionClick,
  onViewDetail,
}: HomeLocationSectionProps) => (
  <section className="home-section">
    <div className="home-section__header">
      <div>
        <Typography.Title level={2}>{title}</Typography.Title>
        <Typography.Paragraph>{description}</Typography.Paragraph>
      </div>
      <Button onClick={onActionClick}>{actionLabel}</Button>
    </div>

    {isLoading ? (
      <Row gutter={[14, 14]}>
        {skeletonItems.map((item) => (
          <Col xs={24} sm={12} lg={6} key={item}>
            <Skeleton.Node active className="home-section__skeleton" />
          </Col>
        ))}
      </Row>
    ) : locations.length > 0 ? (
      <Row gutter={[14, 14]}>
        {locations.map((location) => (
          <Col xs={24} sm={12} lg={6} key={location.id}>
            <LocationCard location={location} onClick={onViewDetail} />
          </Col>
        ))}
      </Row>
    ) : (
      <Empty description="Chưa có phòng phù hợp để hiển thị." />
    )}
  </section>
);
