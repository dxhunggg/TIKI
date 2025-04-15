import { useMutation } from "@tanstack/react-query";

export const useMutationHooks = (fnCallback) => {
  const mutation = useMutation({
    mutationFn: fnCallback,
    onError: (error) => {
    },
    onSuccess: (data) => {
    }
  });
  return mutation;
};
