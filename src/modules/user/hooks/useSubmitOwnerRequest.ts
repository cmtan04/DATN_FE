import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "../api/user.api";
import { currentUserQueryKey } from "./useUpdateCurrentUser";

export const useSubmitOwnerRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => userApi.submitOwnerRequest(),
    onSuccess: (user) => {
      queryClient.setQueryData(currentUserQueryKey, user);
    },
  });
};

