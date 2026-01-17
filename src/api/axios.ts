import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

// Base URL - Backend API URL'inizi buraya yazın
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5027/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Redirect flag to prevent multiple redirects
let isRedirecting = false;

// Request Interceptor - JWT Token'ı her isteğe ekle
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// Response Interceptor - Token süresinin dolması durumunda
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401 && !isRedirecting) {
      // Token geçersiz veya süresi dolmuş
      isRedirecting = true;

      // Tüm auth verilerini temizle
      localStorage.removeItem("token");
      localStorage.removeItem("auth-storage");

      // Login sayfasına yönlendir
      window.location.href = "/login";

      // Yönlendirme tamamlandıktan sonra flag'i sıfırla
      setTimeout(() => {
        isRedirecting = false;
      }, 1000);
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
