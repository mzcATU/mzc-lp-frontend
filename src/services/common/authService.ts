import axiosInstance from './api/axiosInstance';
import { API_ENDPOINTS } from './api/endpoints';
import type {
  LoginRequest,
  RegisterRequest,
  RefreshTokenRequest,
  TokenResponse,
  UserResponse,
} from '@/types/common/auth.types';
/**
 * 인증 관련 API 서비스
 */
export const authService = {
  /**
   * 회원가입
   */
  register: async (request: RegisterRequest): Promise<UserResponse> => {
    const response = await axiosInstance.post<UserResponse>(
      API_ENDPOINTS.AUTH.REGISTER,
      request
    );
    return response.data;
  },

  /**
   * 로그인
   */
  login: async (request: LoginRequest): Promise<TokenResponse> => {
    const response = await axiosInstance.post<TokenResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      request
    );
    return response.data;
  },

  /**
   * 토큰 갱신
   */
  refresh: async (refreshToken: string): Promise<TokenResponse> => {
    const request: RefreshTokenRequest = { refreshToken };
    const response = await axiosInstance.post<TokenResponse>(
      API_ENDPOINTS.AUTH.REFRESH,
      request
    );
    return response.data;
  },

  /**
   * 로그아웃
   */
  logout: async (refreshToken: string): Promise<void> => {
    const request: RefreshTokenRequest = { refreshToken };
    await axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT, request);
  },
};
