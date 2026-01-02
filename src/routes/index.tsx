import { Routes, Route, Navigate } from 'react-router-dom';
import ComponentShowcase from '@/pages/dev/ComponentShowcase';
import { saRoutes } from './sa.routes';
import { taRoutes } from './ta.routes';
import { toRoutes } from './to.routes';
import { tuRoutes } from './tu.routes';
import { authRoutes } from './auth.routes';
import { UnauthorizedPage } from './pages';

export function AppRoutes() {
  return (
    <Routes>
      {/* 루트 경로 리다이렉트 */}
      <Route path="/" element={<Navigate to="/tu/b2c" replace />} />

      {/* 역할별 라우트 */}
      {saRoutes}
      {taRoutes}
      {toRoutes}
      {tuRoutes}

      {/* 인증 페이지 */}
      {authRoutes}

      {/* 권한 없음 페이지 */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* 컴포넌트 쇼케이스 (개발용) */}
      <Route path="/showcase" element={<ComponentShowcase />} />
    </Routes>
  );
}
