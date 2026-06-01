import { Alert } from "antd";
import { Banner } from "@shared/components";
import { HomeLocationSection } from "../components/HomeLocationSection";
import { HomePopularPlaceSection } from "../components/HomePopularPlaceSection";
import { HomeRegionSection } from "../components/HomeRegionSection";
import { useHomePage } from "../hooks/useHomePage";
import "./styles.scss";

export const HomePage = () => {
  const {
    data,
    isLoading,
    isError,
    handleSearch,
    handleKeywordNavigate,
    handleViewDetail,
    handleRegionClick,
    handleViewHighestRating,
    handleViewNewest,
  } = useHomePage();

  return (
    <div className="home-page">
      <main className="home-page__main">
        <Banner
          title="Tìm phòng thuê phù hợp"
          description="Tra cứu phòng trọ, căn hộ và nhà nguyên căn theo khu vực, giá thuê hoặc loại hình lưu trú."
          placeholder="Nhập khu vực, tên đường hoặc loại phòng"
          searchButtonText="Tìm kiếm"
          suggestions={data?.searchSuggestions}
          suggestionsLoading={isLoading}
          emptySuggestionText="Chưa có gợi ý tìm kiếm."
          onSearch={handleSearch}
          onSuggestionClick={handleKeywordNavigate}
        />

        {isError ? (
          <Alert
            className="home-page__alert"
            type="error"
            showIcon
            message="Không thể tải dữ liệu trang chủ. Vui lòng thử lại sau."
          />
        ) : null}

        <HomePopularPlaceSection
          places={data?.popularPlaces}
          isLoading={isLoading}
          onPlaceClick={handleKeywordNavigate}
        />

        <HomeLocationSection
          title="Phòng nổi bật"
          description="Lựa chọn có vị trí tốt và được quan tâm nhiều."
          actionLabel="Xem tất cả"
          locations={data?.featuredLocations}
          isLoading={isLoading}
          onActionClick={handleViewHighestRating}
          onViewDetail={handleViewDetail}
          isNew={false}
        />

        <HomeLocationSection
          title="Phòng mới"
          description="Tin đăng mới cập nhật để bạn so sánh nhanh."
          actionLabel="Xem phòng mới"
          locations={data?.newLocations}
          isLoading={isLoading}
          onActionClick={handleViewNewest}
          onViewDetail={handleViewDetail}
          isNew={true}
        />

        <HomeRegionSection
          regions={data?.regions}
          isLoading={isLoading}
          onRegionClick={handleRegionClick}
        />
      </main>
    </div>
  );
};

export default HomePage;
