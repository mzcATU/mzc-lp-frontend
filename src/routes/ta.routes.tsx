import { Route, Outlet } from 'react-router-dom';
import { TenantAdminLayout } from '@/components/layout';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import {
  SettingsPage,
  SettingsSecurityPage,
  SettingsNotificationsPage,
  SettingsAppearancePage,
} from '@/pages/common';
import { BrandingPage } from '@/pages/ta';
import { DashboardPage, PlaceholderPage } from './pages';
import { UsersPage } from '@/pages/ta';

function TenantAdminWrapper() {
  return (
    <ProtectedRoute allowedRoles={['TENANT_ADMIN']}>
      <TenantAdminLayout>
        <Outlet />
      </TenantAdminLayout>
    </ProtectedRoute>
  );
}

export const taRoutes = (
  <Route path="/ta" element={<TenantAdminWrapper />}>
    <Route index element={<DashboardPage />} />
    <Route path="dashboard" element={<DashboardPage />} />
    {/* 시스템 기반 관리 */}
    <Route path="system/domain" element={<PlaceholderPage title="도메인 및 SSL 설정" />} />
    <Route path="system/billing" element={<PlaceholderPage title="요금제 및 라이선스 관리" />} />
    {/* 디자인 및 정책 */}
    <Route path="branding/layout" element={<PlaceholderPage title="레이아웃/UI 설정" />} />
    <Route path="branding/design" element={<BrandingPage />} />
    <Route path="branding/navigation" element={<PlaceholderPage title="네비게이션 구성 관리" />} />
    {/* 사용자 및 권한 */}
    <Route path="users" element={<UsersPage />} />
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
);
