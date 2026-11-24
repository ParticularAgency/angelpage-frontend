import axios, { type AxiosError, type AxiosInstance } from 'axios';
import { ToastService } from '@/components/elements/notifications/ToastService';

let authToken: string | null = null;

export const setApiClientToken = (token: string | null) => {
  authToken = token;
};

/**
 * Shared Axios client — prefer this over ad-hoc axios.create calls.
 * Shows toast on API errors unless `silent: true` is set on the request config.
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 30000,
});

apiClient.interceptors.request.use(config => {
  if (authToken) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  response => response,
  (error: AxiosError<{ message?: string }> & { config?: { silent?: boolean } }) => {
    const silent = Boolean(
      (error.config as { silent?: boolean } | undefined)?.silent
    );
    if (!silent && typeof window !== 'undefined') {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Something went wrong. Please try again.';
      ToastService.error(message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
