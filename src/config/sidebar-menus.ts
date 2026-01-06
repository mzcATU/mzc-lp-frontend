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
  BookOpen,
  BookCheck,
  Home,
  Award,
  PenTool,
  CheckSquare,
  Briefcase,
  MessageSquare,
  Package,
  Image,
  Zap,
  FolderTree,
  Map,
} from 'lucide-react';
import type { MenuItem } from '@/types';

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
    path: '/sa/settings',
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
      { id: 'banner-mgmt', label: { ko: '배너 관리', en: 'Banner Management' }, icon: Image, path: '/ta/branding/banners' },
    ],
  },
  {
    id: 'operator-access',
    label: { ko: '사용자 및 권한', en: 'User & Access Management' },
    icon: Users,
    subItems: [
      { id: 'user-mgmt', label: { ko: '사용자 관리', en: 'User Management' }, icon: Users, path: '/ta/users' },
      { id: 'department-mgmt', label: { ko: '부서 관리', en: 'Department Management' }, icon: FolderTree, path: '/ta/users/departments' },
      { id: 'employee-mgmt', label: { ko: '임직원 관리', en: 'Employee Management' }, icon: Building2, path: '/ta/users/employees' },
      { id: 'user-group-roles', label: { ko: '그룹 및 역할', en: 'Groups & Roles' }, icon: Users, path: '/ta/users/groups' },
      { id: 'access-permissions', label: { ko: '접근 권한', en: 'Access Permissions' }, icon: Shield, path: '/ta/users/permissions' },
    ],
  },
  {
    id: 'automation',
    label: { ko: '자동화', en: 'Automation' },
    icon: Zap,
    subItems: [
      { id: 'auto-enrollment', label: { ko: '자동 입과 규칙', en: 'Auto Enrollment' }, icon: Zap, path: '/ta/automation/rules' },
      { id: 'member-pools', label: { ko: '입과 그룹 관리', en: 'Enrollment Group Management' }, icon: Users, path: '/ta/automation/pools' },
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
    path: '/ta/settings',
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
      { id: 'course-registration', label: { ko: '과정 등록/수정', en: 'Course Registration & Edit' }, icon: FolderEdit, path: '/to/courses/pending' },
    ],
  },
  {
    id: 'program-management',
    label: { ko: '교육 운영 관리', en: 'Program Management' },
    icon: Layers,
    subItems: [
      { id: 'time-management', label: { ko: '차수 운영', en: 'Course Time Operations' }, icon: Calendar, path: '/to/times' },
      { id: 'instructor-management', label: { ko: '강사 배정 관리', en: 'Instructor Assignment' }, icon: UserCheck, path: '/to/instructors' },
    ],
  },
  // TODO: TO 콘텐츠 관리 기능 - 개발 예정으로 임시 숨김
  // {
  //   id: 'content-management',
  //   label: { ko: '콘텐츠 관리', en: 'Content Management' },
  //   icon: Database,
  //   subItems: [
  //     { id: 'content-pool', label: { ko: '콘텐츠 풀', en: 'Content Pool' }, icon: Database, path: '/to/content' },
  //     { id: 'learning-objects', label: { ko: '학습객체', en: 'Learning Objects' }, icon: Layers, path: '/to/learning-objects' },
  //   ],
  // },
  {
    id: 'user-management',
    label: { ko: '사용자 관리', en: 'User Management' },
    icon: Users,
    path: '/to/users',
  },
  {
    id: 'settings',
    label: { ko: '설정', en: 'Settings' },
    icon: Settings,
    path: '/to/settings',
  },
];

/**
 * Tenant User (TU) 메뉴 - 강사/콘텐츠 제작자 공간
 */
export const tenantUserMenuData: MenuItem[] = [
  {
    id: 'dashboard',
    label: { ko: '대시보드', en: 'Dashboard' },
    icon: LayoutDashboard,
    path: '/tu/dashboard',
  },
  {
    id: 'my-teaching',
    label: { ko: '내 강의', en: 'My Teaching' },
    icon: Briefcase,
    subItems: [
      { id: 'my-courses', label: { ko: '강의 디자인', en: 'Course Design' }, icon: BookOpen, path: '/tu/teaching/courses' },
      { id: 'my-programs', label: { ko: '강의 개설', en: 'Course Creation' }, icon: Package, path: '/tu/teaching/programs' },
      { id: 'my-assignments', label: { ko: '강의 관리', en: 'Course Management' }, icon: CheckSquare, path: '/tu/teaching/assignments' },
      { id: 'my-content', label: { ko: '내 콘텐츠', en: 'My Content' }, icon: PenTool, path: '/tu/teaching/content' },
      { id: 'my-roadmaps', label: { ko: '로드맵', en: 'Roadmaps' }, icon: Map, path: '/tu/teaching/roadmaps', roles: ['DESIGNER', 'OPERATOR', 'TENANT_ADMIN'] },
    ],
  },
  // '과정 둘러보기' 메뉴 제거 - 모드 스위처의 '학습자 모드'로 대체
];

/**
 * MyPage 메뉴 (일반 사용자용 - 학습자 개인 공간)
 */
export const myPageMenuData: MenuItem[] = [
  {
    id: 'mypage-home',
    label: { ko: '마이페이지', en: 'My Page' },
    icon: Home,
    path: '/tu/b2c/mypage',
  },
  {
    id: 'my-enrollments',
    label: { ko: '내 수강 강의', en: 'My Enrollments' },
    icon: BookOpen,
    subItems: [
      { id: 'enrolled-courses', label: { ko: '수강 중인 강의', en: 'Enrolled Courses' }, icon: BookOpen, path: '/tu/b2c/mypage/learning' },
      { id: 'completed-courses', label: { ko: '완료한 강의', en: 'Completed Courses' }, icon: BookCheck, path: '/tu/b2c/mypage/completed' },
      { id: 'certifications', label: { ko: '인증서', en: 'Certifications' }, icon: Award, path: '/tu/b2c/mypage/certifications' },
    ],
  },
  {
    id: 'my-teaching',
    label: { ko: '내 강의 관리', en: 'My Teaching' },
    icon: Briefcase,
    subItems: [
      { id: 'my-courses', label: { ko: '내 강의', en: 'My Courses' }, icon: BookOpen, path: '/tu/b2c/mypage/teaching' },
      { id: 'create-course', label: { ko: '강의 개설하기', en: 'Create Course' }, icon: FolderEdit, path: '/tu/teaching/courses/create', roles: ['USER', 'DESIGNER'] },
      { id: 'teaching-stats', label: { ko: '내 강의 통계', en: 'Teaching Stats' }, icon: TrendingUp, path: '/tu/b2c/mypage/teaching/stats' },
    ],
  },
  {
    id: 'my-community',
    label: { ko: '커뮤니티 활동', en: 'Community Activity' },
    icon: MessageSquare,
    subItems: [
      { id: 'my-posts', label: { ko: '내 게시글', en: 'My Posts' }, icon: FileEdit, path: '/tu/b2c/mypage/posts' },
      { id: 'my-comments', label: { ko: '내 댓글', en: 'My Comments' }, icon: MessageSquare, path: '/tu/b2c/mypage/comments' },
    ],
  },
  {
    id: 'mypage-settings',
    label: { ko: '설정', en: 'Settings' },
    icon: Settings,
    subItems: [
      { id: 'profile-security', label: { ko: '프로필 및 보안', en: 'Profile & Security' }, icon: Shield, path: '/tu/b2c/mypage/settings/security' },
      { id: 'notifications', label: { ko: '알림', en: 'Notifications' }, icon: Megaphone, path: '/tu/b2c/mypage/settings/notifications' },
      { id: 'language-region', label: { ko: '언어 및 지역', en: 'Language & Region' }, icon: Globe, path: '/tu/b2c/mypage/settings/language' },
    ],
  },
];

/**
 * 역할별 라벨
 * - SA: 시스템 관리 (전체 플랫폼)
 * - TA: 테넌트 관리 (기업 설정)
 * - TO: 교육 운영 (과정/차수 관리)
 * - TU: 모드 스위처로 대체 (강사/학습자)
 */
export const roleLabels = {
  superAdmin: { ko: '시스템 관리', en: 'System Admin' },
  tenantAdmin: { ko: '테넌트 관리', en: 'Tenant Admin' },
  tenantOperator: { ko: '교육 운영', en: 'Operations' },
  tenantUser: { ko: '강사 센터', en: 'Instructor Hub' },
  myPage: { ko: '마이페이지', en: 'My Page' },
};
