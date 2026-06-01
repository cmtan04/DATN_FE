import type { SegmentedProps } from "antd";
import type { LocationDto } from "@shared/types/location";

export type HomeLocation = LocationDto;
export type RegionKey = "north" | "central" | "south";
export type LocationSortBy = "price" | "area" | "rating" | "createdAt";
export type LocationSortOrder = "ASC" | "DESC";

export interface PopularPlace {
  key: string;
  title: string;
  description: string;
  keyword: string;
  imageUrl?: string;
}

export interface RegionItem {
  key: RegionKey;
  title: string;
  description: string;
  highlight: string;
}

export interface HomeOverviewData {
  searchSuggestions: string[];
  popularPlaces: PopularPlace[];
  featuredLocations?: HomeLocation[];
  newLocations?: HomeLocation[];
  regions: RegionItem[];
  regionOptions: NonNullable<SegmentedProps<RegionKey>["options"]>;
}
