export const PAYMENT_QUERY_KEYS = {
  checkUpdate: (token: string) =>
    ["payments", "check-update", token] as const,
} as const;
