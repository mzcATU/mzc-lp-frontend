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
  GroupsPage,
  PermissionsPage,
  DomainSettingsPage,
  LayoutSettingsPage,
  RealtimePage,
  ExportPage,
  LogsPage,
  TenantSettingsPage,
  UserManagementSettingsPage,
  FeatureSettingsPage,
  TenantCategoryPage,
  TenantNoticesPage,
} from '@/pages/ta';
import { EmployeeListPage } from '@/pages/ta/users/EmployeeListPage';
import { AutoEnrollmentRulesPage } from '@/pages/ta/automation/AutoEnrollmentRulesPage';
import { MemberPoolPage } from '@/pages/ta/automation/MemberPoolPage';
import { DepartmentManagementPage } from '@/pages/ta/users/DepartmentManagementPage';

function TenantAdminWrapper() {
  return (
    <ProtectedRoute allowedRoles={['TENANT_ADMIN']}>
      <TenantAdminLayout>
        <Outlet />
      </TenantAdminLayout>
    </ProtectedRoute>
  );
}

// TA 하위 라우트
const taChildRoutes = (
  <>
    <Route index element={<DashboardPage />} />
    <Route path="dashboard" element={<DashboardPage />} />
    {/* 시스템 기반 관리 */}
    <Route path="system/domain" element={<DomainSettingsPage />} />
    {/* 디자인 및 정책 */}
    <Route path="branding/layout" element={<LayoutSettingsPage />} />
    {/* 사용자 및 권한 */}
    <Route path="users" element={<UsersPage />} />
    <Route path="users/:id" element={<UserDetailPage />} />
    <Route path="users/groups" element={<GroupsPage />} />
    <Route path="users/permissions" element={<PermissionsPage />} />
    <Route path="users/employees" element={<EmployeeListPage />} />
    <Route path="users/departments" element={<DepartmentManagementPage />} />
    {/* 자동화 */}
    <Route path="automation/rules" element={<AutoEnrollmentRulesPage />} />
    <Route path="automation/pools" element={<MemberPoolPage />} />
    {/* 데이터 및 통계 */}
    <Route path="analytics/realtime" element={<RealtimePage />} />
    <Route path="analytics/export" element={<ExportPage />} />
    <Route path="analytics/logs" element={<LogsPage />} />
    {/* 기능 설정 */}
    <Route path="features" element={<FeatureSettingsPage />} />
    <Route path="features/categories" element={<TenantCategoryPage />} />
    {/* 공지사항 관리 */}
    <Route path="notices" element={<TenantNoticesPage />} />
    {/* 설정 */}
    <Route path="settings" element={<SettingsPage />} />
    <Route path="settings/security" element={<SettingsSecurityPage />} />
    <Route path="settings/notifications" element={<SettingsNotificationsPage />} />
    <Route path="settings/appearance" element={<SettingsAppearancePage />} />
    <Route path="settings/tenant-settings" element={<TenantSettingsPage />} />
    <Route path="settings/user-management" element={<UserManagementSettingsPage />} />
  </>
);

export const taRoutes = (
  <>
    {/* 기본 테넌트용 (subdomain 없음) */}
    <Route path="/ta" element={<TenantAdminWrapper />}>
      {taChildRoutes}
    </Route>
    {/* 특정 테넌트용 (subdomain 있음) */}
    <Route path="/:subdomain/ta" element={<TenantAdminWrapper />}>
      {taChildRoutes}
    </Route>
  </>
);
