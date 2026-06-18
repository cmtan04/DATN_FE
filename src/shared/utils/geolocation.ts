import {
  DEFAULT_LOCATION_LATITUDE,
  DEFAULT_LOCATION_LONGITUDE,
} from "@shared/constants/location";

export interface CurrentCoordinates {
  lat: number;
  lng: number;
}

export const getCurrentCoordinates = async (): Promise<CurrentCoordinates> => {
  if (typeof window === "undefined" || !navigator.geolocation) {
    return {
      lat: DEFAULT_LOCATION_LATITUDE,
      lng: DEFAULT_LOCATION_LONGITUDE,
    };
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => {
        resolve({
          lat: DEFAULT_LOCATION_LATITUDE,
          lng: DEFAULT_LOCATION_LONGITUDE,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      },
    );
  });
};
