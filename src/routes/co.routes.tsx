import { Route, Outlet } from 'react-router-dom';
import { CourseOperatorLayout } from '@/components/layout';
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
} from '@/pages/co/time';
import {
  CourseListPage,
  CoursePendingPage,
  CourseDetailPage,
} from '@/pages/co/course';
import { InstructorAssignmentsPage } from '@/pages/co/instructor';
import { UserManagementPage } from '@/pages/co/user';
import { OperatorNoticesPage, OperatorNoticeInboxPage } from '@/pages/co/notices';
import { DashboardPage } from '@/pages/co';
import MemberPoolListPage from '@/pages/co/member-pool/MemberPoolListPage';
import AutoEnrollmentRulesPage from '@/pages/co/auto-enrollment/AutoEnrollmentRulesPage';
import { PlaceholderPage } from './pages';

function CourseOperatorWrapper() {
  return (
    <ProtectedRoute allowedRoles={['OPERATOR', 'TENANT_ADMIN']}>
      <CourseOperatorLayout>
        <Outlet />
      </CourseOperatorLayout>
    </ProtectedRoute>
  );
}

// CO 하위 라우트
const coChildRoutes = (
  <>
    <Route index element={<DashboardPage />} />
    <Route path="dashboard" element={<DashboardPage />} />
    {/* 교육 과정 탐색 */}
    <Route path="courses" element={<CourseListPage />} />
    <Route path="courses/pending" element={<CoursePendingPage />} />
    <Route path="courses/:id" element={<CourseDetailPage />} />
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
    {/* 공지사항 관리 */}
    <Route path="notices" element={<OperatorNoticeInboxPage />} />
    <Route path="notices/manage" element={<OperatorNoticesPage />} />
    {/* 설정 */}
    <Route path="settings" element={<SettingsPage />} />
    <Route path="settings/security" element={<SettingsSecurityPage />} />
    <Route path="settings/notifications" element={<SettingsNotificationsPage />} />
    <Route path="settings/appearance" element={<SettingsAppearancePage />} />
    <Route path="settings/content-defaults" element={<PlaceholderPage title="콘텐츠 기본 설정" />} />
  </>
);

export const coRoutes = (
  <>
    {/* 기본 테넌트용 (subdomain 없음) */}
    <Route path="/co" element={<CourseOperatorWrapper />}>
      {coChildRoutes}
    </Route>
    {/* 특정 테넌트용 (subdomain 있음) */}
    <Route path="/:subdomain/co" element={<CourseOperatorWrapper />}>
      {coChildRoutes}
    </Route>
  </>
);
