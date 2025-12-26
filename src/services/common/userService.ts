import axiosInstance from './api/axiosInstance';
import { API_ENDPOINTS } from './api/endpoints';

/**
 * 사용자 프로필 타입
 */
export interface UserProfile {
  id: number;
  email: string;
  name: string;
  role: string;
  tenantId?: number;
  profileImageUrl?: string;
  createdAt: string;
}

/**
 * 프로필 수정 요청 타입
 */
export interface UpdateProfileRequest {
  name?: string;
}

/**
 * 비밀번호 변경 요청 타입
 */
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
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
 * 사용자 서비스
 */
export const userService = {
  /**
   * 내 정보 조회
   */
  getMe: async (): Promise<UserProfile> => {
    const response = await axiosInstance.get<ApiResponse<UserProfile>>(
      API_ENDPOINTS.USERS.ME
    );
    return response.data.data;
  },

  /**
   * 내 정보 수정
   */
  updateMe: async (request: UpdateProfileRequest): Promise<UserProfile> => {
    const response = await axiosInstance.put<ApiResponse<UserProfile>>(
      API_ENDPOINTS.USERS.ME,
      request
    );
    return response.data.data;
  },

  /**
   * 비밀번호 변경
   */
  changePassword: async (request: ChangePasswordRequest): Promise<void> => {
    await axiosInstance.put(API_ENDPOINTS.USERS.ME_PASSWORD, request);
  },

  /**
   * 회원 탈퇴
   */
  withdraw: async (): Promise<void> => {
    await axiosInstance.delete(API_ENDPOINTS.USERS.ME);
  },

  /**
   * 프로필 이미지 업로드
   */
  uploadProfileImage: async (file: File): Promise<{ imageUrl: string }> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axiosInstance.post<ApiResponse<{ imageUrl: string }>>(
      API_ENDPOINTS.USERS.ME_PROFILE_IMAGE,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data;
  },
};

export default userService;
