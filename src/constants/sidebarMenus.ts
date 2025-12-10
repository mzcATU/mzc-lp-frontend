import {
  LayoutDashboard,
  Search,
  Settings,
  Library,
  FolderEdit,
  Layers,
  UserCheck,
  BookOpen,
  BookCheck,
  Shield,
  Bell,
  Calendar,
  ClipboardList,
  GraduationCap,
  FolderOpen,
  Users,
  User,
} from 'lucide-react';
import type { MenuItem } from '@/types/sidebar.types';

/**
 * 운영자(Operator) 사이드바 메뉴
 * 교육 과정 관리 및 운영 기능
 */
export const operatorMenuData: MenuItem[] = [
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
      {
        id: 'course-search',
        label: { ko: '과정 검색 및 상세 조회', en: 'Course Search & Details' },
        icon: Search,
      },
      {
        id: 'course-registration',
        label: { ko: '과정 등록/수정', en: 'Course Registration & Edit' },
        icon: FolderEdit,
      },
    ],
  },
  {
    id: 'program-management',
    label: { ko: '교육 운영 관리', en: 'Program Management' },
    icon: Layers,
    subItems: [
      {
        id: 'session-management',
        label: { ko: '차수 관리', en: 'Session Management' },
        icon: Calendar,
      },
      {
        id: 'instructor-assignment',
        label: { ko: '강사 배정', en: 'Instructor Assignment' },
        icon: UserCheck,
      },
    ],
  },
  {
    id: 'enrollment-instructor-data',
    label: { ko: '수강 및 강사 정보', en: 'Enrollment & Instructor Data' },
    icon: ClipboardList,
    subItems: [
      {
        id: 'sis-lookup',
        label: { ko: '학생 수강 정보 확인', en: 'SIS Lookup' },
        icon: BookOpen,
      },
      {
        id: 'iis-lookup',
        label: { ko: '강사 배정 정보 확인', en: 'IIS Lookup' },
        icon: BookCheck,
      },
    ],
  },
  {
    id: 'settings',
    label: { ko: '설정', en: 'Settings' },
    icon: Settings,
    subItems: [
      {
        id: 'account-security',
        label: { ko: '계정 및 보안', en: 'Account & Security' },
        icon: Shield,
      },
      {
        id: 'notification-settings',
        label: { ko: '알림', en: 'Notifications' },
        icon: Bell,
      },
    ],
  },
];

/**
 * 강의 개설자(Course Designer) 사이드바 메뉴
 * 강의 설계 및 콘텐츠 관리 기능
 */
export const courseDesignerMenuData: MenuItem[] = [
  {
    id: 'dashboard',
    label: { ko: '대시보드', en: 'Dashboard' },
    icon: LayoutDashboard,
  },
  {
    id: 'course-management',
    label: { ko: '강의 관리', en: 'Course Management' },
    icon: GraduationCap,
    subItems: [
      {
        id: 'my-courses',
        label: { ko: '내 강의 목록', en: 'My Courses' },
        icon: Library,
      },
    ],
  },
  {
    id: 'content-management',
    label: { ko: '콘텐츠 관리', en: 'Content Management' },
    icon: FolderOpen,
    subItems: [
      {
        id: 'content-library',
        label: { ko: '콘텐츠 라이브러리', en: 'Content Library' },
        icon: FolderOpen,
      },
    ],
  },
  {
    id: 'student-management',
    label: { ko: '수강생 관리', en: 'Student Management' },
    icon: Users,
    subItems: [
      {
        id: 'enrollment-status',
        label: { ko: '수강생 현황', en: 'Enrollment Status' },
        icon: Users,
      },
    ],
  },
  {
    id: 'settings',
    label: { ko: '설정', en: 'Settings' },
    icon: Settings,
    subItems: [
      {
        id: 'profile',
        label: { ko: '프로필 관리', en: 'Profile' },
        icon: User,
      },
    ],
  },
];

/**
 * 역할 라벨
 */
export const roleLabels = {
  operator: { ko: '교육 운영자', en: 'Operator' },
  tenantAdmin: { ko: '테넌트 관리자', en: 'Tenant Admin' },
  superAdmin: { ko: '시스템 관리자', en: 'Super Admin' },
  user: { ko: '사용자', en: 'User' },
  courseDesigner: { ko: '강의 개설자', en: 'Course Designer' },
};
