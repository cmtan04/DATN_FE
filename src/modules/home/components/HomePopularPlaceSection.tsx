import { Card, Empty, Skeleton, Typography } from "antd";
import type { KeyboardEvent } from "react";
import type { PopularPlace } from "../types";

interface HomePopularPlaceSectionProps {
  places?: PopularPlace[];
  isLoading: boolean;
  onPlaceClick: (keyword: string) => void;
}

const skeletonItems = Array.from({ length: 6 }, (_, index) => index);

export const HomePopularPlaceSection = ({
  places = [],
  isLoading,
  onPlaceClick,
}: HomePopularPlaceSectionProps) => {
  const handleCardKeyDown = (
    event: KeyboardEvent<HTMLDivElement>,
    keyword: string,
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onPlaceClick(keyword);
    }
  };

  return (
    <section className="home-section home-section--popular-places">
      <div className="home-section__header">
        <div>
          <Typography.Title level={2}>Địa điểm nổi tiếng</Typography.Title>
          <Typography.Paragraph>
            Chọn nhanh khu vực được quan tâm để mở danh sách phòng phù hợp.
          </Typography.Paragraph>
        </div>
      </div>

      {isLoading ? (
        <div className="home-popular-place__scroller">
          <div className="home-popular-place__track">
            {skeletonItems.map((item) => (
              <Skeleton.Node
                active
                key={item}
                className="home-popular-place__skeleton"
              />
            ))}
          </div>
        </div>
      ) : places.length > 0 ? (
        <div className="home-popular-place__scroller">
          <div className="home-popular-place__track">
            {places.map((place) => (
              <Card
                hoverable
                role="button"
                tabIndex={0}
                key={place.key}
                className="home-popular-place"
                cover={
                  <div className="home-popular-place__media">
                    {place.imageUrl ? (
                      <img src={place.imageUrl} alt={place.title} loading="lazy" />
                    ) : (
                      <div className="home-popular-place__media-fallback" />
                    )}
                  </div>
                }
                onClick={() => onPlaceClick(place.keyword)}
                onKeyDown={(event) => handleCardKeyDown(event, place.keyword)}
              >
                <Typography.Title level={3}>{place.title}</Typography.Title>
                <Typography.Paragraph>{place.description}</Typography.Paragraph>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <Empty description="Chưa có địa điểm nổi tiếng để hiển thị." />
      )}
    </section>
  );
};
