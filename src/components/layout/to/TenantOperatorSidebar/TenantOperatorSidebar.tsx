import { BaseSidebar } from '../../common/BaseSidebar';
import { tenantOperatorMenuData, roleLabels } from '@/config/sidebar-menus';

interface TenantOperatorSidebarProps {
  isExpanded: boolean;
  onToggle: () => void;
  onMenuItemClick?: (itemId: string) => void;
  isDarkMode?: boolean;
  onThemeToggle?: () => void;
  language?: 'ko' | 'en';
  onLanguageChange?: (language: 'ko' | 'en') => void;
}

export function TenantOperatorSidebar(props: TenantOperatorSidebarProps) {
  return (
    <BaseSidebar
      {...props}
      menuData={tenantOperatorMenuData}
      roleLabel={roleLabels.tenantOperator}
    />
  );
}
