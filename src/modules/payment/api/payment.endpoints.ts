export const PaymentEndpoint = {
  CHECKOUT: "/payments/checkout",
  CHECK_UPDATE: (token: string) => `/payments/check-update/${token}`,
} as const;
