import { Route, Outlet } from 'react-router-dom';
import { TenantUserLayout } from '@/components/layout';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import {
  MyCoursesPage,
  MyContentPage,
  CourseCreatePage,
  TuContentCreatePage,
  ContentDetailPage,
  MyAssignmentsPage,
  AssignmentDetailPage,
} from '@/pages/tu';
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
    <Route path="teaching/assignments" element={<MyAssignmentsPage />} />
    <Route path="teaching/assignments/:id" element={<AssignmentDetailPage />} />

    {/* 교육 과정 탐색 */}
    <Route path="catalog" element={<PlaceholderPage title="과정 둘러보기" />} />
  </Route>
);