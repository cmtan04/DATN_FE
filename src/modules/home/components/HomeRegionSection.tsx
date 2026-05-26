import { Col, Empty, Row, Skeleton, Typography } from "antd";
import type { RegionItem, RegionKey } from "../types";

interface HomeRegionSectionProps {
  regions?: RegionItem[];
  isLoading: boolean;
  onRegionClick: (region: RegionKey) => void;
}

const skeletonItems = Array.from({ length: 3 }, (_, index) => index);

export const HomeRegionSection = ({
  regions = [],
  isLoading,
  onRegionClick,
}: HomeRegionSectionProps) => (
  <section className="home-section home-section--regions">
    <div className="home-section__header">
      <div>
        <Typography.Title level={2}>Khu vực</Typography.Title>
        <Typography.Paragraph>
          Chọn nhanh theo miền để mở danh sách phòng tương ứng.
        </Typography.Paragraph>
      </div>
    </div>

    {isLoading ? (
      <Row gutter={[14, 14]}>
        {skeletonItems.map((item) => (
          <Col xs={24} md={8} key={item}>
            <Skeleton.Node active className="home-region-card__skeleton" />
          </Col>
        ))}
      </Row>
    ) : regions.length > 0 ? (
      <Row gutter={[14, 14]}>
        {regions.map((region) => (
          <Col xs={24} md={8} key={region.key}>
            <button
              type="button"
              className={`home-region-card home-region-card--${region.key}`}
              onClick={() => onRegionClick(region.key)}
            >
              <span className="home-region-card__label">
                {region.highlight}
              </span>
              <strong>{region.title}</strong>
              <span>{region.description}</span>
            </button>
          </Col>
        ))}
      </Row>
    ) : (
      <Empty description="Chưa có khu vực để hiển thị." />
    )}
  </section>
);
