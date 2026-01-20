import { Route, Outlet, Navigate } from 'react-router-dom';
import { SuperAdminLayout } from '@/components/layout';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import {
  SettingsPage,
  SettingsSecurityPage,
  SettingsNotificationsPage,
  SettingsAppearancePage,
} from '@/pages/common';
import {
  DashboardPage,
  TenantManagementPage,
  TenantDetailPage,
  DomainSettingsPage,
  OperatorsPage,
  BrandingSettingsPage,
  NoticesPage,
  AnalyticsPage,
  SystemSettingsPage,
  TenantDefaultsPage,
} from '@/pages/sa';

function SuperAdminWrapper() {
  return (
    <ProtectedRoute allowedRoles={['SYSTEM_ADMIN']}>
      <SuperAdminLayout>
        <Outlet />
      </SuperAdminLayout>
    </ProtectedRoute>
  );
}

export const saRoutes = (
  <Route path="/sa" element={<SuperAdminWrapper />}>
    <Route index element={<Navigate to="/sa/dashboard" replace />} />
    <Route path="dashboard" element={<DashboardPage />} />
    {/* 테넌트 관리 (통합 페이지) */}
    <Route path="tenants" element={<TenantManagementPage />} />
    <Route path="tenants/:id" element={<TenantDetailPage />} />
    {/* 시스템 환경 관리 */}
    <Route path="system/domain" element={<DomainSettingsPage />} />
    <Route path="system/operators" element={<OperatorsPage />} />
    <Route path="system/branding" element={<BrandingSettingsPage />} />
    {/* 글로벌 공지 관리 */}
    <Route path="notices" element={<NoticesPage />} />
    {/* 데이터 및 로그 분석 */}
    <Route path="analytics" element={<AnalyticsPage />} />
    {/* 설정 */}
    <Route path="settings" element={<SettingsPage />} />
    <Route path="settings/security" element={<SettingsSecurityPage />} />
    <Route path="settings/notifications" element={<SettingsNotificationsPage />} />
    <Route path="settings/appearance" element={<SettingsAppearancePage />} />
    <Route path="settings/system-settings" element={<SystemSettingsPage />} />
    <Route path="settings/tenant-defaults" element={<TenantDefaultsPage />} />
  </Route>
);
