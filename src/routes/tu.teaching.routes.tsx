import { Route, Outlet } from 'react-router-dom';
import { TenantUserLayout } from '@/components/layout';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { ProfileRequiredRoute } from '@/components/common/ProfileRequiredRoute';
import {
  MyCoursesPage,
  MyContentPage,
  CourseCreatePage,
  CourseEditPage,
  TeachingCourseDetailPage,
  CourseApplyPage,
  TuContentCreatePage,
  ContentDetailPage,
  MyAssignmentsPage,
  AssignmentDetailPage,
  MyProgramsPage,
  TuProgramDetailPage,
  TuProgramEditPage,
  RoadmapListPage,
  RoadmapCreatePage,
  TeachingRoadmapDetailPage,
  TUDashboardPage,
} from '@/pages/tu';
import { PlaceholderPage } from './pages';

function TenantUserWrapper() {
  return (
    <ProtectedRoute allowedRoles={['USER', 'DESIGNER', 'OPERATOR', 'TENANT_ADMIN']}>
      <ProfileRequiredRoute>
        <TenantUserLayout>
          <Outlet />
        </TenantUserLayout>
      </ProfileRequiredRoute>
    </ProtectedRoute>
  );
}

/**
 * TU Teaching 라우트 - 강의 관리 (사이드바 있음)
 *
 * 경로: /:subdomain/tu/teaching/* 또는 /tu/teaching/*
 * - 내 강의 관리, 콘텐츠 관리, 과제 관리
 */
export const tuTeachingRoutes = (
  <>
  <Route path="/:subdomain/tu" element={<TenantUserWrapper />}>
    <Route index element={<TUDashboardPage />} />
    <Route path="dashboard" element={<TUDashboardPage />} />
    <Route path="teaching/courses" element={<MyCoursesPage />} />
    <Route path="teaching/courses/create" element={<CourseCreatePage />} />
    <Route path="teaching/courses/:courseId" element={<TeachingCourseDetailPage />} />
    <Route path="teaching/courses/:courseId/edit" element={<CourseEditPage />} />
    <Route path="teaching/courses/:courseId/apply" element={<CourseApplyPage />} />
    <Route path="teaching/programs" element={<MyProgramsPage />} />
    <Route path="teaching/programs/:programId" element={<TuProgramDetailPage />} />
    <Route path="teaching/programs/:programId/edit" element={<TuProgramEditPage />} />
    <Route path="teaching/content" element={<MyContentPage />} />
    <Route path="teaching/content/create" element={<TuContentCreatePage />} />
    <Route path="teaching/content/:id" element={<ContentDetailPage />} />
    <Route path="teaching/assignments" element={<MyAssignmentsPage />} />
    <Route path="teaching/assignments/:id" element={<AssignmentDetailPage />} />
    <Route path="teaching/roadmaps" element={<RoadmapListPage />} />
    <Route path="teaching/roadmaps/create" element={<RoadmapCreatePage />} />
    <Route path="teaching/roadmaps/:id" element={<TeachingRoadmapDetailPage />} />
    <Route path="teaching/roadmaps/:id/edit" element={<RoadmapCreatePage />} />
    <Route path="catalog" element={<PlaceholderPage title="과정 둘러보기" />} />
  </Route>
  <Route path="/tu" element={<TenantUserWrapper />}>
    <Route index element={<TUDashboardPage />} />
    <Route path="dashboard" element={<TUDashboardPage />} />

    {/* 내 강의계획 */}
    <Route path="teaching/courses" element={<MyCoursesPage />} />
    <Route path="teaching/courses/create" element={<CourseCreatePage />} />
    <Route path="teaching/courses/:courseId" element={<TeachingCourseDetailPage />} />
    <Route path="teaching/courses/:courseId/edit" element={<CourseEditPage />} />
    <Route path="teaching/courses/:courseId/apply" element={<CourseApplyPage />} />

    {/* 내 프로그램 */}
    <Route path="teaching/programs" element={<MyProgramsPage />} />
    <Route path="teaching/programs/:programId" element={<TuProgramDetailPage />} />
    <Route path="teaching/programs/:programId/edit" element={<TuProgramEditPage />} />

    {/* 내 콘텐츠 */}
    <Route path="teaching/content" element={<MyContentPage />} />
    <Route path="teaching/content/create" element={<TuContentCreatePage />} />
    <Route path="teaching/content/:id" element={<ContentDetailPage />} />

    {/* 내 과제 */}
    <Route path="teaching/assignments" element={<MyAssignmentsPage />} />
    <Route path="teaching/assignments/:id" element={<AssignmentDetailPage />} />

    {/* 로드맵 */}
    <Route path="teaching/roadmaps" element={<RoadmapListPage />} />
    <Route path="teaching/roadmaps/create" element={<RoadmapCreatePage />} />
    <Route path="teaching/roadmaps/:id" element={<TeachingRoadmapDetailPage />} />
    <Route path="teaching/roadmaps/:id/edit" element={<RoadmapCreatePage />} />

    {/* 교육 과정 탐색 */}
    <Route path="catalog" element={<PlaceholderPage title="과정 둘러보기" />} />
  </Route>
  </>
);
