import type { SegmentedProps } from "antd";
import type { LocationCardProps } from "@shared/components/LocationCard";

export type HomeLocation = Omit<LocationCardProps, "onViewDetail">;
export type RegionKey = "north" | "central" | "south";

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
  featuredLocations: HomeLocation[];
  newLocations: HomeLocation[];
  regions: RegionItem[];
  regionOptions: NonNullable<SegmentedProps<RegionKey>["options"]>;
}
