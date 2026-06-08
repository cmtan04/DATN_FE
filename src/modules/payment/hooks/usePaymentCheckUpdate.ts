import { useQuery } from "@tanstack/react-query";
import { checkPaymentUpdate } from "../api/payment.api";
import { PAYMENT_QUERY_KEYS } from "../constants/queryKeys";

export const usePaymentCheckUpdate = (token?: string) =>
  useQuery({
    queryKey: PAYMENT_QUERY_KEYS.checkUpdate(token ?? ""),
    queryFn: () => checkPaymentUpdate(token as string),
    enabled: Boolean(token),
    retry: false,
  });
