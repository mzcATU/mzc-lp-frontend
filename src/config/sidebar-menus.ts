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
  },
  {
    id: 'tenant-management',
    label: { ko: '테넌트 관리', en: 'Tenant Management' },
    icon: Building2,
    subItems: [
      { id: 'tenant-crud', label: { ko: '테넌트 생성/조회/수정/삭제', en: 'Tenant CRUD' }, icon: Building2 },
      { id: 'license-billing', label: { ko: '요금제 및 라이선스 관리', en: 'License & Billing Mgmt' }, icon: CreditCard },
      { id: 'overall-status', label: { ko: '전체 현황 조회', en: 'Overall Status' }, icon: PieChart },
    ],
  },
  {
    id: 'system-environment',
    label: { ko: '시스템 환경 관리', en: 'System Environment Setup' },
    icon: Settings,
    subItems: [
      { id: 'domain-ssl', label: { ko: '도메인 및 SSL 설정', en: 'Domain & SSL Setup' }, icon: Globe },
      { id: 'operator-mgmt', label: { ko: '운영자 관리', en: 'Operator Management' }, icon: UserCog },
      { id: 'global-branding', label: { ko: '글로벌 브랜딩/템플릿 기본값 설정', en: 'Global Branding/Template Defaults' }, icon: Palette },
      { id: 'email-templates', label: { ko: '이메일 템플릿 관리', en: 'Email Template Mgmt' }, icon: Mail },
    ],
  },
  {
    id: 'global-notice',
    label: { ko: '글로벌 공지 관리', en: 'Global Notice Management' },
    icon: Megaphone,
    subItems: [
      { id: 'notice-register', label: { ko: '전체 공지사항 등록 및 수정', en: 'Notice Registration & Edit' }, icon: FileEdit },
      { id: 'notice-distribution', label: { ko: '공지사항 배포 관리', en: 'Notice Distribution Mgmt' }, icon: Send },
    ],
  },
  {
    id: 'log-activity',
    label: { ko: '데이터 및 로그 분석', en: 'Log & Activity Analysis' },
    icon: Database,
    subItems: [
      { id: 'usage-trend', label: { ko: '전체 사용량 트렌드 및 통계', en: 'Overall Usage Trend & Stats' }, icon: TrendingUp },
      { id: 'activity-analysis', label: { ko: '활동 분석', en: 'Activity Analysis' }, icon: Activity },
      { id: 'log-management', label: { ko: '로그 관리', en: 'Log Management' }, icon: FileText },
    ],
  },
  {
    id: 'settings',
    label: { ko: '설정', en: 'Settings' },
    icon: Settings,
    subItems: [
      { id: 'account-security', label: { ko: '계정 및 보안', en: 'Account & Security' }, icon: Shield },
      { id: 'notification-settings', label: { ko: '알림', en: 'Notifications' }, icon: Bell },
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
  },
  {
    id: 'system-foundation',
    label: { ko: '시스템 기반 관리', en: 'System Foundation & Licensing' },
    icon: Server,
    subItems: [
      { id: 'domain-ssl', label: { ko: '도메인 및 SSL 설정', en: 'Domain & SSL Setup' }, icon: Globe },
      { id: 'license-billing', label: { ko: '요금제 및 라이선스 관리', en: 'License & Billing Mgmt' }, icon: CreditCard },
    ],
  },
  {
    id: 'branding-policy',
    label: { ko: '디자인 및 정책', en: 'Branding & UI/UX Policy' },
    icon: Palette,
    subItems: [
      { id: 'layout-ui', label: { ko: '레이아웃/UI 설정 및 관리', en: 'Layout/UI Settings & Mgmt' }, icon: Layout },
      { id: 'branding-mgmt', label: { ko: '브랜딩 관리', en: 'Branding Management' }, icon: Paintbrush },
      { id: 'navigation-config', label: { ko: '네비게이션 구성 관리', en: 'Navigation Config Mgmt' }, icon: Menu },
    ],
  },
  {
    id: 'operator-access',
    label: { ko: '사용자 및 권한', en: 'Operator & Access Mgmt' },
    icon: Users,
    subItems: [
      { id: 'operator-mgmt', label: { ko: '운영자 관리', en: 'Operator Management' }, icon: UserCog },
      { id: 'user-group-roles', label: { ko: '사용자 그룹 및 역할 관리', en: 'User Group & Roles Mgmt' }, icon: Users },
      { id: 'access-permissions', label: { ko: '접근 권한 설정', en: 'Access Permissions Setup' }, icon: Shield },
    ],
  },
  {
    id: 'tenant-analytics',
    label: { ko: '데이터 및 통계', en: 'Tenant Activity Analytics' },
    icon: TrendingUp,
    subItems: [
      { id: 'realtime-data', label: { ko: '실시간 데이터 현황', en: 'Real-time Data Status' }, icon: Activity },
      { id: 'analytics-export', label: { ko: '통계 조회 및 내보내기', en: 'Analytics & Export' }, icon: Download },
      { id: 'log-history', label: { ko: '이력 분석 및 로그 관리', en: 'Log & History Analysis' }, icon: FileText },
    ],
  },
  {
    id: 'settings',
    label: { ko: '설정', en: 'Settings' },
    icon: Settings,
    subItems: [
      { id: 'account-security', label: { ko: '계정 및 보안', en: 'Account & Security' }, icon: Shield },
      { id: 'notification-settings', label: { ko: '알림', en: 'Notifications' }, icon: Bell },
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
  },
  {
    id: 'course-catalog',
    label: { ko: '교육 과정 탐색', en: 'Course Catalog' },
    icon: Library,
    subItems: [
      { id: 'course-search', label: { ko: '과정 검색 및 상세 조회', en: 'Course Search & Details' }, icon: Search },
      { id: 'course-registration', label: { ko: '과정 등록/수정', en: 'Course Registration & Edit' }, icon: FolderEdit },
    ],
  },
  {
    id: 'program-management',
    label: { ko: '교육 운영 관리', en: 'Program Management' },
    icon: Layers,
    subItems: [
      { id: 'session-management', label: { ko: '차수 관리', en: 'Session Management' }, icon: Calendar },
      { id: 'instructor-assignment', label: { ko: '강사 배정', en: 'Instructor Assignment' }, icon: UserCheck },
    ],
  },
  {
    id: 'enrollment-instructor-data',
    label: { ko: '수강 및 강사 정보', en: 'Enrollment & Instructor Data' },
    icon: ClipboardList,
    subItems: [
      { id: 'sis-lookup', label: { ko: '학생 수강 정보 확인', en: 'SIS Lookup' }, icon: BookOpen },
      { id: 'iis-lookup', label: { ko: '강사 배정 정보 확인', en: 'IIS Lookup' }, icon: BookCheck },
    ],
  },
  {
    id: 'settings',
    label: { ko: '설정', en: 'Settings' },
    icon: Settings,
    subItems: [
      { id: 'account-security', label: { ko: '계정 및 보안', en: 'Account & Security' }, icon: Shield },
      { id: 'notification-settings', label: { ko: '알림', en: 'Notifications' }, icon: Bell },
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
  },
  {
    id: 'my-teaching',
    label: { ko: '나의 교수 활동', en: 'My Teaching' },
    icon: BookOpen,
    subItems: [
      { id: 'my-courses', label: { ko: '내 강의', en: 'My Courses' }, icon: Activity },
      { id: 'content-creation', label: { ko: '콘텐츠 제작 및 관리', en: 'Content Creation & Mgmt' }, icon: PenTool },
      { id: 'grading-evaluation', label: { ko: '채점 및 평가 관리', en: 'Grading & Evaluation' }, icon: CheckSquare },
    ],
  },
  {
    id: 'course-catalog',
    label: { ko: '교육 과정 탐색', en: 'Course Catalog' },
    icon: Compass,
    subItems: [
      { id: 'full-library', label: { ko: '전체 과정 라이브러리', en: 'Full Course Library' }, icon: Library },
      { id: 'courses-by-role', label: { ko: '직무별 과정', en: 'Courses by Role' }, icon: Briefcase },
      { id: 'courses-by-skill', label: { ko: '기술별 과정', en: 'Courses by Skill' }, icon: Target },
    ],
  },
  {
    id: 'performance-certifications',
    label: { ko: '성과 및 인증', en: 'Performance & Certifications' },
    icon: Award,
    subItems: [
      { id: 'my-competency', label: { ko: '나의 교수 역량', en: 'My Teaching Competency' }, icon: TrendingUp },
      { id: 'my-certifications', label: { ko: '나의 강사 인증', en: 'My Instructor Certifications' }, icon: Shield },
    ],
  },
  {
    id: 'settings',
    label: { ko: '설정', en: 'Settings' },
    icon: Settings,
    subItems: [
      { id: 'account-security', label: { ko: '계정 및 보안', en: 'Account & Security' }, icon: Shield },
      { id: 'language-timezone', label: { ko: '언어 및 시간대 설정', en: 'Language & Timezone' }, icon: Globe },
      { id: 'notification-settings', label: { ko: '알림', en: 'Notifications' }, icon: Bell },
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
