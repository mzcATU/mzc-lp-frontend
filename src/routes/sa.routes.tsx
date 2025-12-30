import { Route, Outlet } from 'react-router-dom';
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
  TenantsPage,
  TenantDetailPage,
  BillingPage,
  TenantStatusPage,
  DomainSettingsPage,
  OperatorsPage,
  BrandingSettingsPage,
  EmailTemplatesPage,
  NoticesPage,
  NoticeDistributionPage,
  UsagePage,
  ActivityPage,
  LogsPage,
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
    <Route index element={<DashboardPage />} />
    <Route path="dashboard" element={<DashboardPage />} />
    {/* 테넌트 관리 */}
    <Route path="tenants" element={<TenantsPage />} />
    <Route path="tenants/:id" element={<TenantDetailPage />} />
    <Route path="tenants/billing" element={<BillingPage />} />
    <Route path="tenants/status" element={<TenantStatusPage />} />
    {/* 시스템 환경 관리 */}
    <Route path="system/domain" element={<DomainSettingsPage />} />
    <Route path="system/operators" element={<OperatorsPage />} />
    <Route path="system/branding" element={<BrandingSettingsPage />} />
    <Route path="system/email-templates" element={<EmailTemplatesPage />} />
    {/* 글로벌 공지 관리 */}
    <Route path="notices" element={<NoticesPage />} />
    <Route path="notices/distribution" element={<NoticeDistributionPage />} />
    {/* 데이터 및 로그 분석 */}
    <Route path="analytics/usage" element={<UsagePage />} />
    <Route path="analytics/activity" element={<ActivityPage />} />
    <Route path="analytics/logs" element={<LogsPage />} />
    {/* 설정 */}
    <Route path="settings" element={<SettingsPage />} />
    <Route path="settings/security" element={<SettingsSecurityPage />} />
    <Route path="settings/notifications" element={<SettingsNotificationsPage />} />
    <Route path="settings/appearance" element={<SettingsAppearancePage />} />
    <Route path="settings/system-settings" element={<SystemSettingsPage />} />
    <Route path="settings/tenant-defaults" element={<TenantDefaultsPage />} />
  </Route>
);
