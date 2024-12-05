import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/helper/axios/axiosInstance";

export const usePostMutation = (url: string, options = {}) => {
  return useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await axiosInstance.post(url, payload);
      return data;
    },
    ...options,
  });
};