import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import {
  MyCoursesPage,
  MyContentPage,
  CourseCreatePage,
  TuContentCreatePage,
  ContentDetailPage,
  SettingsLanguagePage,
} from '@/pages/tu';
import {
  SettingsPage,
  SettingsSecurityPage,
  SettingsNotificationsPage,
  SettingsAppearancePage,
} from '@/pages/common';
import { LoginPage, RegisterPage } from '@/pages/auth';
import ComponentShowcase from '@/pages/ComponentShowcase';
import {
  SuperAdminLayout,
  TenantAdminLayout,
  TenantOperatorLayout,
  TenantUserLayout,
} from '@/components/layout';
import { ProtectedRoute } from '@/components/common';
import { useAuthStore } from '@/store/common/authStore';
import { UserRole } from '@/types/common/auth.types';
import { DashboardPage, PlaceholderPage, LandingPage } from './pages';

// 인증 상태에 따른 리다이렉트 컴포넌트
function AuthRedirect({ children }: Readonly<{ children: React.ReactNode }>) {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user) {
    // 이미 로그인된 경우 역할에 맞는 대시보드로 리다이렉트
    const redirectPath = getDefaultPathByRole(user.role);
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
}

// 역할별 기본 경로 반환
function getDefaultPathByRole(role: string): string {
  switch (role) {
    case UserRole.SuperAdmin:
      return '/sa/dashboard';
    case UserRole.TenantAdmin:
      return '/ta/dashboard';
    case UserRole.TenantOperator:
      return '/to/dashboard';
    case UserRole.TenantUser:
      return '/tu/dashboard';
    default:
      return '/';
  }
}

// 역할별 레이아웃 wrapper 컴포넌트
function SuperAdminWrapper() {
  return (
    <SuperAdminLayout>
      <Outlet />
    </SuperAdminLayout>
  );
}

function TenantAdminWrapper() {
  return (
    <TenantAdminLayout>
      <Outlet />
    </TenantAdminLayout>
  );
}

function TenantOperatorWrapper() {
  return (
    <TenantOperatorLayout>
      <Outlet />
    </TenantOperatorLayout>
  );
}

function TenantUserWrapper() {
  return (
    <TenantUserLayout>
      <Outlet />
    </TenantUserLayout>
  );
}

export function AppRoutes() {
  return (
    <Routes>
      {/* Super Admin (SA) 라우트 */}
      <Route
        path="/sa"
        element={
          <ProtectedRoute allowedRoles={[UserRole.SuperAdmin]}>
            <SuperAdminWrapper />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        {/* 테넌트 관리 */}
        <Route path="tenants" element={<PlaceholderPage title="테넌트 관리" />} />
        <Route path="tenants/billing" element={<PlaceholderPage title="요금제 및 라이선스 관리" />} />
        <Route path="tenants/status" element={<PlaceholderPage title="전체 현황 조회" />} />
        {/* 시스템 환경 관리 */}
        <Route path="system/domain" element={<PlaceholderPage title="도메인 및 SSL 설정" />} />
        <Route path="system/operators" element={<PlaceholderPage title="운영자 관리" />} />
        <Route path="system/branding" element={<PlaceholderPage title="글로벌 브랜딩 설정" />} />
        <Route path="system/email-templates" element={<PlaceholderPage title="이메일 템플릿 관리" />} />
        {/* 글로벌 공지 관리 */}
        <Route path="notices" element={<PlaceholderPage title="공지사항 관리" />} />
        <Route path="notices/distribution" element={<PlaceholderPage title="공지사항 배포 관리" />} />
        {/* 데이터 및 로그 분석 */}
        <Route path="analytics/usage" element={<PlaceholderPage title="사용량 트렌드 및 통계" />} />
        <Route path="analytics/activity" element={<PlaceholderPage title="활동 분석" />} />
        <Route path="analytics/logs" element={<PlaceholderPage title="로그 관리" />} />
        {/* 설정 */}
        <Route path="settings" element={<SettingsPage />} />
        <Route path="settings/security" element={<SettingsSecurityPage />} />
        <Route path="settings/notifications" element={<SettingsNotificationsPage />} />
        <Route path="settings/appearance" element={<SettingsAppearancePage />} />
        <Route path="settings/system-settings" element={<PlaceholderPage title="시스템 설정" />} />
        <Route path="settings/tenant-defaults" element={<PlaceholderPage title="테넌트 기본값" />} />
      </Route>

      {/* Tenant Admin (TA) 라우트 */}
      <Route
        path="/ta"
        element={
          <ProtectedRoute allowedRoles={[UserRole.SuperAdmin, UserRole.TenantAdmin]}>
            <TenantAdminWrapper />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        {/* 시스템 기반 관리 */}
        <Route path="system/domain" element={<PlaceholderPage title="도메인 및 SSL 설정" />} />
        <Route path="system/billing" element={<PlaceholderPage title="요금제 및 라이선스 관리" />} />
        {/* 디자인 및 정책 */}
        <Route path="branding/layout" element={<PlaceholderPage title="레이아웃/UI 설정" />} />
        <Route path="branding/design" element={<PlaceholderPage title="브랜딩 관리" />} />
        <Route path="branding/navigation" element={<PlaceholderPage title="네비게이션 구성 관리" />} />
        {/* 사용자 및 권한 */}
        <Route path="users/operators" element={<PlaceholderPage title="운영자 관리" />} />
        <Route path="users/groups" element={<PlaceholderPage title="사용자 그룹 및 역할 관리" />} />
        <Route path="users/permissions" element={<PlaceholderPage title="접근 권한 설정" />} />
        {/* 데이터 및 통계 */}
        <Route path="analytics/realtime" element={<PlaceholderPage title="실시간 데이터 현황" />} />
        <Route path="analytics/export" element={<PlaceholderPage title="통계 조회 및 내보내기" />} />
        <Route path="analytics/logs" element={<PlaceholderPage title="이력 분석 및 로그 관리" />} />
        {/* 설정 */}
        <Route path="settings" element={<SettingsPage />} />
        <Route path="settings/security" element={<SettingsSecurityPage />} />
        <Route path="settings/notifications" element={<SettingsNotificationsPage />} />
        <Route path="settings/appearance" element={<SettingsAppearancePage />} />
        <Route path="settings/tenant-settings" element={<PlaceholderPage title="테넌트 설정" />} />
        <Route path="settings/user-management" element={<PlaceholderPage title="사용자 관리 설정" />} />
      </Route>

      {/* Tenant Operator (TO) 라우트 */}
      <Route
        path="/to"
        element={
          <ProtectedRoute allowedRoles={[UserRole.SuperAdmin, UserRole.TenantAdmin, UserRole.TenantOperator]}>
            <TenantOperatorWrapper />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        {/* 교육 과정 탐색 */}
        <Route path="courses" element={<PlaceholderPage title="과정 목록" />} />
        <Route path="courses/create" element={<PlaceholderPage title="과정 생성" />} />
        <Route path="courses/:id" element={<PlaceholderPage title="과정 상세" />} />
        {/* 교육 운영 관리 */}
        <Route path="sessions" element={<PlaceholderPage title="차수 관리" />} />
        <Route path="instructors" element={<PlaceholderPage title="강사 배정" />} />
        {/* 콘텐츠 관리 */}
        <Route path="content" element={<PlaceholderPage title="콘텐츠 풀" />} />
        <Route path="content/upload" element={<PlaceholderPage title="콘텐츠 업로드" />} />
        <Route path="learning-objects" element={<PlaceholderPage title="학습 객체 관리" />} />
        {/* 수강 및 강사 정보 */}
        <Route path="sis" element={<PlaceholderPage title="학생 수강 정보 확인" />} />
        <Route path="iis" element={<PlaceholderPage title="강사 배정 정보 확인" />} />
        {/* 설정 */}
        <Route path="settings" element={<SettingsPage />} />
        <Route path="settings/security" element={<SettingsSecurityPage />} />
        <Route path="settings/notifications" element={<SettingsNotificationsPage />} />
        <Route path="settings/appearance" element={<SettingsAppearancePage />} />
        <Route path="settings/content-defaults" element={<PlaceholderPage title="콘텐츠 기본 설정" />} />
      </Route>

      {/* Tenant User (TU) 라우트 */}
      <Route
        path="/tu"
        element={
          <ProtectedRoute>
            <TenantUserWrapper />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        {/* 내 강의 */}
        <Route path="teaching/courses" element={<MyCoursesPage />} />
        <Route path="teaching/courses/create" element={<CourseCreatePage />} />
        <Route path="teaching/content" element={<MyContentPage />} />
        <Route path="teaching/content/create" element={<TuContentCreatePage />} />
        <Route path="teaching/content/:id" element={<ContentDetailPage />} />
        <Route path="teaching/assignments" element={<PlaceholderPage title="내 과제" />} />
        {/* 교육 과정 탐색 */}
        <Route path="catalog" element={<PlaceholderPage title="과정 둘러보기" />} />
        <Route path="learning" element={<PlaceholderPage title="내 학습" />} />
        {/* 성과 및 인증 */}
        <Route path="progress" element={<PlaceholderPage title="학습 진도" />} />
        <Route path="certifications" element={<PlaceholderPage title="인증서" />} />
        {/* 설정 */}
        <Route path="settings" element={<SettingsPage />} />
        <Route path="settings/security" element={<SettingsSecurityPage />} />
        <Route path="settings/notifications" element={<SettingsNotificationsPage />} />
        <Route path="settings/language" element={<SettingsLanguagePage />} />
        <Route path="settings/appearance" element={<SettingsAppearancePage />} />
      </Route>

      {/* 인증 라우트 */}
      <Route
        path="/login"
        element={
          <AuthRedirect>
            <LoginPage />
          </AuthRedirect>
        }
      />
      <Route
        path="/register"
        element={
          <AuthRedirect>
            <RegisterPage />
          </AuthRedirect>
        }
      />

      {/* 기본 경로 - 랜딩 페이지 */}
      <Route path="/" element={<LandingPage />} />

      {/* 컴포넌트 쇼케이스 (개발용) */}
      <Route path="/showcase" element={<ComponentShowcase />} />
    </Routes>
  );
}
