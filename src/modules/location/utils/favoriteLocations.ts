const FAVORITE_LOCATIONS_STORAGE_KEY = "fe-datn:favorites:locations";
const FAVORITE_LOCATIONS_EVENT = "favorite-locations-changed";

export interface FavoriteLocationSnapshot {
  locationCode: string;
  typeName: string;
  name: string;
  description?: string;
  address?: string;
  rate?: number;
  price?: number;
  priceUnit?: string;
  image?: string;
  savedAt: number;
}

export type FavoriteLocationPayload = Omit<
  FavoriteLocationSnapshot,
  "savedAt"
>;

const getStorage = () => {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage;
};

const dispatchFavoritesChanged = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(FAVORITE_LOCATIONS_EVENT));
};

const normalizeFavoriteLocations = (
  items: FavoriteLocationSnapshot[],
): FavoriteLocationSnapshot[] => {
  const uniqueMap = new Map<string, FavoriteLocationSnapshot>();

  items.forEach((item) => {
    const existing = uniqueMap.get(item.locationCode);
    if (!existing || item.savedAt >= existing.savedAt) {
      uniqueMap.set(item.locationCode, item);
    }
  });

  return Array.from(uniqueMap.values()).sort(
    (left, right) => right.savedAt - left.savedAt,
  );
};

export const readFavoriteLocations = (): FavoriteLocationSnapshot[] => {
  const storage = getStorage();
  if (!storage) {
    return [];
  }

  try {
    const rawValue = storage.getItem(FAVORITE_LOCATIONS_STORAGE_KEY);
    if (!rawValue) {
      return [];
    }

    const parsedValue = JSON.parse(rawValue) as FavoriteLocationSnapshot[];
    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return normalizeFavoriteLocations(
      parsedValue.filter((item) => Boolean(item?.locationCode)),
    );
  } catch {
    return [];
  }
};

const writeFavoriteLocations = (items: FavoriteLocationSnapshot[]) => {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  storage.setItem(
    FAVORITE_LOCATIONS_STORAGE_KEY,
    JSON.stringify(normalizeFavoriteLocations(items)),
  );
  dispatchFavoritesChanged();
};

export const isFavoriteLocation = (locationCode: string) =>
  readFavoriteLocations().some((item) => item.locationCode === locationCode);

export const removeFavoriteLocation = (locationCode: string) => {
  const currentItems = readFavoriteLocations();
  writeFavoriteLocations(
    currentItems.filter((item) => item.locationCode !== locationCode),
  );
};

export const saveFavoriteLocation = (location: FavoriteLocationPayload) => {
  const currentItems = readFavoriteLocations();
  const filteredItems = currentItems.filter(
    (item) => item.locationCode !== location.locationCode,
  );

  writeFavoriteLocations([
    {
      ...location,
      savedAt: Date.now(),
    },
    ...filteredItems,
  ]);
};

export const toggleFavoriteLocation = (location: FavoriteLocationPayload) => {
  if (isFavoriteLocation(location.locationCode)) {
    removeFavoriteLocation(location.locationCode);
    return;
  }

  saveFavoriteLocation(location);
};
