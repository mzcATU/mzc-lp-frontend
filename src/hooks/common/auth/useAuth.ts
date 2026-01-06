import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/common/authService';
import { userService } from '@/services/common/userService';
import { useAuthStore } from '@/store/common/authStore';
import type { LoginRequest, RegisterRequest, AuthUser } from '@/types/common/auth.types';
import { toast } from 'sonner';

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
      useAuthStore.getState().setTokens(tokenResponse.accessToken, tokenResponse.refreshToken);
      const userDetail = await userService.getMe();
      return { tokenResponse, userDetail };
    },
    onSuccess: ({ tokenResponse, userDetail }) => {
      const user: AuthUser = {
        id: userDetail.userId,
        email: userDetail.email,
        name: userDetail.name,
        role: userDetail.role,
        tenantId: userDetail.tenantId,
      };

      setAuth(user, tokenResponse.accessToken, tokenResponse.refreshToken);
      toast.success(`${user.name}님, 환영합니다!`);

      // 역할별 리다이렉트 경로
      const redirectPath: Record<string, string> = {
        SYSTEM_ADMIN: '/sa',
        TENANT_ADMIN: '/ta',
        OPERATOR: '/to',
        DESIGNER: '/tu/teaching',
        USER: '/tu',
      };
      const targetPath = redirectPath[user.role] || '/';

      // 테넌트 subdomain/customDomain이 있으면 해당 URL로 리다이렉트
      const tenantDomain = userDetail.tenantCustomDomain || userDetail.tenantSubdomain;
      if (tenantDomain && user.role !== 'SYSTEM_ADMIN') {
        // 현재 호스트가 이미 테넌트 도메인인지 확인
        const currentHost = window.location.hostname;
        const isAlreadyOnTenantDomain =
          currentHost === userDetail.tenantCustomDomain ||
          currentHost.startsWith(`${userDetail.tenantSubdomain}.`);

        if (!isAlreadyOnTenantDomain) {
          // 테넌트 도메인으로 리다이렉트 (프로토콜과 포트 유지)
          const protocol = window.location.protocol;
          const port = window.location.port ? `:${window.location.port}` : '';

          // customDomain이 있으면 그대로 사용, 없으면 subdomain.baseDomain 형태로 구성
          let tenantUrl: string;
          if (userDetail.tenantCustomDomain) {
            tenantUrl = `${protocol}//${userDetail.tenantCustomDomain}${port}${targetPath}`;
          } else {
            // 현재 도메인에서 base domain 추출 (localhost의 경우 그대로 사용)
            const baseDomain = currentHost === 'localhost'
              ? 'localhost'
              : currentHost.split('.').slice(-2).join('.');
            tenantUrl = `${protocol}//${userDetail.tenantSubdomain}.${baseDomain}${port}${targetPath}`;
          }

          window.location.href = tenantUrl;
          return;
        }
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
      navigate('/login');
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
      navigate('/login');
    },
    onError: () => {
      // 에러가 발생해도 로컬 상태는 정리
      logout();
      queryClient.clear();
      navigate('/login');
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
