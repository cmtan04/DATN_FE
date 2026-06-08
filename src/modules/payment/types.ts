export const BOOKING_STATUS = {
  PENDING_PAYMENT: "PENDING_PAYMENT",
  CONFIRMED: "CONFIRMED",
  CANCELLED: "CANCELLED",
  EXPIRED: "EXPIRED",
} as const;

export type BookingStatus =
  (typeof BOOKING_STATUS)[keyof typeof BOOKING_STATUS];

export const PAYMENT_STATUS = {
  UNPAID: "UNPAID",
  PAID: "PAID",
  FAILED: "FAILED",
  EXPIRED: "EXPIRED",
  CANCELLED: "CANCELLED",
  REFUNDED: "REFUNDED",
} as const;

export type PaymentStatus =
  (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];

export interface CheckoutPaymentRequest {
  locationId: number;
  startDate: string;
  endDate: string;
  guestCount: number;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  note?: string;
}

export interface CheckoutPaymentResponse {
  bookingId: number;
  paymentId: number;
  checkoutUrl: string;
  qrCode: string;
  status: PaymentStatus;
}

export interface PaymentCheckUpdateResponse {
  bookingId: number;
  paymentId: number;
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
  amount: number;
  currency: string;
  checkoutUrl?: string | null;
  qrCode?: string | null;
}
