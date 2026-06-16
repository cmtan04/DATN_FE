import { useCallback, useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "../api/auth.api";
import { getAuthErrorMessage } from "../api/auth.errors";
import type {
  GetOtpRequest,
  VerifyOtpRequest,
  ResetPasswordRequest,
} from "../types";

export type ForgotPasswordStep = "email" | "otp" | "reset";

export const forgotPasswordStepIndex: Record<ForgotPasswordStep, number> = {
  email: 0,
  otp: 1,
  reset: 2,
};

export const useForgotPasswordFlow = () => {
  const [step, setStep] = useState<ForgotPasswordStep>("email");
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const sendOtpMutation = useMutation({
    mutationFn: (values: GetOtpRequest) => authApi.getOtp(values),
    onMutate: () => {
      setErrorMessage("");
    },
    onSuccess: (_, values) => {
      setEmail(values.email);
      setStep("otp");
    },
    onError: (error) => {
      setErrorMessage(getAuthErrorMessage(error));
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: (values: VerifyOtpRequest) =>
      authApi.verifyOtp({ email: values.email, otp: values.otp }),
    onMutate: () => {
      setErrorMessage("");
    },
    onSuccess: (data) => {
      setResetToken(data.resetToken || ""); // Assuming the token is returned in the message response
      setStep("reset");
    },
    onError: (error) => {
      setErrorMessage(getAuthErrorMessage(error));
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: (values: ResetPasswordRequest) =>
      authApi.resetPassword({
        resetToken: values.resetToken,
        password: values.password,
      }),
    onMutate: () => {
      setErrorMessage("");
    },
    onError: (error) => {
      setErrorMessage(getAuthErrorMessage(error));
    },
  });

  const sendOtp = useCallback(
    (values: GetOtpRequest) => sendOtpMutation.mutateAsync(values),
    [sendOtpMutation],
  );

  const resendOtp = useCallback(() => {
    if (!email || sendOtpMutation.isPending) {
      return Promise.resolve();
    }

    return sendOtpMutation.mutateAsync({ email });
  }, [email, sendOtpMutation]);

  const verifyOtp = useCallback(
    (values: VerifyOtpRequest) => verifyOtpMutation.mutateAsync(values),
    [verifyOtpMutation],
  );

  const resetPassword = useCallback(
    (values: ResetPasswordRequest) => resetPasswordMutation.mutateAsync(values),
    [resetPasswordMutation],
  );

  const isSubmitting = useMemo(
    () =>
      sendOtpMutation.isPending ||
      verifyOtpMutation.isPending ||
      resetPasswordMutation.isPending,
    [
      resetPasswordMutation.isPending,
      sendOtpMutation.isPending,
      verifyOtpMutation.isPending,
    ],
  );

  return {
    step,
    currentStep: forgotPasswordStepIndex[step],
    email,
    resetToken,
    errorMessage,
    isSendingOtp: sendOtpMutation.isPending,
    isVerifyingOtp: verifyOtpMutation.isPending,
    isResettingPassword: resetPasswordMutation.isPending,
    isSubmitting,
    sendOtp,
    resendOtp,
    verifyOtp,
    resetPassword,
  };
};
