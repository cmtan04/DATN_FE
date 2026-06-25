import { Col, Empty, Row, Skeleton } from "antd";
import { LocationCard } from "@/shared/components/LocationCard";
import type { HomeOverviewData } from "../../types";
import "./styles.scss";

export type RecommendLocationProps = {
  isLoading: boolean;
  locations?: HomeOverviewData;
  onViewDetail: (id: string | number) => void;
};
const skeletonItems = Array.from({ length: 4 }, (_, index) => index);
export const RecommendLocation = ({
  isLoading,
  locations,
  onViewDetail,
}: RecommendLocationProps) => {
  const popularLocations = locations?.featuredLocations ?? [];
  const newLocations = locations?.newLocations ?? [];

  return (
    <div className="section">
      <div className="header">
        <div className="left">
          <p className="eyebrow">GỢI Ý CHO BẠN</p>
          <h2>Phòng nổi bật</h2>
        </div>
      </div>
      <div style={{ marginBottom: 40 }}>
        {isLoading ? (
          <Row gutter={[14, 14]}>
            {skeletonItems.map((item) => (
              <Col xs={24} sm={12} lg={6} key={item}>
                <Skeleton.Node active className="home-section__skeleton" />
              </Col>
            ))}
          </Row>
        ) : popularLocations.length > 0 ? (
          <Row gutter={[14, 14]}>
            {popularLocations.map((location) => (
              <Col xs={24} sm={12} lg={6} key={location.id}>
                <LocationCard location={location} onClick={onViewDetail} />
              </Col>
            ))}
          </Row>
        ) : (
          <Empty description="Chưa có phòng phù hợp để hiển thị." />
        )}
      </div>
      <div className="header">
        <div className="left">
          <h2>Phòng mới</h2>
        </div>
      </div>
      {isLoading ? (
        <Row gutter={[14, 14]}>
          {skeletonItems.map((item) => (
            <Col xs={24} sm={12} lg={6} key={item}>
              <Skeleton.Node active className="home-section__skeleton" />
            </Col>
          ))}
        </Row>
      ) : newLocations.length > 0 ? (
        <Row gutter={[14, 14]}>
          {newLocations.map((location) => (
            <Col xs={24} sm={12} lg={6} key={location.id}>
              <LocationCard location={location} onClick={onViewDetail} />
            </Col>
          ))}
        </Row>
      ) : (
        <Empty description="Chưa có phòng phù hợp để hiển thị." />
      )}
    </div>
  );
};
