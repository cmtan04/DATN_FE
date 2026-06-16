import { AppstoreOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { Button, Col, Row } from "antd";
import { isAxiosError } from "axios";
import { useEffect, useRef, useState } from "react";
import { LocationCard } from "@/modules/location/components/LocationCard";
import { LocationFilterDrawer } from "../../components/LocationFilterDrawer";
import { LocationListMap } from "../../components/LocationListMap";
import { useLocationList } from "../../hooks/useLocationList";
import { useLocationMapLocations } from "../../hooks/useLocationMapLocations";

import { SearchBar } from "../../components/SearchBar";
import "./style.scss";
type LocationViewMode = "grid" | "list" | "map";

const DEFAULT_MESSAGE = "Da co loi xay ra. Vui long thu lai.";

export const LocationList = () => {
  const {
    locations,
    total,
    isEmpty,
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isError,
    error,
    refetch,
    filter,
    handleFilterApply,
    openLocationDetail,
  } = useLocationList();

  const [viewMode, setViewMode] = useState<LocationViewMode>("grid");
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const errorMessage = isAxiosError(error)
    ? ((error.response?.data as { message?: string } | undefined)?.message ??
      DEFAULT_MESSAGE)
    : DEFAULT_MESSAGE;
  const shouldFetchMapLocations =
    viewMode === "map" && total > locations.length;

  const { data: mapLocationData, isFetching: isFetchingMapLocations } =
    useLocationMapLocations(filter, total, shouldFetchMapLocations);
  const mapLocations = mapLocationData?.data ?? locations;

  const handleMapOpenDetail = (id: string | number) => {
    openLocationDetail(id);
  };
  const toggleViewMode = () => {
    if (viewMode === "map") {
      setViewMode("grid");
    } else {
      setViewMode("map");
    }
  };

  useEffect(() => {
    if (viewMode === "map" || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          void fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, viewMode]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <Row gutter={[24, 24]}>
          {Array.from({ length: 8 }, (_, index) => (
            <Col
              xs={24}
              sm={viewMode === "grid" ? 12 : 24}
              md={viewMode === "grid" ? 8 : 24}
              xl={viewMode === "grid" ? 6 : 24}
              key={index}
            >
              <div
                className={`location-page__card-skeleton ${
                  viewMode === "list"
                    ? "location-page__card-skeleton--list"
                    : ""
                }`}
              />
            </Col>
          ))}
        </Row>
      );
    }

    if (isError) {
      return (
        <div className="location-page__state">
          <p className="location-page__state-title">
            Khong the tai danh sach dia diem
          </p>
          <p>{errorMessage}</p>
          <Button onClick={() => void refetch()}>Thu lai</Button>
        </div>
      );
    }

    if (isEmpty) {
      return (
        <div className="location-page__state">
          <p className="location-page__state-title">
            Khong tim thay dia diem nao phu hop
          </p>
          <p>Hay thu thay doi tu khoa tim kiem hoac bo loc.</p>
        </div>
      );
    }

    return (
      <>
        {viewMode === "map" ? (
          <>
            {isFetchingMapLocations && (
              <p className="location-page__status">
                Dang cap nhat du lieu ban do...
              </p>
            )}
            <LocationListMap
              locations={mapLocations}
              onOpenDetail={handleMapOpenDetail}
            />
          </>
        ) : (
          <Row gutter={[24, 24]}>
            {locations.map((locationItem) => (
              <Col xs={24} sm={12} md={8} key={locationItem.id}>
                <LocationCard
                  location={locationItem}
                  onClick={openLocationDetail}
                />
              </Col>
            ))}
          </Row>
        )}

        {viewMode !== "map" && (
          <div ref={loadMoreRef} className="location-page__load-more">
            {isFetchingNextPage && <span>Dang tai them ket qua...</span>}
          </div>
        )}
      </>
    );
  };

  return (
    <main className="location-page">
      <SearchBar />

      <section className="location-page__list">
        <Row gutter={[24, 24]}>
          <Col span={8}>
            <LocationFilterDrawer
              open={false}
              onClose={() => undefined}
              initialFilter={filter}
              onApply={handleFilterApply}
            />
          </Col>

          <Col xs={24} lg={16}>
            <div className="location-page__toolbar">
              <h2>Tong so dia diem: {total}</h2>

              <div className="location-page__actions">
                <Button
                  type={viewMode === "map" ? "primary" : "default"}
                  icon={
                    viewMode === "map" ? (
                      <AppstoreOutlined />
                    ) : (
                      <EnvironmentOutlined />
                    )
                  }
                  onClick={toggleViewMode}
                  size="small"
                >
                  {viewMode === "map" ? "Xem dạng lưới" : "Xem trong bản đồ"}
                </Button>
              </div>
            </div>
            {isFetching && !isLoading && !isFetchingNextPage && (
              <p className="location-page__status">
                Dang cap nhat danh sach...
              </p>
            )}
            <div className="location-page__content">{renderContent()}</div>
          </Col>
        </Row>
      </section>
    </main>
  );
};
