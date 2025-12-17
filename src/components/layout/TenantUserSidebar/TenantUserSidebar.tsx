import { BaseSidebar } from '../BaseSidebar';
import { tenantUserMenuData, roleLabels } from '@/config/sidebar-menus';

interface TenantUserSidebarProps {
  isExpanded: boolean;
  onToggle: () => void;
  onMenuItemClick?: (itemId: string) => void;
  isDarkMode?: boolean;
  onThemeToggle?: () => void;
  language?: 'ko' | 'en';
  onLanguageChange?: (language: 'ko' | 'en') => void;
}

export function TenantUserSidebar(props: TenantUserSidebarProps) {
  return (
    <BaseSidebar
      {...props}
      menuData={tenantUserMenuData}
      roleLabel={roleLabels.tenantUser}
    />
  );
}
