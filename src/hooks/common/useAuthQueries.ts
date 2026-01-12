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
 * 성공 시 role 기반 리다이렉트 수행
 */
export const useLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
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
        tenantSubdomain: userDetail.tenantSubdomain,
      };
      setAuth(user, tokenData.accessToken, tokenData.refreshToken);
      queryClient.invalidateQueries({ queryKey: authKeys.me() });

      return { user, userDetail };
    },
    onSuccess: ({ user, userDetail }) => {
      // 테넌트 subdomain 처리
      const subdomain = userDetail.tenantSubdomain;
      const isDefaultSubdomain = !subdomain || subdomain === 'default' || subdomain === 'www';
      const subdomainPrefix = (!isDefaultSubdomain && user.role !== 'SYSTEM_ADMIN') ? `/${subdomain}` : '';

      // 관리자 역할은 프로필 체크 스킵
      const adminRoles = ['SYSTEM_ADMIN', 'TENANT_ADMIN', 'OPERATOR'];
      const isAdminRole = adminRoles.includes(user.role);

      // 프로필 미완성 시 프로필 수정 페이지로 리다이렉트 (단체 계정 생성 사용자 - 관리자 제외)
      if (!isAdminRole && userDetail.profileCompleted === false) {
        const profileEditPath = `${subdomainPrefix}/tu/b2c/mypage/profile`;
        navigate(profileEditPath, { state: { profileIncomplete: true } });
        return;
      }

      // 역할별 리다이렉트 경로
      const roleBasePath: Record<string, string> = {
        SYSTEM_ADMIN: '/sa',
        TENANT_ADMIN: '/ta',
        OPERATOR: '/co',
        DESIGNER: '/tu/teaching',
        USER: '/tu/b2c',
      };
      const basePath = roleBasePath[user.role] || '/tu/b2c';
      const targetPath = `${subdomainPrefix}${basePath}`;

      navigate(targetPath);
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
