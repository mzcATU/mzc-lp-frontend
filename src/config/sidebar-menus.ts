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
  UserCog,
  Palette,
  FileEdit,
  TrendingUp,
  Shield,
  Server,
  Users,
  Library,
  FolderEdit,
  Layers,
  Calendar,
  UserCheck,
  BookOpen,
  BookCheck,
  Home,
  Award,
  PenTool,
  Briefcase,
  MessageSquare,
  Zap,
  Map,
  UserSquare2,
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
    path: '/sa/tenants',
  },
  {
    id: 'system-environment',
    label: { ko: '시스템 환경 관리', en: 'System Environment Setup' },
    icon: Settings,
    subItems: [
      { id: 'domain-management', label: { ko: '도메인 관리', en: 'Domain Management' }, icon: Globe, path: '/sa/system/domain' },
      { id: 'operator-mgmt', label: { ko: '운영자 관리', en: 'Operator Management' }, icon: UserCog, path: '/sa/system/operators' },
      { id: 'global-branding', label: { ko: '브랜딩 설정', en: 'Branding Settings' }, icon: Palette, path: '/sa/system/branding' },
    ],
  },
  {
    id: 'global-notice',
    label: { ko: '글로벌 공지 관리', en: 'Global Notice Management' },
    icon: Megaphone,
    path: '/sa/notices',
  },
  {
    id: 'analytics',
    label: { ko: '데이터 및 로그 분석', en: 'Analytics & Logs' },
    icon: Database,
    path: '/sa/analytics',
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
    label: { ko: '도메인 관리', en: 'Domain Management' },
    icon: Server,
    path: '/ta/system/domain',
  },
  {
    id: 'branding-policy',
    label: { ko: '브랜딩 설정', en: 'Branding Settings' },
    icon: Palette,
    path: '/ta/branding',
  },
  {
    id: 'operator-access',
    label: { ko: '사용자 및 부서', en: 'Users & Departments' },
    icon: Users,
    path: '/ta/users',
  },
  {
    id: 'tenant-analytics',
    label: { ko: '데이터 및 통계', en: 'Data & Analytics' },
    icon: TrendingUp,
    path: '/ta/analytics',
  },
  {
    id: 'notice-management',
    label: { ko: '공지 및 알림 관리', en: 'Notice & Notification' },
    icon: Megaphone,
    path: '/ta/notices',
  },
  {
    id: 'settings',
    label: { ko: '설정', en: 'Settings' },
    icon: Settings,
    path: '/ta/settings',
  },
];

/**
 * Course Operator (CO) 메뉴
 */
export const courseOperatorMenuData: MenuItem[] = [
  {
    id: 'dashboard',
    label: { ko: '대시보드', en: 'Dashboard' },
    icon: LayoutDashboard,
    path: '/co/dashboard',
  },
  {
    id: 'course-catalog',
    label: { ko: '과정 탐색', en: 'Courses' },
    icon: Library,
    path: '/co/courses',
  },
  {
    id: 'program-management',
    label: { ko: '운영 관리', en: 'Operations' },
    icon: Layers,
    subItems: [
      { id: 'time-management', label: { ko: '차수 운영', en: 'Course Time Operations' }, icon: Calendar, path: '/co/times' },
      { id: 'student-management', label: { ko: '수강생 관리', en: 'Student Management' }, icon: Users, path: '/co/users' },
      { id: 'instructor-management', label: { ko: '강사 관리', en: 'Instructor Management' }, icon: UserCheck, path: '/co/instructors' },
    ],
  },
  // TODO: CO 콘텐츠 관리 기능 - 개발 예정으로 임시 숨김
  // {
  //   id: 'content-management',
  //   label: { ko: '콘텐츠 관리', en: 'Content Management' },
  //   icon: Database,
  //   subItems: [
  //     { id: 'content-pool', label: { ko: '콘텐츠 풀', en: 'Content Pool' }, icon: Database, path: '/co/content' },
  //     { id: 'learning-objects', label: { ko: '학습객체', en: 'Learning Objects' }, icon: Layers, path: '/co/learning-objects' },
  //   ],
  // },
  {
    id: 'student-group-management',
    label: { ko: '수강생 그룹 관리', en: 'Student Group Management' },
    icon: UserSquare2,
    subItems: [
      { id: 'member-pools', label: { ko: '회원 풀 관리', en: 'Member Pool Management' }, icon: Users, path: '/co/member-pools' },
      { id: 'auto-enrollment', label: { ko: '자동 입과 규칙', en: 'Auto Enrollment Rules' }, icon: Zap, path: '/co/auto-enrollment-rules' },
    ],
  },
  {
    id: 'notice-management',
    label: { ko: '공지사항 관리', en: 'Notice Management' },
    icon: Megaphone,
    path: '/co/notices',
  },
  {
    id: 'settings',
    label: { ko: '설정', en: 'Settings' },
    icon: Settings,
    path: '/co/settings',
  },
];

/**
 * Tenant User (TU) 메뉴 - 강사/콘텐츠 제작자 공간
 *
 * 역할별 메뉴 구성:
 * - 강사(INSTRUCTOR): 대시보드 + 내 교수 관리
 * - 디자이너(DESIGNER): 내 과정(과정 관리) + 내 콘텐츠 (대시보드 없음)
 */
export const tenantUserMenuData: MenuItem[] = [
  {
    id: 'dashboard',
    label: { ko: '대시보드', en: 'Dashboard' },
    icon: LayoutDashboard,
    path: '/tu/dashboard',
    roles: ['DESIGNER', 'INSTRUCTOR', 'OPERATOR', 'TENANT_ADMIN'],
  },
  {
    id: 'my-courses',
    label: { ko: '내 과정 관리', en: 'My Courses' },
    icon: BookOpen,
    subItems: [
      { id: 'course-management', label: { ko: '과정 설계', en: 'Course Design' }, icon: FolderEdit, path: '/tu/teaching/courses' },
      { id: 'my-roadmaps', label: { ko: '로드맵', en: 'Roadmaps' }, icon: Map, path: '/tu/teaching/roadmaps', roles: ['DESIGNER'] },
    ],
    roles: ['DESIGNER', 'OPERATOR', 'TENANT_ADMIN'],
  },
  {
    id: 'my-teaching',
    label: { ko: '내 교수 관리', en: 'My Teaching' },
    icon: Briefcase,
    path: '/tu/teaching/assignments',
    roles: ['INSTRUCTOR', 'OPERATOR', 'TENANT_ADMIN'],
  },
  {
    id: 'my-content',
    label: { ko: '내 콘텐츠', en: 'My Content' },
    icon: PenTool,
    path: '/tu/teaching/content',
    roles: ['DESIGNER', 'OPERATOR', 'TENANT_ADMIN'],
  },
  // '과정 둘러보기' 메뉴 제거 - 모드 스위처의 '학습자 모드'로 대체
];

/**
 * MyPage 메뉴 (B2C 일반 사용자용 - 학습자 개인 공간)
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
      { id: 'certificates', label: { ko: '수료증', en: 'Certificates' }, icon: Award, path: '/tu/b2c/mypage/certificates' },
    ],
  },
  {
    id: 'my-teaching',
    label: { ko: '내 강의 관리', en: 'My Teaching' },
    icon: Briefcase,
    subItems: [
      { id: 'my-courses', label: { ko: '내 강의', en: 'My Courses' }, icon: BookOpen, path: '/tu/b2c/mypage/teaching' },
      { id: 'create-course', label: { ko: '강의 디자인 시작하기', en: 'Start Course Design' }, icon: FolderEdit, path: '/tu/teaching/courses/create', roles: ['USER', 'DESIGNER'] },
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
      { id: 'language-region', label: { ko: '언어 및 지역', en: 'Language & Region' }, icon: Globe, path: '/tu/b2c/mypage/settings/language' },
      { id: 'notifications', label: { ko: '알림', en: 'Notifications' }, icon: Megaphone, path: '/tu/b2c/mypage/settings/notifications' },
    ],
  },
];

/**
 * B2B MyPage 메뉴 (기업용 학습자 공간)
 *
 * B2C와의 차이점:
 * - 커뮤니티 → 내 활동 (내 댓글만, 레벨 1)
 * - 설정 → 카드 형식 페이지로 이동 (프로필/환경설정)
 */
export const b2bMyPageMenuData: MenuItem[] = [
  {
    id: 'mypage-home',
    label: { ko: '홈', en: 'Home' },
    icon: Home,
    path: '/tu/b2b/mypage',
  },
  {
    id: 'my-enrollments',
    label: { ko: '내 수강 강의', en: 'My Enrollments' },
    icon: BookOpen,
    subItems: [
      { id: 'enrolled-courses', label: { ko: '수강 중인 강의', en: 'Enrolled Courses' }, icon: BookOpen, path: '/tu/b2b/mypage/learning' },
      { id: 'completed-courses', label: { ko: '완료한 강의', en: 'Completed Courses' }, icon: BookCheck, path: '/tu/b2b/mypage/completed' },
      { id: 'certificates', label: { ko: '수료증', en: 'Certificates' }, icon: Award, path: '/tu/b2b/mypage/certificates' },
    ],
  },
  {
    id: 'my-teaching',
    label: { ko: '내 강의 관리', en: 'My Teaching' },
    icon: Briefcase,
    subItems: [
      { id: 'my-courses', label: { ko: '내 강의', en: 'My Courses' }, icon: BookOpen, path: '/tu/b2b/mypage/teaching' },
      { id: 'create-course', label: { ko: '강의 디자인 시작하기', en: 'Start Course Design' }, icon: FolderEdit, path: '/tu/teaching/courses/create', roles: ['USER', 'DESIGNER'] },
      { id: 'teaching-stats', label: { ko: '내 강의 통계', en: 'Teaching Stats' }, icon: TrendingUp, path: '/tu/b2b/mypage/teaching/stats' },
    ],
  },
  {
    id: 'my-activity',
    label: { ko: '내 활동', en: 'My Activity' },
    icon: MessageSquare,
    path: '/tu/b2b/mypage/comments',
  },
  {
    id: 'mypage-settings',
    label: { ko: '설정', en: 'Settings' },
    icon: Settings,
    path: '/tu/b2b/mypage/settings',
  },
];

/**
 * 역할별 라벨
 * - SA: 시스템 관리 (전체 플랫폼)
 * - TA: 테넌트 관리 (기업 설정)
 * - CO: 교육 운영 (과정/차수 관리)
 * - TU: 모드 스위처로 대체 (강사/학습자)
 */
export const roleLabels = {
  superAdmin: { ko: '시스템 관리', en: 'System Admin' },
  tenantAdmin: { ko: '테넌트 관리', en: 'Tenant Admin' },
  courseOperator: { ko: '교육 운영', en: 'Operations' },
  tenantUser: { ko: '강사 센터', en: 'Instructor Hub' },
  myPage: { ko: '마이페이지', en: 'My Page' },
};
