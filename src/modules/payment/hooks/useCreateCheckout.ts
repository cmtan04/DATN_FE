import { useMutation } from "@tanstack/react-query";
import { createCheckout } from "../api/payment.api";
import type { CheckoutPaymentRequest } from "../types";

export const useCreateCheckout = () =>
  useMutation({
    mutationFn: (payload: CheckoutPaymentRequest) => createCheckout(payload),
  });
