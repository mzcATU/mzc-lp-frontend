import { Route, Outlet } from 'react-router-dom';
import { B2BMyPageLayout } from '@/components/layout';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { ProfileRequiredRoute } from '@/components/common/ProfileRequiredRoute';
import {
  // B2C 페이지 재사용 (알림, 강사 프로필만)
  NotificationsPage,
  InstructorProfilePage,
} from '@/pages/tu';
import {
  SettingsSecurityPage,
  SettingsNotificationsPage,
  SettingsAppearancePage,
} from '@/pages/common';
import {
  // B2B 메인 페이지
  B2BLandingPage,
  B2BCourseDetailPage,
  B2BSearchPage,
  // B2B 마이페이지
  B2BMyPageHome,
  B2BProfilePage,
  B2BMyLearningPage,
  B2BLearningDetailPage,
  B2BCompletedCoursesPage,
  B2BCertificationsPage,
  B2BMyTeachingPage,
  B2BTeachingStatsPage,
  B2BUserNoticesPage,
  // B2B 설정
  B2BSettingsPage,
  B2BPreferencesPage,
  // B2B 기타
  B2BMyActivityPage,
  B2BWishlistPage,
  B2BLearningPlayerPage,
  // B2B 컴포넌트
  B2BLandingHeader,
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
 * B2B 알림 페이지 - B2C NotificationsPage 재사용
 * - B2BLandingHeader 사용
 */
function B2BNotificationsPage() {
  return (
    <NotificationsPage
      HeaderComponent={B2BLandingHeader}
      detailBasePath="/tu/b2b/notifications"
    />
  );
}

/**
 * B2B 강사 프로필 페이지 - B2C InstructorProfilePage 재사용
 * - B2BLandingHeader 사용
 * - 가격 숨김
 */
function B2BInstructorProfilePage() {
  return (
    <InstructorProfilePage
      HeaderComponent={B2BLandingHeader}
      showPrice={false}
      courseBasePath="/tu/b2b/courses"
      roadmapBasePath="/tu/b2b/roadmaps"
    />
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
 * - 독립적인 B2B SearchPage 사용 (props 기반 커스터마이징 제거)
 */
export const tuB2bRoutes = (
  <>
    {/* ===== 플레이어 라우트 - 레이아웃 없이 전체 화면 ===== */}
    <Route path="/:subdomain/tu/b2b/player/:enrollmentId" element={<B2BPlayerWrapper />}>
      <Route index element={<B2BLearningPlayerPage />} />
      <Route path=":itemId" element={<B2BLearningPlayerPage />} />
    </Route>
    <Route path="/tu/b2b/player/:enrollmentId" element={<B2BPlayerWrapper />}>
      <Route index element={<B2BLearningPlayerPage />} />
      <Route path=":itemId" element={<B2BLearningPlayerPage />} />
    </Route>

    {/* ===== 마이페이지 (로그인 필요) ===== */}

    {/* 마이페이지 라우트 (subdomain 있음) */}
    <Route path="/:subdomain/tu/b2b/mypage" element={<B2BMyPageWrapper />}>
      <Route index element={<B2BMyPageHome />} />
      <Route path="profile" element={<B2BProfilePage />} />

      {/* 내 수강 강의 */}
      <Route path="learning" element={<B2BMyLearningPage />} />
      <Route path="learning/:enrollmentId" element={<B2BLearningDetailPage />} />
      <Route path="completed" element={<B2BCompletedCoursesPage />} />
      <Route path="certificates" element={<B2BCertificationsPage />} />

      {/* 내 강의 관리 */}
      <Route path="teaching" element={<B2BMyTeachingPage />} />
      <Route path="teaching/stats" element={<B2BTeachingStatsPage />} />

      {/* 내 활동 (커뮤니티 → 내 댓글만) */}
      <Route path="comments" element={<B2BMyActivityPage />} />

      {/* 찜 목록 */}
      <Route path="wishlist" element={<B2BWishlistPage />} />

      {/* 공지사항 */}
      <Route path="notices" element={<B2BUserNoticesPage />} />

      {/* 설정 (B2B 전용 카드 형식) */}
      <Route path="settings" element={<B2BSettingsPage />} />
      <Route path="settings/preferences" element={<B2BPreferencesPage />} />
      <Route path="settings/security" element={<SettingsSecurityPage />} />
      <Route path="settings/notifications" element={<SettingsNotificationsPage />} />
      <Route path="settings/appearance" element={<SettingsAppearancePage />} />
    </Route>

    {/* 마이페이지 라우트 (subdomain 없음) */}
    <Route path="/tu/b2b/mypage" element={<B2BMyPageWrapper />}>
      <Route index element={<B2BMyPageHome />} />
      <Route path="profile" element={<B2BProfilePage />} />

      {/* 내 수강 강의 */}
      <Route path="learning" element={<B2BMyLearningPage />} />
      <Route path="learning/:enrollmentId" element={<B2BLearningDetailPage />} />
      <Route path="completed" element={<B2BCompletedCoursesPage />} />
      <Route path="certificates" element={<B2BCertificationsPage />} />

      {/* 내 강의 관리 */}
      <Route path="teaching" element={<B2BMyTeachingPage />} />
      <Route path="teaching/stats" element={<B2BTeachingStatsPage />} />

      {/* 내 활동 (커뮤니티 → 내 댓글만) */}
      <Route path="comments" element={<B2BMyActivityPage />} />

      {/* 찜 목록 */}
      <Route path="wishlist" element={<B2BWishlistPage />} />

      {/* 공지사항 */}
      <Route path="notices" element={<B2BUserNoticesPage />} />

      {/* 설정 (B2B 전용 카드 형식) */}
      <Route path="settings" element={<B2BSettingsPage />} />
      <Route path="settings/preferences" element={<B2BPreferencesPage />} />
      <Route path="settings/security" element={<SettingsSecurityPage />} />
      <Route path="settings/notifications" element={<SettingsNotificationsPage />} />
      <Route path="settings/appearance" element={<SettingsAppearancePage />} />
    </Route>

    {/* ===== 메인 페이지 (사이드바 없음) ===== */}

    {/* 랜딩 페이지 */}
    <Route path="/:subdomain/tu/b2b" element={<B2BLandingPage />} />
    <Route path="/tu/b2b" element={<B2BLandingPage />} />

    {/* 통합 검색 (B2B 전용 - 로드맵/커뮤니티 제외) */}
    <Route path="/:subdomain/tu/b2b/search" element={<B2BSearchPage />} />
    <Route path="/tu/b2b/search" element={<B2BSearchPage />} />

    {/* 강의 상세 (B2B에서는 강의 탐색 목록 없음, 상세만 접근 가능) */}
    <Route path="/:subdomain/tu/b2b/courses/:id" element={<B2BCourseDetailPage />} />
    <Route path="/tu/b2b/courses/:id" element={<B2BCourseDetailPage />} />

    {/* 차수(Times) 상세 - CourseTime 기반 */}
    <Route path="/:subdomain/tu/b2b/times/:id" element={<B2BCourseDetailPage />} />
    <Route path="/tu/b2b/times/:id" element={<B2BCourseDetailPage />} />

    {/* 알림 (B2B - B2C 페이지 재사용) */}
    <Route path="/:subdomain/tu/b2b/notifications" element={<B2BNotificationsPage />} />
    <Route path="/tu/b2b/notifications" element={<B2BNotificationsPage />} />

    {/* 강사 프로필 (B2B - B2C 페이지 재사용) */}
    <Route path="/:subdomain/tu/b2b/instructors/:instructorId" element={<B2BInstructorProfilePage />} />
    <Route path="/tu/b2b/instructors/:instructorId" element={<B2BInstructorProfilePage />} />
  </>
);
