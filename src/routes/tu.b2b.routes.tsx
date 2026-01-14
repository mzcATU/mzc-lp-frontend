import { Route } from 'react-router-dom';
import {
  CoursesExplorePage,
  NotificationsPage,
  NotificationDetailPage,
  InstructorProfilePage,
  SearchPage,
} from '@/pages/tu';
import { B2BLandingPage, B2BCourseDetailPage } from '@/pages/tu/b2b';

/**
 * TU B2B 라우트 - 기업용 페이지 (사이드바 없음)
 *
 * 경로: /:subdomain/tu/b2b/* 또는 /tu/b2b/* (기본)
 *
 * B2C와의 차이점:
 * - 장바구니/결제 없음 (회사에서 일괄 배정)
 * - 가격 표시 없음
 * - 로드맵 없음
 * - 커뮤니티 없음
 */
export const tuB2bRoutes = (
  <>
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
