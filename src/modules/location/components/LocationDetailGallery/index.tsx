import {
  LeftOutlined,
  PlayCircleOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { Button, Empty, Modal, Tag } from "antd";
import type { SyntheticEvent } from "react";
import { useMemo, useState } from "react";
import type { LocationMedia } from "../../types";

interface LocationDetailGalleryProps {
  galleryItems: LocationMedia[];
  locationName: string;
}

type MediaOrientation = "landscape" | "portrait";

const MAX_VISIBLE_GALLERY_ITEMS = 5;

const getMediaLabel = (type: LocationMedia["type"]) => {
  if (type === "video") return "Video";
  if (type === "image360") return "Anh 360";

  return undefined;
};

const getPreviewGridModifier = (mediaCount: number) => {
  if (mediaCount <= 1) return "single";
  if (mediaCount === 2) return "pair";
  if (mediaCount === 3) return "triple";
  if (mediaCount === 4) return "quad";

  return "featured";
};

export const LocationDetailGallery = ({
  galleryItems,
  locationName,
}: LocationDetailGalleryProps) => {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const [mediaOrientations, setMediaOrientations] = useState<
    Record<number, MediaOrientation>
  >({});

  const visibleItems = galleryItems.slice(0, MAX_VISIBLE_GALLERY_ITEMS);
  const activeViewerItem =
    viewerIndex === null ? undefined : galleryItems[viewerIndex];
  const remainingCount = Math.max(
    galleryItems.length - MAX_VISIBLE_GALLERY_ITEMS,
    0,
  );
  const previewGridClassName = useMemo(
    () =>
      [
        "location-detail__gallery-grid",
        `location-detail__gallery-grid--${getPreviewGridModifier(
          visibleItems.length,
        )}`,
      ].join(" "),
    [visibleItems.length],
  );

  const handleOpenGallery = () => {
    setIsGalleryOpen(true);
  };

  const handleCloseGallery = () => {
    setIsGalleryOpen(false);
    setViewerIndex(null);
  };

  const handleCloseViewer = () => {
    setViewerIndex(null);
  };

  const handleOpenViewer = (index: number) => {
    setViewerIndex(index);
  };

  const handlePreviousViewerItem = () => {
    setViewerIndex((currentIndex) => {
      if (currentIndex === null) return currentIndex;

      return currentIndex === 0 ? galleryItems.length - 1 : currentIndex - 1;
    });
  };

  const handleNextViewerItem = () => {
    setViewerIndex((currentIndex) => {
      if (currentIndex === null) return currentIndex;

      return currentIndex === galleryItems.length - 1 ? 0 : currentIndex + 1;
    });
  };

  const handleImageLoad =
    (mediaId: number) => (event: SyntheticEvent<HTMLImageElement>) => {
      const image = event.currentTarget;
      const orientation =
        image.naturalHeight > image.naturalWidth ? "portrait" : "landscape";

      setMediaOrientations((currentOrientations) => ({
        ...currentOrientations,
        [mediaId]: orientation,
      }));
    };

  const handleVideoMetadataLoad =
    (mediaId: number) => (event: SyntheticEvent<HTMLVideoElement>) => {
      const video = event.currentTarget;
      const orientation =
        video.videoHeight > video.videoWidth ? "portrait" : "landscape";

      setMediaOrientations((currentOrientations) => ({
        ...currentOrientations,
        [mediaId]: orientation,
      }));
    };

  const renderMediaPreview = (media: LocationMedia) => {
    if (media.type === "video") {
      return (
        <>
          <video
            className="location-detail__gallery-media"
            src={media.url}
            muted
            playsInline
            preload="metadata"
            onLoadedMetadata={handleVideoMetadataLoad(media.id)}
          />
          <PlayCircleOutlined className="location-detail__gallery-play" />
        </>
      );
    }

    return (
      <img
        className="location-detail__gallery-media"
        src={media.url}
        alt={locationName}
        loading="lazy"
        onLoad={handleImageLoad(media.id)}
      />
    );
  };

  return (
    <section className="location-detail__gallery">
      {visibleItems.length ? (
        <>
          <div className={previewGridClassName}>
            {visibleItems.map((media, index) => {
              const mediaLabel = getMediaLabel(media.type);
              const shouldShowOverlay =
                index === MAX_VISIBLE_GALLERY_ITEMS - 1 && remainingCount > 0;

              return (
                <button
                  key={media.id}
                  type="button"
                  className="location-detail__gallery-tile"
                  onClick={handleOpenGallery}
                >
                  {renderMediaPreview(media)}

                  {mediaLabel ? (
                    <Tag className="location-detail__gallery-tag" color="blue">
                      {mediaLabel}
                    </Tag>
                  ) : null}

                  {shouldShowOverlay ? (
                    <span className="location-detail__gallery-overlay">
                      +{remainingCount}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>

          <Modal
            centered
            footer={null}
            open={isGalleryOpen}
            title={`${locationName} - ${galleryItems.length} ảnh`}
            width={1120}
            className="location-detail__gallery-modal"
            onCancel={handleCloseGallery}
          >
            <div className="location-detail__gallery-full-grid">
              {galleryItems.map((media, index) => {
                const mediaLabel = getMediaLabel(media.type);
                const isPortrait = mediaOrientations[media.id] === "portrait";
                const fullItemClassName = [
                  "location-detail__gallery-full-item",
                  isPortrait
                    ? "location-detail__gallery-full-item--portrait"
                    : "",
                ]
                  .filter(Boolean)
                  .join(" ");

                return (
                  <button
                    key={media.id}
                    type="button"
                    className={fullItemClassName}
                    onClick={() => handleOpenViewer(index)}
                  >
                    {renderMediaPreview(media)}

                    {mediaLabel ? (
                      <Tag
                        className="location-detail__gallery-tag"
                        color="blue"
                      >
                        {mediaLabel}
                      </Tag>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </Modal>

          <Modal
            centered
            footer={null}
            open={Boolean(activeViewerItem)}
            title={
              viewerIndex === null
                ? locationName
                : `${locationName} - ${viewerIndex + 1}/${galleryItems.length}`
            }
            width={1040}
            className="location-detail__gallery-viewer-modal"
            onCancel={handleCloseViewer}
          >
            {activeViewerItem ? (
              <div className="location-detail__gallery-viewer">
                <Button
                  aria-label="Anh truoc"
                  className="location-detail__gallery-viewer-nav"
                  disabled={galleryItems.length < 2}
                  icon={<LeftOutlined />}
                  shape="circle"
                  onClick={handlePreviousViewerItem}
                />

                <div className="location-detail__gallery-viewer-media">
                  {getMediaLabel(activeViewerItem.type) ? (
                    <Tag color="blue">{getMediaLabel(activeViewerItem.type)}</Tag>
                  ) : null}

                  {activeViewerItem.type === "video" ? (
                    <video src={activeViewerItem.url} controls autoPlay />
                  ) : (
                    <img src={activeViewerItem.url} alt={locationName} />
                  )}
                </div>

                <Button
                  aria-label="Anh tiep theo"
                  className="location-detail__gallery-viewer-nav"
                  disabled={galleryItems.length < 2}
                  icon={<RightOutlined />}
                  shape="circle"
                  onClick={handleNextViewerItem}
                />
              </div>
            ) : null}
          </Modal>
        </>
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Chua co hinh anh"
        />
      )}
    </section>
  );
};
