import { Button, Col, Result, Row, Spin } from "antd";
import { useParams } from "react-router-dom";
import { LocationAddressCard } from "../../components/LocationAddressCard";
import { LocationAmenitiesCard } from "../../components/LocationAmenitiesCard";
import { LocationBookingSummary } from "../../components/LocationBookingSummary";
import { LocationDetailGallery } from "../../components/LocationDetailGallery";
import { LocationDetailHero } from "../../components/LocationDetailHero";
import { LocationDetailInfoCard } from "../../components/LocationDetailInfoCard";
import { LocationOwnerCard } from "../../components/LocationOwnerCard";
import { SimilarLocationsSection } from "../../components/SimilarLocationsSection";
import { useLocationDetail } from "../../hooks/useLocationDetail";
import type { LocationDetailDto } from "../../types";
import "./style.scss";

interface LocationDetailViewProps {
  detail: ReturnType<typeof useLocationDetail> & {
    location: LocationDetailDto;
  };
  onBackToList: () => void;
}

const LocationDetailView = ({
  detail,
  onBackToList,
}: LocationDetailViewProps) => {
  const { location } = detail;

  return (
    <main className="location-detail">
      <LocationDetailHero
        heroBackgroundImage={detail.heroBackgroundImage}
        location={location}
        onBackToList={onBackToList}
        primaryAddress={detail.primaryAddress}
      />

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={15}>
          <LocationDetailGallery
            galleryItems={detail.galleryItems}
            locationName={location.name}
          />

          <LocationDetailInfoCard location={location} />

          <LocationAmenitiesCard
            services={[...detail.includedServices, ...detail.addonServices]}
          />
        </Col>

        <Col xs={24} lg={9}>
          <LocationBookingSummary
            isOwner={detail.isOwner}
            location={location}
            onOpenBooking={detail.handleOpenBooking}
          />

          <LocationOwnerCard isOwner={detail.isOwner} owner={location.owner} />

          <LocationAddressCard
            addresses={detail.addresses}
            location={location}
          />
        </Col>
      </Row>
      <SimilarLocationsSection
        locations={detail.similarLocationItems}
        onOpenLocation={detail.handleOpenSimilarLocation}
      />
    </main>
  );
};

export const LocationDetail = () => {
  const { id } = useParams();
  const detail = useLocationDetail(id);
  const { data, errorMessage, handleBackToList, isError, isLoading, refetch } =
    detail;

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

  if (!data) {
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

  return (
    <LocationDetailView
      detail={{ ...detail, location: data }}
      onBackToList={handleBackToList}
    />
  );
};
