import { Route } from 'react-router-dom';
import { LandingPage, Page1, Page2, Page3 } from '@/pages/tu';
import { tuCoursesRoutes } from './tu.courses.routes';

export const tuRoutes = (
  <>
    {/* TU 강의 관련 라우트 (사이드바 있음) */}
    {tuCoursesRoutes}

    {/* 기본 경로 - 랜딩 페이지 */}
    <Route path="/" element={<LandingPage />} />

    {/* 메인 페이지 (사이드바 없음) */}
    <Route path="/tu/main/page1" element={<Page1 />} />
    <Route path="/tu/main/page2" element={<Page2 />} />
    <Route path="/tu/main/page3" element={<Page3 />} />
  </>
);
