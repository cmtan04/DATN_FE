import { Breadcrumb, Button, Col, Result, Row, Spin } from "antd";
import { Link, useParams } from "react-router-dom";
import { LocationBookingSummary } from "../../components/LocationBookingSummary";
import { LocationDetailGallery } from "../../components/LocationDetailGallery";
import { LocationOwnerCard } from "../../components/LocationOwnerCard";
import { SimilarLocationsSection } from "../../components/SimilarLocationsSection";
import { useLocationDetail } from "../../hooks/useLocationDetail";
import type { LocationDetail as LocationDetailData } from "../../types";
import "./style.scss";
import { LocationDetailMap } from "../../components/LocationDetailMap";
import { LocationAmenitiesCard } from "../../components/LocationAmenitiesCard";
import { LocationDetailTags } from "../../components/LocationDetail/Tags";
import { LocationDetailHeader } from "../../components/LocationDetail/Header";

interface LocationDetailViewProps {
  detail: ReturnType<typeof useLocationDetail> & {
    location: LocationDetailData;
  };
}

const LocationDetailView = ({ detail }: LocationDetailViewProps) => {
  const { location } = detail;

  return (
    <main className="location-detail">
      <div className="location-detail__breadcrumb">
        <Breadcrumb
          items={[
            { title: <Link to="/">Trang chủ</Link> },
            { title: <Link to="/locations">Khám phá</Link> },
            { title: location.name },
          ]}
        />
      </div>
      <LocationDetailGallery
        galleryItems={location.media}
        locationName={location.name}
      />

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={15}>
          <div className="body">
            <div className="main">
              <LocationDetailTags
                typeName={location.type?.name}
                area={location.area}
                maxGuestCount={location.maxGuestCount}
              />
              <LocationDetailHeader location={location} />
              <LocationDetailMap location={location} />
              {/* Description */}
              <div className="contentSection">
                {location.description && (
                  <>
                    <h2>Giới thiệu</h2>
                    <p className="description">{location.description}</p>
                  </>
                )}

                <h2>Tiện nghi & Dịch vụ</h2>
                <LocationAmenitiesCard services={location.services ?? []} />
              </div>
            </div>
          </div>
        </Col>

        <Col xs={24} lg={9}>
          <LocationBookingSummary
            isOwner={detail.isOwner}
            location={location}
            onOpenBooking={detail.handleOpenBooking}
          />

          <LocationOwnerCard isOwner={detail.isOwner} owner={location.owner} />
        </Col>
      </Row>
      <SimilarLocationsSection
        locations={detail.relatedLocations}
        onOpenLocation={detail.handleOpenRelatedLocation}
      />
    </main>
  );
};

export const LocationDetail = () => {
  const { id } = useParams();
  const detail = useLocationDetail(id);
  const {
    location,
    errorMessage,
    handleBackToList,
    isError,
    isLoading,
    refetch,
  } = detail;

  if (!id) {
    return (
      <main className="location-detail">
        <Result
          status="404"
          title="Khong tim thay phong"
          extra={
            <Button type="primary" onClick={detail.handleBackToList}>
              Quay lai danh sach
            </Button>
          }
        />
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="location-detail">
        <div className="location-detail__state">
          <Spin />
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="location-detail">
        <Result
          status="error"
          title="Khong the tai chi tiet phong"
          subTitle={errorMessage}
          extra={[
            <Button key="retry" type="primary" onClick={() => void refetch()}>
              Thu lai
            </Button>,
            <Button key="back" onClick={handleBackToList}>
              Quay lai danh sach
            </Button>,
          ]}
        />
      </main>
    );
  }

  if (!location) {
    return (
      <main className="location-detail">
        <Result
          status="info"
          title="Chua co du lieu chi tiet phong"
          extra={
            <Button type="primary" onClick={detail.handleBackToList}>
              Quay lai danh sach
            </Button>
          }
        />
      </main>
    );
  }

  return <LocationDetailView detail={{ ...detail, location }} />;
};
