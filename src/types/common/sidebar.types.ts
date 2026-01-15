import type { LucideIcon } from 'lucide-react';

/**
 * 사이드바 메뉴 아이템 타입
 */
export interface MenuItem {
  id: string;
  label: { ko: string; en: string };
  icon: LucideIcon;
  path?: string;
  subItems?: SubMenuItem[];
  roles?: string[]; // 특정 롤에만 표시 (예: ['INSTRUCTOR', 'DESIGNER'])
}

export interface SubMenuItem {
  id: string;
  label: { ko: string; en: string };
  icon: LucideIcon;
  path?: string;
  instructorOnly?: boolean;
  roles?: string[]; // 특정 롤에만 표시 (예: ['DESIGNER'])
}

/**
 * 사이드바 색상 토큰 타입
 */
export interface SidebarColors {
  bg: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  hover: string;
  activeBg: string;
  activeText: string;
  tooltipBg: string;
}

/**
 * 공통 사이드바 Props
 */
export interface BaseSidebarProps {
  isExpanded: boolean;
  onToggle: () => void;
  onMenuItemClick?: (itemId: string) => void;
  isDarkMode?: boolean;
  language?: 'ko' | 'en';
  menuData: MenuItem[];
  roleLabel: { ko: string; en: string };
  /** TA로 돌아가기 버튼 표시 여부 (TENANT_ADMIN이 TU/CO 페이지 접근 시) */
  showBackToTA?: boolean;
}

/**
 * 사이드바 타입 (역할별)
 */
export type SidebarType = 'user' | 'operator' | 'tenant-admin' | 'super-admin';
