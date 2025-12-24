import axios from 'axios';
import { useAuthStore } from '@/store/common/authStore';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: 토큰 헤더 추가
axiosInstance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: 에러 처리
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // TODO: 401 에러 시 토큰 갱신 로직 추가
    return Promise.reject(error);
  }
);

export default axiosInstance;
