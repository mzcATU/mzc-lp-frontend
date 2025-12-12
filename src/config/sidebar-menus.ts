/**
 * 역할별 사이드바 메뉴 설정
 *
 * 규칙:
 * - 어드민 사이드바 (SA, TA, TO): Neutral 톤만 사용
 * - 브랜드 컬러 (purple/indigo): 사이드바에 사용하지 않음
 */

import {
  LayoutDashboard,
  Building2,
  Settings,
  Megaphone,
  Database,
  Globe,
  CreditCard,
  PieChart,
  UserCog,
  Palette,
  Mail,
  FileEdit,
  Send,
  TrendingUp,
  Activity,
  FileText,
  Shield,
  Bell,
  Server,
  Layout,
  Paintbrush,
  Menu,
  Users,
  Download,
  Library,
  Search,
  FolderEdit,
  Layers,
  Calendar,
  UserCheck,
  ClipboardList,
  BookOpen,
  BookCheck,
  Home,
  Compass,
  Award,
  PenTool,
  CheckSquare,
  Briefcase,
  Target,
} from 'lucide-react';
import type { MenuItem } from '@/types/sidebar.types';

/**
 * Super Admin (SA) 메뉴
 */
export const superAdminMenuData: MenuItem[] = [
  {
    id: 'dashboard',
    label: { ko: '대시보드', en: 'Dashboard' },
    icon: LayoutDashboard,
    path: '/sa/dashboard',
  },
  {
    id: 'tenant-management',
    label: { ko: '테넌트 관리', en: 'Tenant Management' },
    icon: Building2,
    subItems: [
      { id: 'tenant-crud', label: { ko: '테넌트 생성/조회/수정/삭제', en: 'Tenant CRUD' }, icon: Building2, path: '/sa/tenants' },
      { id: 'license-billing', label: { ko: '요금제 및 라이선스 관리', en: 'License & Billing Mgmt' }, icon: CreditCard, path: '/sa/tenants/billing' },
      { id: 'overall-status', label: { ko: '전체 현황 조회', en: 'Overall Status' }, icon: PieChart, path: '/sa/tenants/status' },
    ],
  },
  {
    id: 'system-environment',
    label: { ko: '시스템 환경 관리', en: 'System Environment Setup' },
    icon: Settings,
    subItems: [
      { id: 'domain-ssl', label: { ko: '도메인 및 SSL 설정', en: 'Domain & SSL Setup' }, icon: Globe, path: '/sa/system/domain' },
      { id: 'operator-mgmt', label: { ko: '운영자 관리', en: 'Operator Management' }, icon: UserCog, path: '/sa/system/operators' },
      { id: 'global-branding', label: { ko: '글로벌 브랜딩/템플릿 기본값 설정', en: 'Global Branding/Template Defaults' }, icon: Palette, path: '/sa/system/branding' },
      { id: 'email-templates', label: { ko: '이메일 템플릿 관리', en: 'Email Template Mgmt' }, icon: Mail, path: '/sa/system/email-templates' },
    ],
  },
  {
    id: 'global-notice',
    label: { ko: '글로벌 공지 관리', en: 'Global Notice Management' },
    icon: Megaphone,
    subItems: [
      { id: 'notice-register', label: { ko: '전체 공지사항 등록 및 수정', en: 'Notice Registration & Edit' }, icon: FileEdit, path: '/sa/notices' },
      { id: 'notice-distribution', label: { ko: '공지사항 배포 관리', en: 'Notice Distribution Mgmt' }, icon: Send, path: '/sa/notices/distribution' },
    ],
  },
  {
    id: 'log-activity',
    label: { ko: '데이터 및 로그 분석', en: 'Log & Activity Analysis' },
    icon: Database,
    subItems: [
      { id: 'usage-trend', label: { ko: '전체 사용량 트렌드 및 통계', en: 'Overall Usage Trend & Stats' }, icon: TrendingUp, path: '/sa/analytics/usage' },
      { id: 'activity-analysis', label: { ko: '활동 분석', en: 'Activity Analysis' }, icon: Activity, path: '/sa/analytics/activity' },
      { id: 'log-management', label: { ko: '로그 관리', en: 'Log Management' }, icon: FileText, path: '/sa/analytics/logs' },
    ],
  },
  {
    id: 'settings',
    label: { ko: '설정', en: 'Settings' },
    icon: Settings,
    subItems: [
      { id: 'account-security', label: { ko: '계정 및 보안', en: 'Account & Security' }, icon: Shield, path: '/sa/settings/security' },
      { id: 'notification-settings', label: { ko: '알림', en: 'Notifications' }, icon: Bell, path: '/sa/settings/notifications' },
    ],
  },
];

/**
 * Tenant Admin (TA) 메뉴
 */
export const tenantAdminMenuData: MenuItem[] = [
  {
    id: 'dashboard',
    label: { ko: '대시보드', en: 'Dashboard' },
    icon: LayoutDashboard,
    path: '/ta/dashboard',
  },
  {
    id: 'system-foundation',
    label: { ko: '시스템 기반 관리', en: 'System Foundation & Licensing' },
    icon: Server,
    subItems: [
      { id: 'domain-ssl', label: { ko: '도메인 및 SSL 설정', en: 'Domain & SSL Setup' }, icon: Globe, path: '/ta/system/domain' },
      { id: 'license-billing', label: { ko: '요금제 및 라이선스 관리', en: 'License & Billing Mgmt' }, icon: CreditCard, path: '/ta/system/billing' },
    ],
  },
  {
    id: 'branding-policy',
    label: { ko: '디자인 및 정책', en: 'Branding & UI/UX Policy' },
    icon: Palette,
    subItems: [
      { id: 'layout-ui', label: { ko: '레이아웃/UI 설정 및 관리', en: 'Layout/UI Settings & Mgmt' }, icon: Layout, path: '/ta/branding/layout' },
      { id: 'branding-mgmt', label: { ko: '브랜딩 관리', en: 'Branding Management' }, icon: Paintbrush, path: '/ta/branding/design' },
      { id: 'navigation-config', label: { ko: '네비게이션 구성 관리', en: 'Navigation Config Mgmt' }, icon: Menu, path: '/ta/branding/navigation' },
    ],
  },
  {
    id: 'operator-access',
    label: { ko: '사용자 및 권한', en: 'Operator & Access Mgmt' },
    icon: Users,
    subItems: [
      { id: 'operator-mgmt', label: { ko: '운영자 관리', en: 'Operator Management' }, icon: UserCog, path: '/ta/users/operators' },
      { id: 'user-group-roles', label: { ko: '사용자 그룹 및 역할 관리', en: 'User Group & Roles Mgmt' }, icon: Users, path: '/ta/users/groups' },
      { id: 'access-permissions', label: { ko: '접근 권한 설정', en: 'Access Permissions Setup' }, icon: Shield, path: '/ta/users/permissions' },
    ],
  },
  {
    id: 'tenant-analytics',
    label: { ko: '데이터 및 통계', en: 'Tenant Activity Analytics' },
    icon: TrendingUp,
    subItems: [
      { id: 'realtime-data', label: { ko: '실시간 데이터 현황', en: 'Real-time Data Status' }, icon: Activity, path: '/ta/analytics/realtime' },
      { id: 'analytics-export', label: { ko: '통계 조회 및 내보내기', en: 'Analytics & Export' }, icon: Download, path: '/ta/analytics/export' },
      { id: 'log-history', label: { ko: '이력 분석 및 로그 관리', en: 'Log & History Analysis' }, icon: FileText, path: '/ta/analytics/logs' },
    ],
  },
  {
    id: 'settings',
    label: { ko: '설정', en: 'Settings' },
    icon: Settings,
    subItems: [
      { id: 'account-security', label: { ko: '계정 및 보안', en: 'Account & Security' }, icon: Shield, path: '/ta/settings/security' },
      { id: 'notification-settings', label: { ko: '알림', en: 'Notifications' }, icon: Bell, path: '/ta/settings/notifications' },
    ],
  },
];

/**
 * Tenant Operator (TO) 메뉴
 */
export const tenantOperatorMenuData: MenuItem[] = [
  {
    id: 'dashboard',
    label: { ko: '대시보드', en: 'Dashboard' },
    icon: LayoutDashboard,
    path: '/to/dashboard',
  },
  {
    id: 'course-catalog',
    label: { ko: '교육 과정 탐색', en: 'Course Catalog' },
    icon: Library,
    subItems: [
      { id: 'course-search', label: { ko: '과정 검색 및 상세 조회', en: 'Course Search & Details' }, icon: Search, path: '/to/courses' },
      { id: 'course-registration', label: { ko: '과정 등록/수정', en: 'Course Registration & Edit' }, icon: FolderEdit, path: '/to/courses/create' },
    ],
  },
  {
    id: 'program-management',
    label: { ko: '교육 운영 관리', en: 'Program Management' },
    icon: Layers,
    subItems: [
      { id: 'session-management', label: { ko: '차수 관리', en: 'Session Management' }, icon: Calendar, path: '/to/sessions' },
      { id: 'instructor-assignment', label: { ko: '강사 배정', en: 'Instructor Assignment' }, icon: UserCheck, path: '/to/instructors' },
    ],
  },
  {
    id: 'content-management',
    label: { ko: '콘텐츠 관리', en: 'Content Management' },
    icon: Database,
    subItems: [
      { id: 'content-pool', label: { ko: '콘텐츠 풀', en: 'Content Pool' }, icon: Database, path: '/to/content' },
      { id: 'learning-objects', label: { ko: '학습객체', en: 'Learning Objects' }, icon: Layers, path: '/to/learning-objects' },
    ],
  },
  {
    id: 'enrollment-instructor-data',
    label: { ko: '수강 및 강사 정보', en: 'Enrollment & Instructor Data' },
    icon: ClipboardList,
    subItems: [
      { id: 'sis-lookup', label: { ko: '학생 수강 정보 확인', en: 'SIS Lookup' }, icon: BookOpen, path: '/to/sis' },
      { id: 'iis-lookup', label: { ko: '강사 배정 정보 확인', en: 'IIS Lookup' }, icon: BookCheck, path: '/to/iis' },
    ],
  },
  {
    id: 'settings',
    label: { ko: '설정', en: 'Settings' },
    icon: Settings,
    subItems: [
      { id: 'account-security', label: { ko: '계정 및 보안', en: 'Account & Security' }, icon: Shield, path: '/to/settings/security' },
      { id: 'notification-settings', label: { ko: '알림', en: 'Notifications' }, icon: Bell, path: '/to/settings/notifications' },
    ],
  },
];

/**
 * Tenant User (TU) 메뉴
 */
export const tenantUserMenuData: MenuItem[] = [
  {
    id: 'home',
    label: { ko: '홈', en: 'Home' },
    icon: Home,
    path: '/tu/dashboard',
  },
  {
    id: 'my-teaching',
    label: { ko: '내 강의', en: 'My Teaching' },
    icon: Briefcase,
    subItems: [
      { id: 'my-courses', label: { ko: '내 강좌', en: 'My Courses' }, icon: BookOpen, path: '/tu/teaching/courses' },
      { id: 'my-content', label: { ko: '내 콘텐츠', en: 'My Content' }, icon: PenTool, path: '/tu/teaching/content' },
      { id: 'my-assignments', label: { ko: '내 과제', en: 'My Assignments' }, icon: CheckSquare, path: '/tu/teaching/assignments' },
    ],
  },
  {
    id: 'course-catalog',
    label: { ko: '교육 과정 탐색', en: 'Course Catalog' },
    icon: Compass,
    subItems: [
      { id: 'browse-courses', label: { ko: '과정 둘러보기', en: 'Browse Courses' }, icon: Search, path: '/tu/catalog' },
      { id: 'my-learning', label: { ko: '내 학습', en: 'My Learning' }, icon: BookOpen, path: '/tu/learning' },
    ],
  },
  {
    id: 'performance-certifications',
    label: { ko: '성과 및 인증', en: 'Performance & Certifications' },
    icon: Target,
    subItems: [
      { id: 'my-progress', label: { ko: '학습 진도', en: 'My Progress' }, icon: TrendingUp, path: '/tu/progress' },
      { id: 'certifications', label: { ko: '인증서', en: 'Certifications' }, icon: Award, path: '/tu/certifications' },
    ],
  },
  {
    id: 'settings',
    label: { ko: '설정', en: 'Settings' },
    icon: Settings,
    subItems: [
      { id: 'account-security', label: { ko: '계정 및 보안', en: 'Account & Security' }, icon: Shield, path: '/tu/settings/security' },
      { id: 'notification-settings', label: { ko: '알림', en: 'Notifications' }, icon: Bell, path: '/tu/settings/notifications' },
    ],
  },
];

/**
 * 역할별 라벨
 */
export const roleLabels = {
  superAdmin: { ko: '슈퍼 어드민', en: 'Super Admin' },
  tenantAdmin: { ko: '테넌트 어드민', en: 'Tenant Admin' },
  tenantOperator: { ko: '교육 운영자', en: 'Operator' },
  tenantUser: { ko: 'Enterprise LMS', en: 'Enterprise LMS' },
};
