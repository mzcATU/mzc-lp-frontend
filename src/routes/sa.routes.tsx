import { Route, Outlet } from 'react-router-dom';
import { SuperAdminLayout } from '@/components/layout';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import {
  SettingsPage,
  SettingsSecurityPage,
  SettingsNotificationsPage,
  SettingsAppearancePage,
} from '@/pages/common';
import { DashboardPage, TenantsPage } from '@/pages/sa';
import { PlaceholderPage } from './pages';

function SuperAdminWrapper() {
  return (
    <ProtectedRoute allowedRoles={['SYSTEM_ADMIN']}>
      <SuperAdminLayout>
        <Outlet />
      </SuperAdminLayout>
    </ProtectedRoute>
  );
}

export const saRoutes = (
  <Route path="/sa" element={<SuperAdminWrapper />}>
    <Route index element={<DashboardPage />} />
    <Route path="dashboard" element={<DashboardPage />} />
    {/* 테넌트 관리 */}
    <Route path="tenants" element={<TenantsPage />} />
    <Route path="tenants/billing" element={<PlaceholderPage title="요금제 및 라이선스 관리" />} />
    <Route path="tenants/status" element={<PlaceholderPage title="전체 현황 조회" />} />
    {/* 시스템 환경 관리 */}
    <Route path="system/domain" element={<PlaceholderPage title="도메인 및 SSL 설정" />} />
    <Route path="system/operators" element={<PlaceholderPage title="운영자 관리" />} />
    <Route path="system/branding" element={<PlaceholderPage title="글로벌 브랜딩 설정" />} />
    <Route path="system/email-templates" element={<PlaceholderPage title="이메일 템플릿 관리" />} />
    {/* 글로벌 공지 관리 */}
    <Route path="notices" element={<PlaceholderPage title="공지사항 관리" />} />
    <Route path="notices/distribution" element={<PlaceholderPage title="공지사항 배포 관리" />} />
    {/* 데이터 및 로그 분석 */}
    <Route path="analytics/usage" element={<PlaceholderPage title="사용량 트렌드 및 통계" />} />
    <Route path="analytics/activity" element={<PlaceholderPage title="활동 분석" />} />
    <Route path="analytics/logs" element={<PlaceholderPage title="로그 관리" />} />
    {/* 설정 */}
    <Route path="settings" element={<SettingsPage />} />
    <Route path="settings/security" element={<SettingsSecurityPage />} />
    <Route path="settings/notifications" element={<SettingsNotificationsPage />} />
    <Route path="settings/appearance" element={<SettingsAppearancePage />} />
    <Route path="settings/system-settings" element={<PlaceholderPage title="시스템 설정" />} />
    <Route path="settings/tenant-defaults" element={<PlaceholderPage title="테넌트 기본값" />} />
  </Route>
);
