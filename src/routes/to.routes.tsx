import { Route, Outlet } from 'react-router-dom';
import { TenantOperatorLayout } from '@/components/layout';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import {
  SettingsPage,
  SettingsSecurityPage,
  SettingsNotificationsPage,
  SettingsAppearancePage,
} from '@/pages/common';
import {
  CourseTimesPage,
  CourseTimeCreatePage,
  CourseTimeDetailPage,
} from '@/pages/to/time';
import {
  ProgramListPage,
  ProgramPendingPage,
  ProgramDetailPage,
} from '@/pages/to/program';
import { InstructorAssignmentsPage } from '@/pages/to/instructor';
import { UserManagementPage } from '@/pages/to/user';
import { DashboardPage } from '@/pages/to';
import MemberPoolListPage from '@/pages/to/member-pool/MemberPoolListPage';
import AutoEnrollmentRulesPage from '@/pages/to/auto-enrollment/AutoEnrollmentRulesPage';
import { PlaceholderPage } from './pages';

function TenantOperatorWrapper() {
  return (
    <ProtectedRoute allowedRoles={['OPERATOR', 'TENANT_ADMIN']}>
      <TenantOperatorLayout>
        <Outlet />
      </TenantOperatorLayout>
    </ProtectedRoute>
  );
}

export const toRoutes = (
  <Route path="/:subdomain/to" element={<TenantOperatorWrapper />}>
    <Route index element={<DashboardPage />} />
    <Route path="dashboard" element={<DashboardPage />} />
    {/* 교육 과정 탐색 */}
    <Route path="courses" element={<ProgramListPage />} />
    <Route path="courses/pending" element={<ProgramPendingPage />} />
    <Route path="courses/:id" element={<ProgramDetailPage />} />
    {/* 교육 운영 관리 - 차수(CourseTime) */}
    <Route path="times" element={<CourseTimesPage />} />
    <Route path="times/create" element={<CourseTimeCreatePage />} />
    <Route path="times/:id" element={<CourseTimeDetailPage />} />
    {/* 강사 배정 관리 (배정 + 현황 통합) */}
    <Route path="instructors" element={<InstructorAssignmentsPage />} />
    {/* 콘텐츠 관리 */}
    <Route path="content" element={<PlaceholderPage title="콘텐츠 풀" />} />
    <Route path="content/upload" element={<PlaceholderPage title="콘텐츠 업로드" />} />
    <Route path="learning-objects" element={<PlaceholderPage title="학습 객체 관리" />} />
    {/* 사용자 관리 */}
    <Route path="users" element={<UserManagementPage />} />
    {/* 회원 풀 관리 */}
    <Route path="member-pools" element={<MemberPoolListPage />} />
    {/* 자동 입과 규칙 관리 */}
    <Route path="auto-enrollment-rules" element={<AutoEnrollmentRulesPage />} />
    {/* 설정 */}
    <Route path="settings" element={<SettingsPage />} />
    <Route path="settings/security" element={<SettingsSecurityPage />} />
    <Route path="settings/notifications" element={<SettingsNotificationsPage />} />
    <Route path="settings/appearance" element={<SettingsAppearancePage />} />
    <Route path="settings/content-defaults" element={<PlaceholderPage title="콘텐츠 기본 설정" />} />
  </Route>
);
