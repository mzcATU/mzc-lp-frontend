import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/common/authStore';
import type { UserRole } from '@/types/common/auth.types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

/**
 * 인증된 사용자만 접근 가능한 라우트 래퍼 컴포넌트
 * @param children - 보호할 컴포넌트
 * @param allowedRoles - 허용된 역할 목록 (미지정 시 인증만 확인)
 * @param redirectTo - 인증 실패 시 리다이렉트 경로
 */
export function ProtectedRoute({
  children,
  allowedRoles,
  redirectTo = '/login',
}: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  // 인증되지 않은 경우 로그인 페이지로 리다이렉트
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // 역할 기반 접근 제어
  if (allowedRoles && allowedRoles.length > 0 && user) {
    const hasAllowedRole = allowedRoles.includes(user.role);
    if (!hasAllowedRole) {
      // 권한이 없는 경우 역할에 맞는 기본 경로로 리다이렉트
      const defaultPath = getDefaultPathByRole(user.role);
      return <Navigate to={defaultPath} replace />;
    }
  }

  return <>{children}</>;
}

/**
 * 역할별 기본 경로 반환
 */
function getDefaultPathByRole(role: UserRole | string): string {
  switch (role) {
    case 'SUPER_ADMIN':
      return '/sa/dashboard';
    case 'TENANT_ADMIN':
      return '/ta/dashboard';
    case 'TENANT_OPERATOR':
      return '/to/dashboard';
    case 'TENANT_USER':
      return '/tu/dashboard';
    default:
      return '/';
  }
}

export default ProtectedRoute;
