const FAVORITE_LOCATIONS_STORAGE_KEY = "fe-datn:favorites:locations";
const FAVORITE_LOCATIONS_EVENT = "favorite-locations-changed";

export interface FavoriteLocationSnapshot {
  id: string | number;
  typeName: string;
  name: string;
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
    const itemId = String(item.id);
    const existing = uniqueMap.get(itemId);
    if (!existing || item.savedAt >= existing.savedAt) {
      uniqueMap.set(itemId, item);
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
      parsedValue.filter((item) => Boolean(item?.id)),
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

export const isFavoriteLocation = (id: string | number) =>
  readFavoriteLocations().some((item) => String(item.id) === String(id));

export const removeFavoriteLocation = (id: string | number) => {
  const currentItems = readFavoriteLocations();
  writeFavoriteLocations(
    currentItems.filter((item) => String(item.id) !== String(id)),
  );
};

export const saveFavoriteLocation = (location: FavoriteLocationPayload) => {
  const currentItems = readFavoriteLocations();
  const filteredItems = currentItems.filter(
    (item) => String(item.id) !== String(location.id),
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
  if (isFavoriteLocation(location.id)) {
    removeFavoriteLocation(location.id);
    return;
  }

  saveFavoriteLocation(location);
};
