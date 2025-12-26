import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/common/authStore';
import type { TenantRole } from '@/types/common/auth.types';

// 개발 모드에서 인증 우회 여부 (환경 변수로 제어)
const DEV_BYPASS_AUTH = import.meta.env.DEV && import.meta.env.VITE_DEV_BYPASS_AUTH === 'true';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: TenantRole[];
  redirectTo?: string;
}

/**
 * 인증된 사용자만 접근 가능한 라우트를 보호하는 컴포넌트
 *
 * @param children - 보호할 자식 컴포넌트
 * @param allowedRoles - 허용된 역할 목록 (비어있으면 모든 인증된 사용자 허용)
 * @param redirectTo - 인증 실패 시 리다이렉트할 경로 (기본: /login)
 */
export function ProtectedRoute({
  children,
  allowedRoles,
  redirectTo = '/login',
}: ProtectedRouteProps) {
  const location = useLocation();
  const { isAuthenticated, user } = useAuthStore();

  // 개발 모드에서 인증 우회
  if (DEV_BYPASS_AUTH) {
    return <>{children}</>;
  }

  // 인증되지 않은 경우
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // 역할 제한이 있고, 사용자 역할이 허용되지 않은 경우
  if (allowedRoles && allowedRoles.length > 0 && user) {
    if (!allowedRoles.includes(user.role)) {
      // 권한이 없으면 403 또는 홈으로 리다이렉트
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <>{children}</>;
}
