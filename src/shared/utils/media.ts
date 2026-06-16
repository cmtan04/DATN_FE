const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";

export const resolveMediaUrl = (url: string) => {
  if (!url.startsWith("/")) {
    return url;
  }

  return `${apiBaseUrl}${url}`;
};
