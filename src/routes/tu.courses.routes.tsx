import { Route, Outlet } from 'react-router-dom';
import { TenantUserLayout } from '@/components/layout';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
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
import { DashboardPage, PlaceholderPage } from './pages';

function TenantUserWrapper() {
  return (
    <ProtectedRoute allowedRoles={['USER', 'DESIGNER', 'OPERATOR', 'TENANT_ADMIN']}>
      <TenantUserLayout>
        <Outlet />
      </TenantUserLayout>
    </ProtectedRoute>
  );
}

export const tuCoursesRoutes = (
  <Route path="/tu" element={<TenantUserWrapper />}>
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
);
