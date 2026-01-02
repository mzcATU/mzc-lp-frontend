import { Route, Outlet } from 'react-router-dom';
import { TenantOperatorLayout } from '@/components/layout';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import {
  SettingsPage,
  SettingsSecurityPage,
  SettingsNotificationsPage,
  SettingsAppearancePage,
} from '@/pages/common';
import { BannerManagementPage } from '@/pages/b2b-social/to';
import { DashboardPage, PlaceholderPage } from './pages';

function B2BSocialToWrapper() {
  return (
    <ProtectedRoute allowedRoles={['OPERATOR', 'TENANT_ADMIN']}>
      <TenantOperatorLayout>
        <Outlet />
      </TenantOperatorLayout>
    </ProtectedRoute>
  );
}

/**
 * B2B 소셜러닝 TO (운영자) 라우트
 *
 * 경로: /tu/b2b-social/to/*
 * - 대시보드, 배너 관리, 콘텐츠 관리, 수강생 관리 등
 */
export const b2bSocialToRoutes = (
  <Route path="/tu/b2b-social/to" element={<B2BSocialToWrapper />}>
    <Route index element={<DashboardPage />} />
    <Route path="dashboard" element={<DashboardPage />} />

    {/* 홈 화면 관리 */}
    <Route path="banners" element={<BannerManagementPage />} />

    {/* 콘텐츠 관리 */}
    <Route path="content" element={<PlaceholderPage title="콘텐츠 관리" />} />
    <Route path="content/upload" element={<PlaceholderPage title="콘텐츠 업로드" />} />

    {/* 수강생 관리 */}
    <Route path="students" element={<PlaceholderPage title="수강생 관리" />} />
    <Route path="enrollments" element={<PlaceholderPage title="수강 신청 관리" />} />

    {/* 교육 운영 */}
    <Route path="courses" element={<PlaceholderPage title="교육 과정 관리" />} />
    <Route path="mandatory" element={<PlaceholderPage title="필수 교육 관리" />} />

    {/* 통계 */}
    <Route path="analytics" element={<PlaceholderPage title="학습 통계" />} />

    {/* 설정 */}
    <Route path="settings" element={<SettingsPage />} />
    <Route path="settings/security" element={<SettingsSecurityPage />} />
    <Route path="settings/notifications" element={<SettingsNotificationsPage />} />
    <Route path="settings/appearance" element={<SettingsAppearancePage />} />
  </Route>
);
