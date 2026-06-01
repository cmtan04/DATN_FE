import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "../api/user.api";
import type { UpdateCurrentUserPayload } from "../type";

export const currentUserQueryKey = ["auth", "current-user"] as const;

export const useUpdateCurrentUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateCurrentUserPayload) =>
      userApi.updateCurrentUser(payload),
    onSuccess: (user) => {
      queryClient.setQueryData(currentUserQueryKey, user);
    },
  });
};
