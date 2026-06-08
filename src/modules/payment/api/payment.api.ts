import { axiosClient } from "@shared/services/axiosClient";
import type {
  CheckoutPaymentRequest,
  CheckoutPaymentResponse,
  PaymentCheckUpdateResponse,
} from "../types";
import { PaymentEndpoint } from "./payment.endpoints";

export const createCheckout = async (
  payload: CheckoutPaymentRequest,
): Promise<CheckoutPaymentResponse> => {
  const response = await axiosClient.post<CheckoutPaymentResponse>(
    PaymentEndpoint.CHECKOUT,
    payload,
  );

  return response.data;
};

export const checkPaymentUpdate = async (
  token: string,
): Promise<PaymentCheckUpdateResponse> => {
  const response = await axiosClient.get<PaymentCheckUpdateResponse>(
    PaymentEndpoint.CHECK_UPDATE(token),
  );

  return response.data;
};
