import { Route, Outlet, Navigate } from 'react-router-dom';
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
  UserDetailPage,
  GroupsPage,
  PermissionsPage,
  DomainSettingsPage,
  BrandingSettingsPage,
  DataAnalyticsPage,
  TenantSettingsPage,
  UserManagementSettingsPage,
  NoticeAndNotificationPage,
} from '@/pages/ta';
import { UserAndDepartmentPage } from '@/pages/ta/users/UserAndDepartmentPage';
import { EmployeeListPage } from '@/pages/ta/users/EmployeeListPage';
import { AutoEnrollmentRulesPage } from '@/pages/ta/automation/AutoEnrollmentRulesPage';
import { MemberPoolPage } from '@/pages/ta/automation/MemberPoolPage';

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
    <Route index element={<Navigate to="dashboard" replace />} />
    <Route path="dashboard" element={<DashboardPage />} />
    {/* 시스템 기반 관리 */}
    <Route path="system/domain" element={<DomainSettingsPage />} />
    {/* 브랜딩 설정 (통합) */}
    <Route path="branding" element={<BrandingSettingsPage />} />
    {/* 사용자 및 부서 관리 (통합 페이지) */}
    <Route path="users" element={<UserAndDepartmentPage />} />
    <Route path="users/:id" element={<UserDetailPage />} />
    <Route path="users/groups" element={<GroupsPage />} />
    <Route path="users/permissions" element={<PermissionsPage />} />
    <Route path="users/employees" element={<EmployeeListPage />} />
    {/* 자동화 */}
    <Route path="automation/rules" element={<AutoEnrollmentRulesPage />} />
    <Route path="automation/pools" element={<MemberPoolPage />} />
    {/* 데이터 및 통계 */}
    <Route path="analytics" element={<DataAnalyticsPage />} />
    {/* 공지 및 알림 관리 (통합 페이지) */}
    <Route path="notices" element={<NoticeAndNotificationPage />} />
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
