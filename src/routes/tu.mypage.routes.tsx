import { Route, Outlet } from 'react-router-dom';
import { MyPageLayout } from '@/components/layout';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import {
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
  MyPostsPage,
  MyCommentsPage,
} from '@/pages/tu';
import {
  SettingsPage,
  SettingsSecurityPage,
  SettingsNotificationsPage,
  SettingsAppearancePage,
} from '@/pages/common';

function MyPageWrapper() {
  return (
    <ProtectedRoute allowedRoles={['USER', 'DESIGNER', 'OPERATOR', 'TENANT_ADMIN']}>
      <MyPageLayout>
        <Outlet />
      </MyPageLayout>
    </ProtectedRoute>
  );
}

/**
 * TU MyPage 라우트 - 마이페이지 (사이드바 있음, 로그인 필요)
 *
 * 경로: /:subdomain/tu/b2c/mypage/* 또는 /tu/b2c/mypage/*
 * - 내 정보, 내 수강 강의, 내 강의 관리, 설정
 */
export const tuMyPageRoutes = (
  <>
  <Route path="/:subdomain/tu/b2c/mypage" element={<MyPageWrapper />}>
    <Route index element={<MyPageHome />} />
    <Route path="profile" element={<ProfilePage />} />
    <Route path="learning" element={<MyLearningPage />} />
    <Route path="learning/:enrollmentId" element={<LearningDetailPage />} />
    <Route path="learning/:enrollmentId/player" element={<LearningPlayerPage />} />
    <Route path="learning/:enrollmentId/player/:itemId" element={<LearningPlayerPage />} />
    <Route path="completed" element={<CompletedCoursesPage />} />
    <Route path="certificates" element={<CertificationsPage />} />
    <Route path="teaching" element={<MyTeachingPage />} />
    <Route path="teaching/stats" element={<TeachingStatsPage />} />
    <Route path="posts" element={<MyPostsPage />} />
    <Route path="comments" element={<MyCommentsPage />} />
    <Route path="settings" element={<SettingsPage />} />
    <Route path="settings/security" element={<SettingsSecurityPage />} />
    <Route path="settings/notifications" element={<SettingsNotificationsPage />} />
    <Route path="settings/language" element={<SettingsLanguagePage />} />
    <Route path="settings/appearance" element={<SettingsAppearancePage />} />
  </Route>
  <Route path="/tu/b2c/mypage" element={<MyPageWrapper />}>
    <Route index element={<MyPageHome />} />
    <Route path="profile" element={<ProfilePage />} />

    {/* 내 수강 강의 */}
    <Route path="learning" element={<MyLearningPage />} />
    <Route path="learning/:enrollmentId" element={<LearningDetailPage />} />
    <Route path="learning/:enrollmentId/player" element={<LearningPlayerPage />} />
    <Route path="learning/:enrollmentId/player/:itemId" element={<LearningPlayerPage />} />
    <Route path="completed" element={<CompletedCoursesPage />} />
    <Route path="certificates" element={<CertificationsPage />} />

    {/* 내 강의 관리 */}
    <Route path="teaching" element={<MyTeachingPage />} />
    <Route path="teaching/stats" element={<TeachingStatsPage />} />

    {/* 커뮤니티 */}
    <Route path="posts" element={<MyPostsPage />} />
    <Route path="comments" element={<MyCommentsPage />} />

    {/* 설정 */}
    <Route path="settings" element={<SettingsPage />} />
    <Route path="settings/security" element={<SettingsSecurityPage />} />
    <Route path="settings/notifications" element={<SettingsNotificationsPage />} />
    <Route path="settings/language" element={<SettingsLanguagePage />} />
    <Route path="settings/appearance" element={<SettingsAppearancePage />} />
  </Route>
  </>
);
