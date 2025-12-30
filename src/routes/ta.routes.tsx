import { Route, Outlet } from 'react-router-dom';
import { TenantAdminLayout } from '@/components/layout';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import {
  SettingsPage,
  SettingsSecurityPage,
  SettingsNotificationsPage,
  SettingsAppearancePage,
} from '@/pages/common';
import {
  DashboardPage,
  UsersPage,
  UserDetailPage,
  OperatorsPage,
  GroupsPage,
  PermissionsPage,
  DomainSettingsPage,
  BillingPage,
  LayoutSettingsPage,
  DesignSettingsPage,
  NavigationSettingsPage,
  RealtimePage,
  ExportPage,
  LogsPage,
  TenantSettingsPage,
  UserManagementSettingsPage,
} from '@/pages/ta';

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
    <Route path="system/domain" element={<DomainSettingsPage />} />
    <Route path="system/billing" element={<BillingPage />} />
    {/* 디자인 및 정책 */}
    <Route path="branding/layout" element={<LayoutSettingsPage />} />
    <Route path="branding/design" element={<DesignSettingsPage />} />
    <Route path="branding/navigation" element={<NavigationSettingsPage />} />
    {/* 사용자 및 권한 */}
    <Route path="users" element={<UsersPage />} />
    <Route path="users/:id" element={<UserDetailPage />} />
    <Route path="users/operators" element={<OperatorsPage />} />
    <Route path="users/groups" element={<GroupsPage />} />
    <Route path="users/permissions" element={<PermissionsPage />} />
    {/* 데이터 및 통계 */}
    <Route path="analytics/realtime" element={<RealtimePage />} />
    <Route path="analytics/export" element={<ExportPage />} />
    <Route path="analytics/logs" element={<LogsPage />} />
    {/* 설정 */}
    <Route path="settings" element={<SettingsPage />} />
    <Route path="settings/security" element={<SettingsSecurityPage />} />
    <Route path="settings/notifications" element={<SettingsNotificationsPage />} />
    <Route path="settings/appearance" element={<SettingsAppearancePage />} />
    <Route path="settings/tenant-settings" element={<TenantSettingsPage />} />
    <Route path="settings/user-management" element={<UserManagementSettingsPage />} />
  </Route>
);
