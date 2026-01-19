/**
 * B2B 전용 페이지 모듈
 *
 * B2C와의 차이점:
 * - 장바구니/결제 없음 (회사에서 일괄 배정)
 * - 가격 표시 없음
 * - 로드맵 없음
 * - 커뮤니티 없음
 *
 * 대부분의 페이지는 B2C 페이지를 재사용하며,
 * HeaderComponent와 showPrice 등의 prop으로 B2B 스타일 적용
 */

// B2B 메인 페이지
export { B2BLandingPage } from './B2BLandingPage';
export { B2BCourseDetailPage } from './B2BCourseDetailPage';
export { B2BSearchPage } from './B2BSearchPage';

// B2B 마이페이지
export { B2BMyPageHome } from './B2BMyPageHome';
export { B2BProfilePage } from './B2BProfilePage';
export { B2BMyLearningPage } from './B2BMyLearningPage';
export { B2BLearningDetailPage } from './B2BLearningDetailPage';
export { B2BCompletedCoursesPage } from './B2BCompletedCoursesPage';
export { B2BCertificationsPage } from './B2BCertificationsPage';
export { B2BMyTeachingPage } from './B2BMyTeachingPage';
export { B2BTeachingStatsPage } from './B2BTeachingStatsPage';
export { B2BUserNoticesPage } from './B2BUserNoticesPage';

// B2B 설정 페이지
export { B2BSettingsPage } from './B2BSettingsPage';
export { B2BPreferencesPage } from './B2BPreferencesPage';

// B2B 기타 페이지
export { B2BMyActivityPage } from './B2BMyActivityPage';
export { B2BWishlistPage } from './B2BWishlistPage';
export { B2BLearningPlayerPage } from './B2BLearningPlayerPage';

// B2B 전용 컴포넌트
export { B2BLandingHeader } from './components/B2BLandingHeader';
export { B2BCourseCard } from './components/B2BCourseCard';
