import axiosInstance from './api/axiosInstance';
import { API_ENDPOINTS } from './api/endpoints';
import type {
  UserDetailResponse,
  ChangePasswordRequest,
  UpdateProfileRequest,
} from '@/types/common/auth.types';
/**
 * 사용자 관련 API 서비스
 */
export const userService = {
  /**
   * 내 정보 조회
   */
  getMe: async (): Promise<UserDetailResponse> => {
    const response = await axiosInstance.get<UserDetailResponse>(
      API_ENDPOINTS.USERS.ME
    );
    return response.data;
  },

  /**
   * 프로필 수정
   */
  updateProfile: async (request: UpdateProfileRequest): Promise<UserDetailResponse> => {
    const response = await axiosInstance.put<UserDetailResponse>(
      API_ENDPOINTS.USERS.ME,
      request
    );
    return response.data;
  },

  /**
   * 비밀번호 변경
   */
  changePassword: async (request: ChangePasswordRequest): Promise<void> => {
    await axiosInstance.put(API_ENDPOINTS.USERS.ME_PASSWORD, request);
  },

  /**
   * 프로필 이미지 업로드
   */
  uploadProfileImage: async (file: File): Promise<{ profileImageUrl: string }> => {
    const formData = new FormData();
    formData.append('file', file);

    // FormData 전송 시 headers를 생략하여 브라우저가 boundary 포함한 Content-Type 자동 설정
    const response = await axiosInstance.postForm<{ profileImageUrl: string }>(
      API_ENDPOINTS.USERS.ME_PROFILE_IMAGE,
      formData
    );
    return response.data;
  },

  /**
   * 회원 탈퇴
   */
  withdraw: async (password: string): Promise<void> => {
    await axiosInstance.delete(API_ENDPOINTS.USERS.ME, {
      data: { password },
    });
  },

  /**
   * 과정 설계자 역할 신청
   */
  applyDesignerRole: async (): Promise<void> => {
    await axiosInstance.post(API_ENDPOINTS.USERS.ME_COURSE_ROLES_DESIGNER);
  },

  /**
   * 내 과정 역할 조회
   */
  getMyCourseRoles: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.USERS.ME_COURSE_ROLES);
    return response.data;
  },
};

// Re-export types for convenience
export type { UpdateProfileRequest, ChangePasswordRequest } from '@/types/common/auth.types';
