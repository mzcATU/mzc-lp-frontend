/**
 * User React Query Hooks
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/common/authStore';
import {
  userService,
  type UpdateProfileRequest,
  type ChangePasswordRequest,
} from '@/services/common/userService';

// Query Keys
export const userKeys = {
  all: ['users'] as const,
  me: () => [...userKeys.all, 'me'] as const,
};

/**
 * 내 정보 조회 훅
 */
export const useMyProfile = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: userKeys.me(),
    queryFn: () => userService.getMe(),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5분
  });
};

/**
 * 프로필 수정 뮤테이션 훅
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UpdateProfileRequest) => userService.updateMe(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.me() });
    },
  });
};

/**
 * 비밀번호 변경 뮤테이션 훅
 */
export const useChangePassword = () => {
  return useMutation({
    mutationFn: (request: ChangePasswordRequest) => userService.changePassword(request),
  });
};

/**
 * 회원 탈퇴 뮤테이션 훅
 */
export const useWithdraw = () => {
  const logout = useAuthStore((state) => state.logout);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => userService.withdraw(),
    onSuccess: () => {
      logout();
      queryClient.clear();
    },
  });
};

/**
 * 프로필 이미지 업로드 뮤테이션 훅
 */
export const useUploadProfileImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => userService.uploadProfileImage(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.me() });
    },
  });
};
