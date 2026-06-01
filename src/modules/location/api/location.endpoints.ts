export const LocationEndpoint = {
  GET_LOCATIONS: "/locations",
  GET_LOCATION_BY_FILTER: "/locations",
  GET_LOCATION_BY_CODE: "/locations",
  GET_ALL_LOCATION_TYPE: "/locations/location-types",
  GET_RELATED_LOCATIONS: "/locations/:id/related",
  LOCATION_MEDIA: (id: string | number) => `/locations/${id}/media`,
  LOCATION_CONTENT: (id: string | number) => `/locations/${id}/content`,
} as const;
