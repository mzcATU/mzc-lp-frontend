/**
 * Auth React Query Hooks
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/common/authStore';
import { authService } from '@/services/common/authService';
import { userService } from '@/services/common/userService';
import type { LoginRequest, RegisterRequest } from '@/types/common/auth.types';

// Query Keys
export const authKeys = {
  all: ['auth'] as const,
  me: () => [...authKeys.all, 'me'] as const,
};

/**
 * 현재 사용자 정보 조회 훅
 */
export const useMe = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: authKeys.me(),
    queryFn: () => userService.getMe(),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5분
    retry: false,
  });
};

/**
 * 로그인 뮤테이션 훅
 * 성공 시 사용자 정보를 반환하여 role 기반 리다이렉트가 가능하도록 함
 */
export const useLogin = () => {
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((state) => state.setAuth);
  const setTokens = useAuthStore((state) => state.setTokens);

  return useMutation({
    mutationFn: async (request: LoginRequest) => {
      const tokenData = await authService.login(request);

      // 먼저 토큰을 저장 (이후 getMe 요청 시 토큰이 헤더에 포함됨)
      setTokens(tokenData.accessToken, tokenData.refreshToken);

      // 토큰으로 사용자 정보 조회
      const userDetail = await userService.getMe();
      const user = {
        id: userDetail.userId,
        email: userDetail.email,
        name: userDetail.name,
        role: userDetail.role,
        tenantId: userDetail.tenantId,
      };
      setAuth(user, tokenData.accessToken, tokenData.refreshToken);
      queryClient.invalidateQueries({ queryKey: authKeys.me() });

      // 사용자 정보 반환 (role 기반 리다이렉트를 위해)
      return user;
    },
  });
};

/**
 * 회원가입 뮤테이션 훅
 */
export const useRegister = () => {
  return useMutation({
    mutationFn: (request: RegisterRequest) => authService.register(request),
  });
};

/**
 * 로그아웃 뮤테이션 훅
 */
export const useLogout = () => {
  const queryClient = useQueryClient();
  const logout = useAuthStore((state) => state.logout);
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => {
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      return authService.logout(refreshToken);
    },
    onSuccess: () => {
      logout();
      queryClient.clear();
      navigate('/login');
    },
    onError: () => {
      // 서버 에러가 나더라도 로컬 상태는 초기화
      logout();
      queryClient.clear();
      navigate('/login');
    },
  });
};

/**
 * 토큰 갱신 뮤테이션 훅
 */
export const useRefreshToken = () => {
  const setTokens = useAuthStore((state) => state.setTokens);
  const refreshToken = useAuthStore((state) => state.refreshToken);

  return useMutation({
    mutationFn: () => {
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      return authService.refresh(refreshToken);
    },
    onSuccess: (data) => {
      setTokens(data.accessToken, data.refreshToken);
    },
  });
};
