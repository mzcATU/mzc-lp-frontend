import axiosInstance from './axiosInstance';
import type {
  ApiResponse,
  UserDetailResponse,
  UpdateProfileRequest,
  ChangePasswordRequest,
  WithdrawRequest,
} from '@/types/auth.types';

export const userApi = {
  /**
   * 내 정보 조회
   */
  getMe: async (): Promise<UserDetailResponse> => {
    const response = await axiosInstance.get<ApiResponse<UserDetailResponse>>(
      '/users/me'
    );
    return response.data.data;
  },

  /**
   * 내 정보 수정
   */
  updateMe: async (request: UpdateProfileRequest): Promise<UserDetailResponse> => {
    const response = await axiosInstance.put<ApiResponse<UserDetailResponse>>(
      '/users/me',
      request
    );
    return response.data.data;
  },

  /**
   * 비밀번호 변경
   */
  changePassword: async (request: ChangePasswordRequest): Promise<void> => {
    await axiosInstance.put('/users/me/password', request);
  },

  /**
   * 회원 탈퇴
   */
  withdraw: async (request: WithdrawRequest): Promise<void> => {
    await axiosInstance.delete('/users/me', { data: request });
  },
};
