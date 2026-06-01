import { isAxiosError } from "axios";

export const getLocationMutationErrorMessage = (error: unknown) => {
  if (isAxiosError(error)) {
    const responseData = error.response?.data as
      | { message?: string }
      | undefined;
    return responseData?.message ?? "Khong the cap nhat. Vui long thu lai.";
  }

  return "Khong the cap nhat. Vui long thu lai.";
};
