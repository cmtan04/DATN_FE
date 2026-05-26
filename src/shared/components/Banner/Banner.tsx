import { Button, Empty, Input, Skeleton, Space, Typography } from "antd";
import "./banner.scss";

interface BannerProps {
  title: string;
  description?: string;
  placeholder?: string;
  searchButtonText?: string;
  suggestions?: string[];
  suggestionsLoading?: boolean;
  emptySuggestionText?: string;
  onSearch: (value: string) => void;
  onSuggestionClick?: (keyword: string) => void;
}

const skeletonItems = Array.from({ length: 6 }, (_, index) => index);

export const Banner = ({
  title,
  description,
  placeholder = "Nhap tu khoa tim kiem",
  searchButtonText = "Tim kiem",
  suggestions = [],
  suggestionsLoading = false,
  emptySuggestionText = "Chua co goi y tim kiem.",
  onSearch,
  onSuggestionClick,
}: BannerProps) => {
  const handleSearch = (value: string) => {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      return;
    }

    onSearch(trimmedValue);
  };

  const handleSuggestionClick = (keyword: string) => {
    if (onSuggestionClick) {
      onSuggestionClick(keyword);
      return;
    }

    handleSearch(keyword);
  };

  return (
    <section className="shared-banner">
      <div className="shared-banner__hero">
        <div className="shared-banner__motion" aria-hidden="true" />
        <div className="shared-banner__inner">
          <Space direction="vertical" size={14} className="shared-banner__copy">
            <Typography.Title level={1}>{title}</Typography.Title>
            {description ? (
              <Typography.Paragraph>{description}</Typography.Paragraph>
            ) : null}
            <Input.Search
              className="shared-banner__search"
              size="large"
              enterButton={searchButtonText}
              allowClear
              placeholder={placeholder}
              onSearch={handleSearch}
            />
          </Space>
        </div>
        <div className="shared-banner__suggestions" aria-label="Goi y tim kiem">
          {suggestionsLoading ? (
            <div className="shared-banner__suggestion-list">
              {skeletonItems.map((item) => (
                <Skeleton.Button
                  active
                  key={item}
                  className="shared-banner__suggestion-skeleton"
                />
              ))}
            </div>
          ) : suggestions.length > 0 ? (
            <div className="shared-banner__suggestion-list">
              {suggestions.map((suggestion) => (
                <Button
                  key={suggestion}
                  className="shared-banner__suggestion-item"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          ) : (
            <Empty description={emptySuggestionText} />
          )}
        </div>
      </div>
    </section>
  );
};
