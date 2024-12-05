import axios from "axios";
import { AUTH_KEY } from "@/constant/storage.key";
import { removeFromLocalStorage } from "@/utils/local-storage";
import { getBaseUrl } from "../config/envConfig";

const axiosInstance = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 60000,
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const bearerToken = localStorage.getItem(AUTH_KEY);
    if (bearerToken?.startsWith("Bearer ")) {
      config.headers.Authorization = bearerToken;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error?.config;
    if (error?.response?.status === 403 && !config?.sent) {
      config.sent = true;
      const newAccessToken = await getNewAccessToken();
      if (newAccessToken) {
        config.headers.Authorization = `Bearer ${newAccessToken}`;
        storeToken({ accessToken: newAccessToken });
        return axiosInstance(config);
      }
    } else if (
      error?.response?.status === 403 ||
      error?.response?.status === 401
    ) {
      removeFromLocalStorage(AUTH_KEY);
    }

    const responseObject = {
      statusCode: error?.response?.status || 500,
      message: error?.response?.data?.message || "Something went wrong",
      success: error?.response?.data?.success || false,
      errorMessages: Array.isArray(error?.response?.data?.errorMessage)
        ? error?.response?.data?.errorMessage
        : [error?.response?.data?.errorMessage || "Unknown error"],
    };
    return Promise.reject(responseObject);
  }
);

function storeToken({ accessToken }: { accessToken: string }) {
  localStorage.setItem(AUTH_KEY, `Bearer ${accessToken}`);
}

async function getNewAccessToken(): Promise<string | null> {
  // Implement token refresh logic here.
  return null;
}

export default axiosInstance;