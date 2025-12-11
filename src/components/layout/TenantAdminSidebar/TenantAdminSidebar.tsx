import { AdminSidebar } from '../AdminSidebar';
import { tenantAdminMenuData, roleLabels } from '@/config/sidebar-menus';

interface TenantAdminSidebarProps {
  isExpanded: boolean;
  onToggle: () => void;
  onMenuItemClick?: (itemId: string) => void;
  isDarkMode?: boolean;
  onThemeToggle?: () => void;
  language?: 'ko' | 'en';
  onLanguageChange?: (language: 'ko' | 'en') => void;
}

export function TenantAdminSidebar(props: TenantAdminSidebarProps) {
  return (
    <AdminSidebar
      {...props}
      menuData={tenantAdminMenuData}
      roleLabel={roleLabels.tenantAdmin}
    />
  );
}
