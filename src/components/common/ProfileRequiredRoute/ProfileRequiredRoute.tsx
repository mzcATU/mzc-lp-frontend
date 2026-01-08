import { Navigate, useLocation, useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useMyProfile } from '@/hooks/common';
import { useAuthStore } from '@/store/common/authStore';
import { designTokens } from '@/styles/admin-design-tokens';

interface ProfileRequiredRouteProps {
  children: React.ReactNode;
  /**
   * 프로필 필수 항목 검사 비활성화 (기본: false)
   * true로 설정하면 프로필 검사 없이 통과
   */
  skipProfileCheck?: boolean;
}

// 프로필 체크를 스킵해야 하는 관리자 역할
const ADMIN_ROLES = new Set(['SYSTEM_ADMIN', 'TENANT_ADMIN', 'TENANT_OPERATOR']);

/**
 * 프로필 정보(부서, 직급)가 완료된 사용자만 접근 가능한 라우트
 * 미완료 시 /profile-setup으로 리다이렉트
 * 관리자 역할(SA, TA, TO)은 프로필 체크 스킵
 */
export function ProfileRequiredRoute({
  children,
  skipProfileCheck = false,
}: ProfileRequiredRouteProps) {
  const location = useLocation();
  const { subdomain } = useParams<{ subdomain?: string }>();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const { data: profile, isLoading } = useMyProfile();

  // 인증되지 않은 경우 프로필 체크 스킵
  if (!isAuthenticated) {
    return <>{children}</>;
  }

  // 프로필 체크 스킵 옵션
  if (skipProfileCheck) {
    return <>{children}</>;
  }

  // 관리자 역할은 프로필 체크 스킵
  if (user?.role && ADMIN_ROLES.has(user.role)) {
    return <>{children}</>;
  }

  // 프로필 로딩 중
  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        style={{ backgroundColor: designTokens.bg.app_default }}
      >
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: designTokens.text.secondary }} />
      </div>
    );
  }

  // 프로필 미완료 체크 (profileCompleted 플래그만 확인)
  // 백엔드에서 이름, 부서, 직급을 종합적으로 판단하여 플래그 설정
  const isProfileIncomplete = profile?.profileCompleted === false;

  if (isProfileIncomplete) {
    // 서브도메인이 있으면 포함하여 리다이렉트
    const profileSetupPath = subdomain ? `/${subdomain}/profile-setup` : '/profile-setup';
    return (
      <Navigate
        to={profileSetupPath}
        state={{ returnTo: location.pathname }}
        replace
      />
    );
  }

  return <>{children}</>;
}
