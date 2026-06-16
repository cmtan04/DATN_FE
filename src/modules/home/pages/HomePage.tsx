import { Alert } from "antd";
import { HeroSearch } from "../components/HeroSearch";
import { PopularDestination } from "../components/PopularDestination";
import { Support } from "../components/Support";
import { useHomePage } from "../hooks/useHomePage";
import "./styles.scss";
import { RecommendLocation } from "../components/RecommendLocation";

export const HomePage = () => {
  const {
    data,
    isLoading,
    isError,
    handleViewDetail,
  } = useHomePage();

  return (
    <div className="home-page">
      <main className="home-page__main">
        <HeroSearch />

        {isError ? (
          <Alert
            className="home-page__alert"
            type="error"
            showIcon
            message="Khong the tai du lieu trang chu. Vui long thu lai sau."
          />
        ) : null}

        <PopularDestination />
        <RecommendLocation
          isLoading={isLoading}
          locations={data}
          onViewDetail={handleViewDetail}
        />

        <Support />
      </main>
    </div>
  );
};

export default HomePage;
