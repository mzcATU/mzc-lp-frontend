import { Route, Outlet, Navigate } from 'react-router-dom';
import {
  LandingPage,
  Page1,
  Page2,
  Page3,
  MyPageHome,
  ProfilePage,
  MyLearningPage,
  LearningDetailPage,
  LearningPlayerPage,
  SettingsLanguagePage,
  MyTeachingPage,
  TeachingStatsPage,
  CompletedCoursesPage,
  CertificationsPage,
} from '@/pages/tu';
import { MyPageLayout } from '@/components/layout';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { SettingsNotificationsPage } from '@/pages/common';
import { tuCoursesRoutes } from './tu.courses.routes';

function MyPageWrapper() {
  return (
    <ProtectedRoute allowedRoles={['USER', 'DESIGNER', 'OPERATOR', 'TENANT_ADMIN']}>
      <MyPageLayout>
        <Outlet />
      </MyPageLayout>
    </ProtectedRoute>
  );
}

export const tuRoutes = (
  <>
    {/* TU 강의 관련 라우트 (사이드바 있음) */}
    {tuCoursesRoutes}

    {/* 기본 경로 - 랜딩 페이지 */}
    <Route path="/" element={<LandingPage />} />

    {/* 마이페이지 (사이드바 있음, 로그인 필요) */}
    <Route path="/mypage" element={<MyPageWrapper />}>
      <Route index element={<MyPageHome />} />
      <Route path="profile" element={<ProfilePage />} />
      {/* 내 수강 강의 */}
      <Route path="learning" element={<MyLearningPage />} />
      <Route path="learning/:enrollmentId" element={<LearningDetailPage />} />
      <Route path="learning/:enrollmentId/player" element={<LearningPlayerPage />} />
      <Route path="learning/:enrollmentId/player/:itemId" element={<LearningPlayerPage />} />
      <Route path="completed" element={<CompletedCoursesPage />} />
      <Route path="certifications" element={<CertificationsPage />} />
      {/* 내 강의 관리 */}
      <Route path="teaching" element={<MyTeachingPage />} />
      <Route path="teaching/stats" element={<TeachingStatsPage />} />
      {/* 설정 */}
      <Route path="security" element={<Navigate to="/mypage/profile" replace />} />
      <Route path="notifications" element={<SettingsNotificationsPage />} />
      <Route path="language" element={<SettingsLanguagePage />} />
    </Route>

    {/* 메인 페이지 (사이드바 없음) */}
    <Route path="/tu/main/page1" element={<Page1 />} />
    <Route path="/tu/main/page2" element={<Page2 />} />
    <Route path="/tu/main/page3" element={<Page3 />} />
  </>
);
