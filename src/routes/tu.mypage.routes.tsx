import { Route, Outlet } from 'react-router-dom';
import { MyPageLayout } from '@/components/layout';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { ProfileRequiredRoute } from '@/components/common/ProfileRequiredRoute';
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
  UserNoticesPage,
  B2CSettingsPage,
  B2CPreferencesPage,
} from '@/pages/tu';
import {
  SettingsSecurityPage,
  SettingsNotificationsPage,
  SettingsAppearancePage,
} from '@/pages/common';

function MyPageWrapper() {
  return (
    <ProtectedRoute allowedRoles={['USER', 'DESIGNER', 'INSTRUCTOR', 'OPERATOR', 'TENANT_ADMIN']}>
      <ProfileRequiredRoute>
        <MyPageLayout>
          <Outlet />
        </MyPageLayout>
      </ProfileRequiredRoute>
    </ProtectedRoute>
  );
}

// 플레이어용 Wrapper (레이아웃 없이 전체 화면)
function PlayerWrapper() {
  return (
    <ProtectedRoute allowedRoles={['USER', 'DESIGNER', 'INSTRUCTOR', 'OPERATOR', 'TENANT_ADMIN']}>
      <ProfileRequiredRoute>
        <Outlet />
      </ProfileRequiredRoute>
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
  {/* 플레이어 라우트 - 레이아웃 없이 전체 화면 (subdomain 있음) */}
  <Route path="/:subdomain/tu/b2c/mypage/learning/:enrollmentId/player" element={<PlayerWrapper />}>
    <Route index element={<LearningPlayerPage />} />
    <Route path=":itemId" element={<LearningPlayerPage />} />
  </Route>

  {/* 플레이어 라우트 - 레이아웃 없이 전체 화면 (subdomain 없음) */}
  <Route path="/tu/b2c/mypage/learning/:enrollmentId/player" element={<PlayerWrapper />}>
    <Route index element={<LearningPlayerPage />} />
    <Route path=":itemId" element={<LearningPlayerPage />} />
  </Route>

  {/* 마이페이지 라우트 (subdomain 있음) */}
  <Route path="/:subdomain/tu/b2c/mypage" element={<MyPageWrapper />}>
    <Route index element={<MyPageHome />} />
    <Route path="profile" element={<ProfilePage />} />
    <Route path="learning" element={<MyLearningPage />} />
    <Route path="learning/:enrollmentId" element={<LearningDetailPage />} />
    <Route path="completed" element={<CompletedCoursesPage />} />
    <Route path="certificates" element={<CertificationsPage />} />
    <Route path="teaching" element={<MyTeachingPage />} />
    <Route path="teaching/stats" element={<TeachingStatsPage />} />
    <Route path="posts" element={<MyPostsPage />} />
    <Route path="comments" element={<MyCommentsPage />} />
    <Route path="notices" element={<UserNoticesPage />} />
    <Route path="settings" element={<B2CSettingsPage />} />
    <Route path="settings/preferences" element={<B2CPreferencesPage />} />
    <Route path="settings/security" element={<SettingsSecurityPage />} />
    <Route path="settings/notifications" element={<SettingsNotificationsPage />} />
    <Route path="settings/language" element={<SettingsLanguagePage />} />
    <Route path="settings/appearance" element={<SettingsAppearancePage />} />
  </Route>

  {/* 마이페이지 라우트 (subdomain 없음) */}
  <Route path="/tu/b2c/mypage" element={<MyPageWrapper />}>
    <Route index element={<MyPageHome />} />
    <Route path="profile" element={<ProfilePage />} />

    {/* 내 수강 강의 */}
    <Route path="learning" element={<MyLearningPage />} />
    <Route path="learning/:enrollmentId" element={<LearningDetailPage />} />
    <Route path="completed" element={<CompletedCoursesPage />} />
    <Route path="certificates" element={<CertificationsPage />} />

    {/* 내 강의 관리 */}
    <Route path="teaching" element={<MyTeachingPage />} />
    <Route path="teaching/stats" element={<TeachingStatsPage />} />

    {/* 커뮤니티 */}
    <Route path="posts" element={<MyPostsPage />} />
    <Route path="comments" element={<MyCommentsPage />} />

    {/* 공지사항 */}
    <Route path="notices" element={<UserNoticesPage />} />

    {/* 설정 (B2C 전용 카드 형식) */}
    <Route path="settings" element={<B2CSettingsPage />} />
    <Route path="settings/preferences" element={<B2CPreferencesPage />} />
    <Route path="settings/security" element={<SettingsSecurityPage />} />
    <Route path="settings/notifications" element={<SettingsNotificationsPage />} />
    <Route path="settings/language" element={<SettingsLanguagePage />} />
    <Route path="settings/appearance" element={<SettingsAppearancePage />} />
  </Route>
  </>
);
