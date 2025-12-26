import axiosInstance from './api/axiosInstance';
import { API_ENDPOINTS } from './api/endpoints';
import type { LoginRequest, LoginResponse, AuthUser } from '@/types/common/auth.types';

/**
 * 회원가입 요청 타입
 */
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

/**
 * API 응답 래퍼 타입
 */
interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: {
    code: string;
    message: string;
  };
}

/**
 * 인증 서비스
 */
export const authService = {
  /**
   * 로그인
   */
  login: async (request: LoginRequest): Promise<LoginResponse> => {
    const response = await axiosInstance.post<ApiResponse<LoginResponse>>(
      API_ENDPOINTS.AUTH.LOGIN,
      request
    );
    return response.data.data;
  },

  /**
   * 회원가입
   */
  register: async (request: RegisterRequest): Promise<void> => {
    await axiosInstance.post<ApiResponse<void>>('/auth/register', request);
  },

  /**
   * 로그아웃
   */
  logout: async (): Promise<void> => {
    await axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT);
  },

  /**
   * 토큰 갱신
   */
  refresh: async (refreshToken: string): Promise<LoginResponse> => {
    const response = await axiosInstance.post<ApiResponse<LoginResponse>>(
      API_ENDPOINTS.AUTH.REFRESH,
      { refreshToken }
    );
    return response.data.data;
  },

  /**
   * 현재 사용자 정보 조회
   */
  getMe: async (): Promise<AuthUser> => {
    const response = await axiosInstance.get<ApiResponse<AuthUser>>(API_ENDPOINTS.AUTH.ME);
    return response.data.data;
  },
};

export default authService;
