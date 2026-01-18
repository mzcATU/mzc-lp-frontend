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
  BrandingSettingsPage,
  RealtimePage,
  ExportPage,
  LogsPage,
  TenantSettingsPage,
  UserManagementSettingsPage,
  TenantNoticesPage,
  SystemNoticesPage,
  NoticeInboxPage,
  NoticeDistributionPage,
} from '@/pages/ta';
import { EmployeeListPage } from '@/pages/ta/users/EmployeeListPage';
import { AutoEnrollmentRulesPage } from '@/pages/ta/automation/AutoEnrollmentRulesPage';
import { MemberPoolPage } from '@/pages/ta/automation/MemberPoolPage';
import { DepartmentManagementPage } from '@/pages/ta/users/DepartmentManagementPage';
import { NotificationTemplatesPage } from '@/pages/ta/system/NotificationTemplatesPage';

function TenantAdminWrapper() {
  return (
    <ProtectedRoute allowedRoles={['TENANT_ADMIN']}>
      <TenantAdminLayout>
        <Outlet />
      </TenantAdminLayout>
    </ProtectedRoute>
  );
}

// TA 하위 라우트 (Admin 메뉴)
const taChildRoutes = (
  <>
    <Route index element={<DashboardPage />} />
    <Route path="dashboard" element={<DashboardPage />} />
    {/* 시스템 기반 관리 */}
    <Route path="system/domain" element={<DomainSettingsPage />} />
    <Route path="system/notification-templates" element={<NotificationTemplatesPage />} />
    {/* 브랜딩 설정 (통합) */}
    <Route path="branding" element={<BrandingSettingsPage />} />
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
    {/* 공지사항 관리 */}
    <Route path="notices" element={<NoticeInboxPage />} />
    <Route path="notices/manage" element={<TenantNoticesPage />} />
    <Route path="notices/distribution" element={<NoticeDistributionPage />} />
    <Route path="notices/system" element={<SystemNoticesPage />} />
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
