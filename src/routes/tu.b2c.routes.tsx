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
} from '@/pages/tu';

/**
 * TU B2C 라우트 - 메인 페이지 (사이드바 없음)
 *
 * 경로: /tu/b2c/*
 * - 랜딩, 강의 탐색, 로드맵, 커뮤니티, 장바구니, 위시리스트, 알림
 */
export const tuB2cRoutes = (
  <>
    {/* 랜딩 페이지 */}
    <Route path="/tu/b2c" element={<LandingPage />} />

    {/* 강의 탐색 */}
    <Route path="/tu/b2c/courses" element={<CoursesExplorePage />} />
    <Route path="/tu/b2c/courses/:id" element={<CourseDetailPage />} />

    {/* 로드맵 */}
    <Route path="/tu/b2c/roadmaps" element={<RoadmapExplorePage />} />
    <Route path="/tu/b2c/roadmaps/:id" element={<RoadmapDetailPage />} />

    {/* 커뮤니티 */}
    <Route path="/tu/b2c/community" element={<CommunityPage />} />
    <Route path="/tu/b2c/community/:id" element={<CommunityDetailPage />} />

    {/* 장바구니 & 위시리스트 */}
    <Route path="/tu/b2c/cart" element={<CartPage />} />
    <Route path="/tu/b2c/wishlist" element={<WishlistPage />} />

    {/* 알림 */}
    <Route path="/tu/b2c/notifications" element={<NotificationsPage />} />
    <Route path="/tu/b2c/notifications/:id" element={<NotificationDetailPage />} />

    {/* 강사 프로필 */}
    <Route path="/tu/b2c/instructors/:instructorId" element={<InstructorProfilePage />} />
  </>
);
