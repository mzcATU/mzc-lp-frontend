import { Route, Outlet } from 'react-router-dom';
import { B2BMyPageLayout } from '@/components/layout';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { ProfileRequiredRoute } from '@/components/common/ProfileRequiredRoute';
import {
  CoursesExplorePage,
  NotificationsPage,
  NotificationDetailPage,
  InstructorProfilePage,
  SearchPage,
  MyPageHome,
  ProfilePage,
  MyLearningPage,
  LearningDetailPage,
  LearningPlayerPage,
  MyTeachingPage,
  TeachingStatsPage,
  CompletedCoursesPage,
  CertificationsPage,
  UserNoticesPage,
} from '@/pages/tu';
import {
  B2BLandingPage,
  B2BCourseDetailPage,
  B2BSettingsPage,
  B2BPreferencesPage,
  B2BMyActivityPage,
} from '@/pages/tu/b2b';

function B2BMyPageWrapper() {
  return (
    <ProtectedRoute allowedRoles={['USER', 'DESIGNER', 'INSTRUCTOR', 'OPERATOR', 'TENANT_ADMIN']}>
      <ProfileRequiredRoute>
        <B2BMyPageLayout>
          <Outlet />
        </B2BMyPageLayout>
      </ProfileRequiredRoute>
    </ProtectedRoute>
  );
}

function B2BPlayerWrapper() {
  return (
    <ProtectedRoute allowedRoles={['USER', 'DESIGNER', 'INSTRUCTOR', 'OPERATOR', 'TENANT_ADMIN']}>
      <ProfileRequiredRoute>
        <Outlet />
      </ProfileRequiredRoute>
    </ProtectedRoute>
  );
}

/**
 * TU B2B 라우트 - 기업용 페이지
 *
 * 경로: /:subdomain/tu/b2b/* 또는 /tu/b2b/* (기본)
 *
 * B2C와의 차이점:
 * - 장바구니/결제 없음 (회사에서 일괄 배정)
 * - 가격 표시 없음
 * - 로드맵 없음
 * - 커뮤니티 → 내 활동 (내 댓글만)
 * - 설정 → 카드 형식 (프로필/환경설정)
 */
export const tuB2bRoutes = (
  <>
    {/* ===== 마이페이지 (로그인 필요) ===== */}

    {/* 플레이어 라우트 - 레이아웃 없이 전체 화면 */}
    <Route path="/:subdomain/tu/b2b/mypage/learning/:enrollmentId/player" element={<B2BPlayerWrapper />}>
      <Route index element={<LearningPlayerPage />} />
      <Route path=":itemId" element={<LearningPlayerPage />} />
    </Route>
    <Route path="/tu/b2b/mypage/learning/:enrollmentId/player" element={<B2BPlayerWrapper />}>
      <Route index element={<LearningPlayerPage />} />
      <Route path=":itemId" element={<LearningPlayerPage />} />
    </Route>

    {/* 마이페이지 라우트 (subdomain 있음) */}
    <Route path="/:subdomain/tu/b2b/mypage" element={<B2BMyPageWrapper />}>
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

      {/* 내 활동 (커뮤니티 → 내 댓글만) */}
      <Route path="comments" element={<B2BMyActivityPage />} />

      {/* 공지사항 */}
      <Route path="notices" element={<UserNoticesPage />} />

      {/* 설정 (카드 형식) */}
      <Route path="settings" element={<B2BSettingsPage />} />
      <Route path="settings/preferences" element={<B2BPreferencesPage />} />
    </Route>

    {/* 마이페이지 라우트 (subdomain 없음) */}
    <Route path="/tu/b2b/mypage" element={<B2BMyPageWrapper />}>
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

      {/* 내 활동 (커뮤니티 → 내 댓글만) */}
      <Route path="comments" element={<B2BMyActivityPage />} />

      {/* 공지사항 */}
      <Route path="notices" element={<UserNoticesPage />} />

      {/* 설정 (카드 형식) */}
      <Route path="settings" element={<B2BSettingsPage />} />
      <Route path="settings/preferences" element={<B2BPreferencesPage />} />
    </Route>

    {/* ===== 메인 페이지 (사이드바 없음) ===== */}

    {/* 랜딩 페이지 */}
    <Route path="/:subdomain/tu/b2b" element={<B2BLandingPage />} />
    <Route path="/tu/b2b" element={<B2BLandingPage />} />

    {/* 통합 검색 */}
    <Route path="/:subdomain/tu/b2b/search" element={<SearchPage />} />
    <Route path="/tu/b2b/search" element={<SearchPage />} />

    {/* 강의 탐색 */}
    <Route path="/:subdomain/tu/b2b/courses" element={<CoursesExplorePage />} />
    <Route path="/:subdomain/tu/b2b/courses/:id" element={<B2BCourseDetailPage />} />
    <Route path="/tu/b2b/courses" element={<CoursesExplorePage />} />
    <Route path="/tu/b2b/courses/:id" element={<B2BCourseDetailPage />} />

    {/* 차수(Times) 상세 - CourseTime 기반 */}
    <Route path="/:subdomain/tu/b2b/times/:id" element={<B2BCourseDetailPage />} />
    <Route path="/tu/b2b/times/:id" element={<B2BCourseDetailPage />} />

    {/* 알림 */}
    <Route path="/:subdomain/tu/b2b/notifications" element={<NotificationsPage />} />
    <Route path="/:subdomain/tu/b2b/notifications/:id" element={<NotificationDetailPage />} />
    <Route path="/tu/b2b/notifications" element={<NotificationsPage />} />
    <Route path="/tu/b2b/notifications/:id" element={<NotificationDetailPage />} />

    {/* 강사 프로필 */}
    <Route path="/:subdomain/tu/b2b/instructors/:instructorId" element={<InstructorProfilePage />} />
    <Route path="/tu/b2b/instructors/:instructorId" element={<InstructorProfilePage />} />
  </>
);
