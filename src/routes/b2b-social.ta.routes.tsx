import { Route, Outlet } from 'react-router-dom';
import { TenantAdminLayout } from '@/components/layout';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import {
  SettingsPage,
  SettingsSecurityPage,
  SettingsNotificationsPage,
  SettingsAppearancePage,
} from '@/pages/common';
import { DashboardPage, PlaceholderPage } from './pages';

function B2BSocialTaWrapper() {
  return (
    <ProtectedRoute allowedRoles={['TENANT_ADMIN']}>
      <TenantAdminLayout>
        <Outlet />
      </TenantAdminLayout>
    </ProtectedRoute>
  );
}

/**
 * B2B 소셜러닝 TA (관리자) 라우트
 *
 * 경로: /b2b-social/ta/*
 * - 대시보드, 사용자 관리, 권한 관리, 시스템 설정 등
 */
export const b2bSocialTaRoutes = (
  <Route path="/b2b-social/ta" element={<B2BSocialTaWrapper />}>
    <Route index element={<DashboardPage />} />
    <Route path="dashboard" element={<DashboardPage />} />

    {/* 사용자 관리 */}
    <Route path="users" element={<PlaceholderPage title="사용자 관리" />} />
    <Route path="users/groups" element={<PlaceholderPage title="그룹/부서 관리" />} />
    <Route path="users/permissions" element={<PlaceholderPage title="권한 관리" />} />

    {/* 콘텐츠 정책 */}
    <Route path="content/policy" element={<PlaceholderPage title="콘텐츠 정책" />} />
    <Route path="content/categories" element={<PlaceholderPage title="카테고리 관리" />} />

    {/* 교육 정책 */}
    <Route path="education/mandatory" element={<PlaceholderPage title="필수 교육 정책" />} />
    <Route path="education/compliance" element={<PlaceholderPage title="컴플라이언스 설정" />} />

    {/* 브랜딩 */}
    <Route path="branding/design" element={<PlaceholderPage title="디자인 설정" />} />
    <Route path="branding/navigation" element={<PlaceholderPage title="메뉴 설정" />} />

    {/* 분석 및 보고서 */}
    <Route path="analytics/overview" element={<PlaceholderPage title="통계 개요" />} />
    <Route path="analytics/reports" element={<PlaceholderPage title="보고서" />} />
    <Route path="analytics/export" element={<PlaceholderPage title="데이터 내보내기" />} />

    {/* 설정 */}
    <Route path="settings" element={<SettingsPage />} />
    <Route path="settings/security" element={<SettingsSecurityPage />} />
    <Route path="settings/notifications" element={<SettingsNotificationsPage />} />
    <Route path="settings/appearance" element={<SettingsAppearancePage />} />
  </Route>
);
