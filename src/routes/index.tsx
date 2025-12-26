import { Routes, Route } from 'react-router-dom';
import { LandingPage } from '@/pages/tu';
import ComponentShowcase from '@/pages/ComponentShowcase';
import { saRoutes } from './sa.routes';
import { taRoutes } from './ta.routes';
import { toRoutes } from './to.routes';
import { tuRoutes } from './tu.routes';
import { authRoutes } from './auth.routes';
import { UnauthorizedPage } from './pages';

export function AppRoutes() {
  return (
    <Routes>
      {/* 역할별 라우트 */}
      {saRoutes}
      {taRoutes}
      {toRoutes}
      {tuRoutes}

      {/* 인증 페이지 */}
      {authRoutes}

      {/* 권한 없음 페이지 */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* 기본 경로 - 랜딩 페이지 */}
      <Route path="/" element={<LandingPage />} />

      {/* 컴포넌트 쇼케이스 (개발용) */}
      <Route path="/showcase" element={<ComponentShowcase />} />
    </Routes>
  );
}
