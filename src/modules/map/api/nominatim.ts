import type { NominatimResponseDto } from "../types";

const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org";

const parseJson = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    throw new Error(`Nominatim request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
};

export const searchPlaces = async (
  query: string,
  options?: {
    signal?: AbortSignal;
    limit?: number;
    language?: string;
  },
): Promise<NominatimResponseDto[]> => {
  const params = new URLSearchParams({
    format: "json",
    q: query,
    addressdetails: "1",
    limit: String(options?.limit ?? 5),
    "accept-language": options?.language ?? "vi",
  });

  const response = await fetch(
    `${NOMINATIM_BASE_URL}/search?${params.toString()}`,
    { signal: options?.signal },
  );

  return parseJson<NominatimResponseDto[]>(response);
};

export const reverseGeocode = async (
  lat: number,
  lng: number,
  options?: { signal?: AbortSignal },
): Promise<NominatimResponseDto> => {
  const params = new URLSearchParams({
    format: "json",
    lat: String(lat),
    lon: String(lng),
    addressdetails: "1",
  });

  const response = await fetch(
    `${NOMINATIM_BASE_URL}/reverse?${params.toString()}`,
    { signal: options?.signal },
  );

  return parseJson<NominatimResponseDto>(response);
};
