import { Card, Empty, Image, Tag } from "antd";
import type { LocationMediaDto } from "../../types";
import { resolveMediaUrl } from "../../utils/media";

interface LocationDescriptionMediaCardProps {
  mediaItems: LocationMediaDto[];
  locationName: string;
}

const MAX_VISIBLE_DESCRIPTION_MEDIA = 3;

export const LocationDescriptionMediaCard = ({
  mediaItems,
  locationName,
}: LocationDescriptionMediaCardProps) => {
  const visibleItems = mediaItems.slice(0, MAX_VISIBLE_DESCRIPTION_MEDIA);
  const remainingCount = Math.max(
    mediaItems.length - MAX_VISIBLE_DESCRIPTION_MEDIA,
    0,
  );

  return (
    <Card title="Hinh anh va video mo ta" className="location-detail__card">
      {visibleItems.length ? (
        <div className="location-detail__description-media-grid">
          {visibleItems.map((media, index) => {
            const mediaUrl = resolveMediaUrl(media.url);
            const shouldShowOverlay =
              index === MAX_VISIBLE_DESCRIPTION_MEDIA - 1 &&
              remainingCount > 0;

            return (
              <div
                key={media.id}
                className="location-detail__description-media-item"
              >
                {media.type === "image360" ? (
                  <Tag color="blue">Anh 360</Tag>
                ) : null}
                {media.type === "video" ? (
                  <video
                    className="location-detail__description-video"
                    src={mediaUrl}
                    controls
                  />
                ) : (
                  <Image
                    src={mediaUrl}
                    alt={locationName}
                    className="location-detail__description-image"
                  />
                )}
                {shouldShowOverlay ? (
                  <div className="location-detail__description-media-overlay">
                    +{remainingCount}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Chua co hinh anh hoac video mo ta"
        />
      )}
    </Card>
  );
};
