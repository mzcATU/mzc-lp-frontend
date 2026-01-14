import { Route } from 'react-router-dom';
import {
  LandingPage,
  CoursesExplorePage,
  CourseDetailPage,
  RoadmapExplorePage,
  RoadmapDetailPage,
  CommunityPage,
  CommunityDetailPage,
  CartPage,
  WishlistPage,
  NotificationsPage,
  NotificationDetailPage,
  InstructorProfilePage,
  SearchPage,
} from '@/pages/tu';

/**
 * TU B2C 라우트 - 메인 페이지 (사이드바 없음)
 *
 * 경로: /:subdomain/tu/b2c/* 또는 /tu/b2c/* (기본)
 * - 랜딩, 강의 탐색, 로드맵, 커뮤니티, 장바구니, 위시리스트, 알림
 */
export const tuB2cRoutes = (
  <>
    {/* 랜딩 페이지 - subdomain 포함 */}
    <Route path="/:subdomain/tu/b2c" element={<LandingPage />} />
    <Route path="/tu/b2c" element={<LandingPage />} />

    {/* 통합 검색 */}
    <Route path="/tu/b2c/search" element={<SearchPage />} />

    {/* 강의 탐색 */}
    <Route path="/:subdomain/tu/b2c/courses" element={<CoursesExplorePage />} />
    <Route path="/:subdomain/tu/b2c/courses/:id" element={<CourseDetailPage />} />
    <Route path="/tu/b2c/courses" element={<CoursesExplorePage />} />
    <Route path="/tu/b2c/courses/:id" element={<CourseDetailPage />} />

    {/* 차수(Times) 상세 - CourseTime 기반 */}
    <Route path="/:subdomain/tu/b2c/times/:id" element={<CourseDetailPage />} />
    <Route path="/tu/b2c/times/:id" element={<CourseDetailPage />} />

    {/* 차수별 커뮤니티 상세 */}
    <Route path="/:subdomain/tu/b2c/times/:courseTimeId/community/:id" element={<CommunityDetailPage />} />
    <Route path="/tu/b2c/times/:courseTimeId/community/:id" element={<CommunityDetailPage />} />

    {/* 로드맵 */}
    <Route path="/:subdomain/tu/b2c/roadmaps" element={<RoadmapExplorePage />} />
    <Route path="/:subdomain/tu/b2c/roadmaps/:id" element={<RoadmapDetailPage />} />
    <Route path="/tu/b2c/roadmaps" element={<RoadmapExplorePage />} />
    <Route path="/tu/b2c/roadmaps/:id" element={<RoadmapDetailPage />} />

    {/* 커뮤니티 */}
    <Route path="/:subdomain/tu/b2c/community" element={<CommunityPage />} />
    <Route path="/:subdomain/tu/b2c/community/:id" element={<CommunityDetailPage />} />
    <Route path="/tu/b2c/community" element={<CommunityPage />} />
    <Route path="/tu/b2c/community/:id" element={<CommunityDetailPage />} />

    {/* 장바구니 & 위시리스트 */}
    <Route path="/:subdomain/tu/b2c/cart" element={<CartPage />} />
    <Route path="/:subdomain/tu/b2c/wishlist" element={<WishlistPage />} />
    <Route path="/tu/b2c/cart" element={<CartPage />} />
    <Route path="/tu/b2c/wishlist" element={<WishlistPage />} />

    {/* 알림 */}
    <Route path="/:subdomain/tu/b2c/notifications" element={<NotificationsPage />} />
    <Route path="/:subdomain/tu/b2c/notifications/:id" element={<NotificationDetailPage />} />
    <Route path="/tu/b2c/notifications" element={<NotificationsPage />} />
    <Route path="/tu/b2c/notifications/:id" element={<NotificationDetailPage />} />

    {/* 강사 프로필 */}
    <Route path="/:subdomain/tu/b2c/instructors/:instructorId" element={<InstructorProfilePage />} />
    <Route path="/tu/b2c/instructors/:instructorId" element={<InstructorProfilePage />} />
  </>
);
