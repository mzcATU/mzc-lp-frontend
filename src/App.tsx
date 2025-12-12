import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { CourseListPage, CourseDetailPage, CourseCreatePage } from '@/pages/courses';
import { ContentPoolPage, ContentUploadPage } from '@/pages/content';
import { LearningObjectsPage } from '@/pages/learning';
import { MyCoursesPage, MyContentPage, CourseCreatePage as TuCourseCreatePage } from '@/pages/tu';
import ComponentShowcase from '@/pages/ComponentShowcase';
import {
  SuperAdminLayout,
  TenantAdminLayout,
  TenantOperatorLayout,
  TenantUserLayout,
} from '@/components/layout';
import { designTokens } from '@/styles/design-tokens';

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
    <div
      className="p-8 min-h-full"
      style={{ backgroundColor: designTokens.bg.default }}
    >
      <header className="flex items-center justify-between mb-6">
        <h1
          className="text-2xl font-semibold"
          style={{ color: designTokens.text.primary }}
        >
          대시보드
        </h1>
      </header>
      <div
        className="rounded-lg border-2 border-dashed p-12 text-center"
        style={{ borderColor: designTokens.bg.border }}
      >
        <p className="text-lg mb-2" style={{ color: designTokens.text.placeholder }}>
          🚧 개발 예정
        </p>
        <p
          className="text-sm"
          style={{ color: designTokens.text.placeholder }}
        >
          대시보드 기능이 곧 추가될 예정입니다.
        </p>
      </div>
    </div>
  );
}

// 공통 Placeholder 페이지 컴포넌트
function PlaceholderPage({ title }: { title: string }) {
  return (
    <div
      className="p-8 min-h-full"
      style={{ backgroundColor: designTokens.bg.default }}
    >
      <header className="flex items-center justify-between mb-6">
        <h1
          className="text-2xl font-semibold"
          style={{ color: designTokens.text.primary }}
        >
          {title}
        </h1>
      </header>
      <div
        className="rounded-lg border-2 border-dashed p-12 text-center"
        style={{ borderColor: designTokens.bg.border }}
      >
        <p className="text-lg mb-2" style={{ color: designTokens.text.placeholder }}>
          🚧 개발 예정
        </p>
        <p
          className="text-sm"
          style={{ color: designTokens.text.placeholder }}
        >
          {title} 기능이 곧 추가될 예정입니다.
        </p>
      </div>
    </div>
  );
}

// 랜딩 페이지 (개발 예정)
function LandingPage() {
  return (
    <div
      className="p-8 min-h-screen"
      style={{ backgroundColor: designTokens.bg.default }}
    >
      <header className="flex items-center justify-between mb-6">
        <h1
          className="text-2xl font-semibold"
          style={{ color: designTokens.text.primary }}
        >
          Learning Hub
        </h1>
      </header>
      <div
        className="rounded-lg border-2 border-dashed p-12 text-center"
        style={{ borderColor: designTokens.bg.border }}
      >
        <p className="text-lg mb-2" style={{ color: designTokens.text.placeholder }}>
          🚧 개발 예정
        </p>
        <p
          className="text-sm"
          style={{ color: designTokens.text.placeholder }}
        >
          랜딩 페이지가 곧 추가될 예정입니다.
        </p>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Super Admin (SA) 라우트 */}
        <Route path="/sa" element={<SuperAdminWrapper />}>
          <Route index element={<DashboardPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          {/* 테넌트 관리 */}
          <Route path="tenants" element={<PlaceholderPage title="테넌트 관리" />} />
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
          <Route path="settings" element={<PlaceholderPage title="설정" />} />
          <Route path="settings/security" element={<PlaceholderPage title="계정 및 보안" />} />
          <Route path="settings/notifications" element={<PlaceholderPage title="알림 설정" />} />
        </Route>

        {/* Tenant Admin (TA) 라우트 */}
        <Route path="/ta" element={<TenantAdminWrapper />}>
          <Route index element={<DashboardPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          {/* 시스템 기반 관리 */}
          <Route path="system/domain" element={<PlaceholderPage title="도메인 및 SSL 설정" />} />
          <Route path="system/billing" element={<PlaceholderPage title="요금제 및 라이선스 관리" />} />
          {/* 디자인 및 정책 */}
          <Route path="branding/layout" element={<PlaceholderPage title="레이아웃/UI 설정" />} />
          <Route path="branding/design" element={<PlaceholderPage title="브랜딩 관리" />} />
          <Route path="branding/navigation" element={<PlaceholderPage title="네비게이션 구성 관리" />} />
          {/* 사용자 및 권한 */}
          <Route path="users/operators" element={<PlaceholderPage title="운영자 관리" />} />
          <Route path="users/groups" element={<PlaceholderPage title="사용자 그룹 및 역할 관리" />} />
          <Route path="users/permissions" element={<PlaceholderPage title="접근 권한 설정" />} />
          {/* 데이터 및 통계 */}
          <Route path="analytics/realtime" element={<PlaceholderPage title="실시간 데이터 현황" />} />
          <Route path="analytics/export" element={<PlaceholderPage title="통계 조회 및 내보내기" />} />
          <Route path="analytics/logs" element={<PlaceholderPage title="이력 분석 및 로그 관리" />} />
          {/* 설정 */}
          <Route path="settings" element={<PlaceholderPage title="설정" />} />
          <Route path="settings/security" element={<PlaceholderPage title="계정 및 보안" />} />
          <Route path="settings/notifications" element={<PlaceholderPage title="알림 설정" />} />
        </Route>

        {/* Tenant Operator (TO) 라우트 */}
        <Route path="/to" element={<TenantOperatorWrapper />}>
          <Route index element={<DashboardPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          {/* 교육 과정 탐색 */}
          <Route path="courses" element={<CourseListPage />} />
          <Route path="courses/create" element={<CourseCreatePage />} />
          <Route path="courses/:id" element={<CourseDetailPage />} />
          {/* 교육 운영 관리 */}
          <Route path="sessions" element={<PlaceholderPage title="차수 관리" />} />
          <Route path="instructors" element={<PlaceholderPage title="강사 배정" />} />
          {/* 콘텐츠 관리 */}
          <Route path="content" element={<ContentPoolPage />} />
          <Route path="content/upload" element={<ContentUploadPage />} />
          <Route path="learning-objects" element={<LearningObjectsPage />} />
          {/* 수강 및 강사 정보 */}
          <Route path="sis" element={<PlaceholderPage title="학생 수강 정보 확인" />} />
          <Route path="iis" element={<PlaceholderPage title="강사 배정 정보 확인" />} />
          {/* 설정 */}
          <Route path="settings" element={<PlaceholderPage title="설정" />} />
          <Route path="settings/security" element={<PlaceholderPage title="계정 및 보안" />} />
          <Route path="settings/notifications" element={<PlaceholderPage title="알림 설정" />} />
        </Route>

        {/* Tenant User (TU) 라우트 */}
        <Route path="/tu" element={<TenantUserWrapper />}>
          <Route index element={<DashboardPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          {/* 내 강의 */}
          <Route path="teaching/courses" element={<MyCoursesPage />} />
          <Route path="teaching/courses/create" element={<TuCourseCreatePage />} />
          <Route path="teaching/content" element={<MyContentPage />} />
          <Route path="teaching/assignments" element={<PlaceholderPage title="내 과제" />} />
          {/* 교육 과정 탐색 */}
          <Route path="catalog" element={<PlaceholderPage title="과정 둘러보기" />} />
          <Route path="learning" element={<PlaceholderPage title="내 학습" />} />
          {/* 성과 및 인증 */}
          <Route path="progress" element={<PlaceholderPage title="학습 진도" />} />
          <Route path="certifications" element={<PlaceholderPage title="인증서" />} />
          {/* 설정 */}
          <Route path="settings" element={<PlaceholderPage title="설정" />} />
          <Route path="settings/security" element={<PlaceholderPage title="계정 및 보안" />} />
          <Route path="settings/notifications" element={<PlaceholderPage title="알림 설정" />} />
        </Route>

        {/* 기존 라우트 (레거시, 추후 제거 예정) */}
        <Route path="/courses" element={<CourseListPage />} />
        <Route path="/courses/create" element={<CourseCreatePage />} />
        <Route path="/courses/:id" element={<CourseDetailPage />} />
        <Route path="/content" element={<ContentPoolPage />} />
        <Route path="/content/upload" element={<ContentUploadPage />} />
        <Route path="/learning-objects" element={<LearningObjectsPage />} />

        {/* 기본 경로 - 랜딩 페이지 */}
        <Route path="/" element={<LandingPage />} />

        {/* 컴포넌트 쇼케이스 (개발용) */}
        <Route path="/showcase" element={<ComponentShowcase />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
