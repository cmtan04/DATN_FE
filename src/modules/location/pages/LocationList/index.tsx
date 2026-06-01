import {
  AppstoreOutlined,
  BarsOutlined,
  EnvironmentOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { Button, Col, Grid, Row, Tooltip } from "antd";
import { isAxiosError } from "axios";
import { useEffect, useRef, useState } from "react";
import { Banner } from "@shared/components";
import { LocationCard } from "../../components/LocationCard";
import { LocationFilterDrawer } from "../../components/LocationFilterDrawer";
import { LocationListMap } from "../../components/LocationListMap";
import { LocationRow } from "../../components/LocationRow";
import { useLocationList } from "../../hooks/useLocationList";
import { useLocationMapLocations } from "../../hooks/useLocationMapLocations";
import type { LocationDto } from "../../types";
import { isFavoriteLocation } from "../../utils/favoriteLocations";
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
    searchSuggestions,
    filter,
    handleFilterApply,
    handleSearch,
    openLocationDetail,
    isFilterOpen,
    setIsFilterOpen,
  } = useLocationList();

  const [viewMode, setViewMode] = useState<LocationViewMode>("grid");
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const screens = Grid.useBreakpoint();
  const isDesktop = screens.lg;
  const isSmall = screens.sm;
  const errorMessage = isAxiosError(error)
    ? (error.response?.data as { message?: string } | undefined)?.message ??
      DEFAULT_MESSAGE
    : DEFAULT_MESSAGE;
  const shouldFetchMapLocations =
    viewMode === "map" && total > locations.length;

  const { data: mapLocationData, isFetching: isFetchingMapLocations } =
    useLocationMapLocations(filter, total, shouldFetchMapLocations);
  const mapLocations = mapLocationData?.data ?? locations;

  const handleMapOpenDetail = (id: string | number) => {
    openLocationDetail(id);
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

  const renderLocationCard = (locationItem: LocationDto) => {
    const rowProps = {
      id: locationItem.id,
      typeName: locationItem.type?.name ?? "Chua phan loai",
      name: locationItem.name,
      address: locationItem.address?.fullAddress,
      rate: locationItem.averageRating,
      price: locationItem.price,
      priceUnit: locationItem.priceUnit,
      image: locationItem.thumbnailMedia?.url,
      isFavourite: isFavoriteLocation(locationItem.id),
      onClick: () => openLocationDetail(locationItem.id),
    };

    return viewMode === "grid" && isSmall ? (
      <LocationCard
        location={locationItem}
        isFavourite={isFavoriteLocation(locationItem.id)}
        onClick={openLocationDetail}
      />
    ) : (
      <LocationRow {...rowProps} />
    );
  };

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
                  viewMode === "list" ? "location-page__card-skeleton--list" : ""
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
              <Col
                xs={24}
                sm={viewMode === "grid" ? 12 : 24}
                md={viewMode === "grid" ? 8 : 24}
                key={locationItem.id}
              >
                {renderLocationCard(locationItem)}
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
      <Banner
        title="Tim kiem khong gian phu hop"
        description="Kham pha dia diem theo khu vuc, loai hinh va nhu cau cua ban."
        placeholder="Tim kiem theo ten, dia chi..."
        searchButtonText="Tim kiem"
        suggestions={searchSuggestions}
        emptySuggestionText="Chua co goi y tim kiem."
        onSearch={handleSearch}
      />

      <section className="location-page__list">
        <Row gutter={[24, 24]}>
          {isDesktop && (
            <Col span={8}>
              <LocationFilterDrawer
                open={false}
                onClose={() => undefined}
                initialFilter={filter}
                onApply={handleFilterApply}
              />
            </Col>
          )}

          <Col xs={24} lg={16}>
            <div className="location-page__toolbar">
              <h2>Tong so dia diem: {total}</h2>

              <div className="location-page__actions">
                {isSmall && (
                  <div className="location-page__view-toggle">
                    <Tooltip title="Xem dang luoi">
                      <Button
                        type={viewMode === "grid" ? "primary" : "text"}
                        icon={<AppstoreOutlined />}
                        onClick={() => setViewMode("grid")}
                        size="small"
                      />
                    </Tooltip>
                    <Tooltip title="Xem dang danh sach">
                      <Button
                        type={viewMode === "list" ? "primary" : "text"}
                        icon={<BarsOutlined />}
                        onClick={() => setViewMode("list")}
                        size="small"
                      />
                    </Tooltip>
                  </div>
                )}

                <Tooltip title="Xem trong ban do">
                  <Button
                    type={viewMode === "map" ? "primary" : "default"}
                    icon={<EnvironmentOutlined />}
                    onClick={() => setViewMode("map")}
                    size="small"
                  >
                    Ban do
                  </Button>
                </Tooltip>

                {!isSmall && viewMode === "map" && (
                  <Tooltip title="Quay lai danh sach">
                    <Button
                      icon={<BarsOutlined />}
                      onClick={() => setViewMode("list")}
                      size="small"
                    >
                      Danh sach
                    </Button>
                  </Tooltip>
                )}

                {!isDesktop && (
                  <Button
                    icon={<FilterOutlined />}
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                  >
                    Loc
                  </Button>
                )}
              </div>
            </div>

            {!isDesktop && isFilterOpen && (
              <LocationFilterDrawer
                open={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                initialFilter={filter}
                onApply={handleFilterApply}
              />
            )}

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
