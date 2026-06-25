import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "../api/user.api";
import type { UpdateCurrentUserPayload, ChangePasswordPayload } from "../type";
import { App } from "antd";

export const currentUserQueryKey = ["auth", "current-user"] as const;

export const useUpdateCurrentUser = () => {
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  const updateCurrentUserQuery = useMutation({
    mutationFn: (payload: UpdateCurrentUserPayload) =>
      userApi.updateCurrentUser(payload),
    onSuccess: (user) => {
      queryClient.setQueryData(currentUserQueryKey, user);
      message.success("Cập nhật thông tin thành công.");
    },
    onError: (error) => {
      message.error(
        error instanceof Error
          ? error.message
          : "Đã có lỗi xảy ra khi cập nhật thông tin.",
      );
    },
  });

  const changePasswordQuery = useMutation({
    mutationFn: (payload: ChangePasswordPayload) =>
      userApi.changePassword(payload),
    onSuccess: () => {
      message.success("Đổi mật khẩu thành công.");
    },
    onError: (error) => {
      message.error(
        error instanceof Error
          ? error.message
          : "Đã có lỗi xảy ra khi đổi mật khẩu.",
      );
    },
  });

  const updateCurrentUser = async (payload: UpdateCurrentUserPayload) => {
    await updateCurrentUserQuery.mutateAsync(payload);
  };

  const changePassword = async (payload: ChangePasswordPayload) => {
    await changePasswordQuery.mutateAsync(payload);
  };

  return { updateCurrentUser, changePassword };
};
