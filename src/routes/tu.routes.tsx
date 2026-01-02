import { Route, Outlet, Navigate } from 'react-router-dom';
import {
  LandingPage,
  Page1,
  Page2,
  Page3,
  CoursesExplorePage,
  RoadmapExplorePage,
  RoadmapDetailPage,
  CommunityPage,
  CartPage,
  WishlistPage,
  NotificationsPage,
  CourseDetailPage,
  InstructorProfilePage,
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
import {
  SettingsPage,
  SettingsSecurityPage,
  SettingsNotificationsPage,
  SettingsAppearancePage,
} from '@/pages/common';
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
      <Route path="settings" element={<SettingsPage />} />
      <Route path="settings/security" element={<SettingsSecurityPage />} />
      <Route path="settings/notifications" element={<SettingsNotificationsPage />} />
      <Route path="settings/language" element={<SettingsLanguagePage />} />
      <Route path="settings/appearance" element={<SettingsAppearancePage />} />
      {/* 레거시 경로 리다이렉트 */}
      <Route path="profile" element={<Navigate to="/mypage/settings/security" replace />} />
      <Route path="security" element={<Navigate to="/mypage/settings/security" replace />} />
      <Route path="notifications" element={<Navigate to="/mypage/settings/notifications" replace />} />
      <Route path="language" element={<Navigate to="/mypage/settings/language" replace />} />
    </Route>

    {/* 메인 페이지 (사이드바 없음) */}
    <Route path="/tu/main/courses" element={<CoursesExplorePage />} />
    <Route path="/tu/main/courses/:id" element={<CourseDetailPage />} />
    <Route path="/tu/main/roadmaps" element={<RoadmapExplorePage />} />
    <Route path="/tu/main/roadmaps/:id" element={<RoadmapDetailPage />} />
    <Route path="/tu/main/community" element={<CommunityPage />} />
    <Route path="/tu/cart" element={<CartPage />} />
    <Route path="/tu/wishlist" element={<WishlistPage />} />
    <Route path="/tu/notifications" element={<NotificationsPage />} />
    <Route path="/tu/main/page1" element={<Page1 />} />
    <Route path="/tu/main/page2" element={<Page2 />} />
    <Route path="/tu/main/page3" element={<Page3 />} />
    <Route path="/tu/instructors/:instructorId" element={<InstructorProfilePage />} />
  </>
);
