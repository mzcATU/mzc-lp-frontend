import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/store/common/authStore';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 토큰 갱신 중인지 여부
let isRefreshing = false;
// 토큰 갱신 대기 중인 요청들
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve();
    }
  });
  failedQueue = [];
};

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

// Response interceptor: 401 에러 처리 및 토큰 갱신
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // 401 에러가 아니거나 이미 재시도한 요청이면 그대로 에러 반환
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // 로그인/토큰 갱신 요청에서 401이 발생한 경우 로그아웃 처리
    if (
      originalRequest.url?.includes('/auth/login') ||
      originalRequest.url?.includes('/auth/refresh')
    ) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // 이미 토큰 갱신 중이면 대기열에 추가
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(() => {
        return axiosInstance(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const refreshToken = useAuthStore.getState().refreshToken;

    // refreshToken이 없으면 로그아웃
    if (!refreshToken) {
      isRefreshing = false;
      useAuthStore.getState().logout();
      window.location.href = '/login';
      return Promise.reject(error);
    }

    try {
      // 토큰 갱신 요청
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL || '/api'}/auth/refresh`,
        { refreshToken }
      );

      const { accessToken, refreshToken: newRefreshToken, user } = response.data.data;

      // 새 토큰으로 상태 업데이트
      useAuthStore.getState().setAuth({
        accessToken,
        refreshToken: newRefreshToken,
        user,
      });

      // 대기 중인 요청들 처리
      processQueue(null);

      // 원래 요청 재시도
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      // 토큰 갱신 실패 시 로그아웃
      processQueue(refreshError as Error);
      useAuthStore.getState().logout();
      window.location.href = '/login';
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosInstance;
