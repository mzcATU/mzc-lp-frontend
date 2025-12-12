import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { MyCoursesPage, MyContentPage, CourseCreatePage, TuContentCreatePage } from '@/pages/tu';
import ComponentShowcase from '@/pages/ComponentShowcase';
import {
  SuperAdminLayout,
  TenantAdminLayout,
  TenantOperatorLayout,
  TenantUserLayout,
} from '@/components/layout';

// 역할별 레이아웃 wrapper 컴포넌트
function SuperAdminWrapper() {
  return (
    <SuperAdminLayout>
      <Outlet />
    </SuperAdminLayout>
  );
}

function TenantAdminWrapper() {
  return (
    <TenantAdminLayout>
      <Outlet />
    </TenantAdminLayout>
  );
}

function TenantOperatorWrapper() {
  return (
    <TenantOperatorLayout>
      <Outlet />
    </TenantOperatorLayout>
  );
}

function TenantUserWrapper() {
  return (
    <TenantUserLayout>
      <Outlet />
    </TenantUserLayout>
  );
}

// 임시 대시보드 컴포넌트 (개발 예정)
function DashboardPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">대시보드</h1>
      <p className="text-gray-600">대시보드 페이지 (개발 예정)</p>
    </div>
  );
}

// 랜딩 페이지 (개발 예정)
function LandingPage() {
  return <div>개발 예정</div>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Super Admin (SA) 라우트 */}
        <Route path="/sa" element={<SuperAdminWrapper />}>
          <Route index element={<DashboardPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="tenants" element={<DashboardPage />} />
          <Route path="settings" element={<DashboardPage />} />
        </Route>

        {/* Tenant Admin (TA) 라우트 */}
        <Route path="/ta" element={<TenantAdminWrapper />}>
          <Route index element={<DashboardPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="branding" element={<DashboardPage />} />
          <Route path="users" element={<DashboardPage />} />
          <Route path="settings" element={<DashboardPage />} />
        </Route>

        {/* Tenant Operator (TO) 라우트 */}
        <Route path="/to" element={<TenantOperatorWrapper />}>
          <Route index element={<DashboardPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="settings" element={<DashboardPage />} />
        </Route>

        {/* Tenant User (TU) 라우트 */}
        <Route path="/tu" element={<TenantUserWrapper />}>
          <Route index element={<DashboardPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="teaching/courses" element={<MyCoursesPage />} />
          <Route path="teaching/courses/create" element={<CourseCreatePage />} />
          <Route path="teaching/content" element={<MyContentPage />} />
          <Route path="teaching/content/create" element={<TuContentCreatePage />} />
          <Route path="catalog" element={<DashboardPage />} />
          <Route path="certifications" element={<DashboardPage />} />
          <Route path="settings" element={<DashboardPage />} />
        </Route>

        {/* 기본 경로 - 랜딩 페이지 */}
        <Route path="/" element={<LandingPage />} />

        {/* 컴포넌트 쇼케이스 (개발용) */}
        <Route path="/showcase" element={<ComponentShowcase />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
