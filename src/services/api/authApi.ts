import axiosInstance from './axiosInstance';
import type {
  ApiResponse,
  LoginRequest,
  RegisterRequest,
  RefreshTokenRequest,
  TokenResponse,
  UserResponse,
} from '@/types/auth.types';

export const authApi = {
  /**
   * 회원가입
   */
  register: async (request: RegisterRequest): Promise<UserResponse> => {
    const response = await axiosInstance.post<ApiResponse<UserResponse>>(
      '/auth/register',
      request
    );
    return response.data.data;
  },

  /**
   * 로그인
   */
  login: async (request: LoginRequest): Promise<TokenResponse> => {
    const response = await axiosInstance.post<ApiResponse<TokenResponse>>(
      '/auth/login',
      request
    );
    return response.data.data;
  },

  /**
   * 토큰 갱신
   */
  refresh: async (request: RefreshTokenRequest): Promise<TokenResponse> => {
    const response = await axiosInstance.post<ApiResponse<TokenResponse>>(
      '/auth/refresh',
      request
    );
    return response.data.data;
  },

  /**
   * 로그아웃
   */
  logout: async (refreshToken: string): Promise<void> => {
    await axiosInstance.post('/auth/logout', { refreshToken });
  },
};
