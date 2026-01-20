import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/common/authService';
import { userService } from '@/services/common/userService';
import { useAuthStore } from '@/store/common/authStore';
import type { LoginRequest, RegisterRequest, AuthUser } from '@/types/common/auth.types';
import { toast } from 'sonner';
import { getLoginPath } from '@/utils/tenantUtils';

// Query Keys
export const authKeys = {
  all: ['auth'] as const,
  me: () => [...authKeys.all, 'me'] as const,
};

/**
 * 로그인 mutation
 */
export const useLogin = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  return useMutation({
    mutationFn: async (request: LoginRequest) => {
      const tokenResponse = await authService.login(request);
      // 로그인 후 사용자 정보 조회를 위해 임시로 토큰 저장
      useAuthStore.getState().setTokens(
        tokenResponse.accessToken,
        tokenResponse.refreshToken,
        tokenResponse.expiresIn
      );
      const userDetail = await userService.getMe();
      return { tokenResponse, userDetail };
    },
    onSuccess: ({ tokenResponse, userDetail }) => {
      const user: AuthUser = {
        id: userDetail.userId,
        email: userDetail.email,
        name: userDetail.name,
        role: userDetail.role,
        roles: userDetail.roles,
        tenantId: userDetail.tenantId,
        tenantSubdomain: userDetail.tenantSubdomain,
      };

      setAuth(user, tokenResponse.accessToken, tokenResponse.refreshToken, tokenResponse.expiresIn);
      toast.success(`${user.name}님, 환영합니다!`);

      // 역할별 리다이렉트 경로 (각 역할별 대시보드로 이동)
      const roleBasePath: Record<string, string> = {
        SYSTEM_ADMIN: '/sa/dashboard',
        TENANT_ADMIN: '/ta/dashboard',
        OPERATOR: '/co/dashboard',
        DESIGNER: '/tu/teaching',
        USER: '/tu/b2c',
      };
      const basePath = roleBasePath[user.role] || '/tu/b2c';

      // 테넌트 subdomain이 있으면 경로에 포함 (SA 제외, default는 생략)
      let targetPath = basePath;
      const subdomain = userDetail.tenantSubdomain;
      const isDefaultSubdomain = !subdomain || subdomain === 'default' || subdomain === 'www';

      if (!isDefaultSubdomain && user.role !== 'SYSTEM_ADMIN') {
        targetPath = `/${subdomain}${basePath}`;
      }

      navigate(targetPath);
    },
    onError: (error: Error) => {
      toast.error('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
      console.error('Login error:', error);
    },
  });
};

/**
 * 회원가입 mutation
 */
export const useRegister = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (request: RegisterRequest) => authService.register(request),
    onSuccess: () => {
      toast.success('회원가입이 완료되었습니다. 로그인해주세요.');
      navigate(getLoginPath());
    },
    onError: (error: Error) => {
      toast.error('회원가입에 실패했습니다. 다시 시도해주세요.');
      console.error('Register error:', error);
    },
  });
};

/**
 * 로그아웃 mutation
 */
export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { refreshToken, logout } = useAuthStore();
  // 로그아웃 전에 현재 서브도메인 경로 저장
  const loginPath = getLoginPath();

  return useMutation({
    mutationFn: async () => {
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
    },
    onSuccess: () => {
      logout();
      queryClient.clear();
      toast.success('로그아웃되었습니다.');
      navigate(loginPath);
    },
    onError: () => {
      // 에러가 발생해도 로컬 상태는 정리
      logout();
      queryClient.clear();
      navigate(loginPath);
    },
  });
};

/**
 * 현재 사용자 정보 조회
 */
export const useMe = () => {
  const { isAuthenticated, updateUser } = useAuthStore();

  return useQuery({
    queryKey: authKeys.me(),
    queryFn: async () => {
      const userDetail = await userService.getMe();
      // 스토어 동기화
      updateUser({
        id: userDetail.userId,
        email: userDetail.email,
        name: userDetail.name,
        role: userDetail.role,
        roles: userDetail.roles,  // 다중 역할 (1:N) 동기화
        tenantId: userDetail.tenantId,
      });
      return userDetail;
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5분
  });
};

/**
 * 인증 상태 및 유틸리티 훅
 */
export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    accessToken,
    hasRole,
    hasAnyRole,
  } = useAuthStore();

  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const logoutMutation = useLogout();

  return {
    user,
    isAuthenticated,
    accessToken,
    hasRole,
    hasAnyRole,

    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,

    register: registerMutation.mutate,
    registerAsync: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,

    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
  };
};
