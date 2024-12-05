import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/helper/axios/axiosInstance";

// Simplified hook for GET requests
export const useGetQuery = (queryKey: string[], url: string, options = {}) => {
  return useQuery(
    queryKey,
    async () => {
      const response = await axiosInstance.get(url);
      return response.data;
    },
    options
  );
};