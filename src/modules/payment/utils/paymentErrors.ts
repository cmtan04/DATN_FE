import { isAxiosError } from "axios";

const DEFAULT_PAYMENT_ERROR =
  "Khong the xu ly thanh toan luc nay. Vui long thu lai.";

const ERROR_MESSAGES: Record<string, string> = {
  "Location not found": "Khong tim thay phong can thanh toan.",
  "Location is already booked": "Phong da co booking trung thoi gian nay.",
  "endDate must be after startDate": "Ngay ket thuc phai sau ngay bat dau.",
  "contactEmail is invalid": "Email lien he khong hop le.",
  "Cannot access this payment": "Ban khong co quyen xem thanh toan nay.",
  "Payment not found": "Khong tim thay giao dich thanh toan.",
};

export const getPaymentErrorMessage = (error: unknown): string => {
  if (!isAxiosError(error)) {
    return DEFAULT_PAYMENT_ERROR;
  }

  const data = error.response?.data as
    | { message?: string | string[]; error?: string }
    | undefined;
  const rawMessage = Array.isArray(data?.message)
    ? data.message[0]
    : data?.message;

  if (!rawMessage) {
    return DEFAULT_PAYMENT_ERROR;
  }

  return ERROR_MESSAGES[rawMessage] ?? rawMessage;
};
