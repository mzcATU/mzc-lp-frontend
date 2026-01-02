import { useLocation } from 'react-router-dom';
import { BaseSidebar } from '../../common/BaseSidebar';
import {
  tenantAdminMenuData,
  b2bSocialTaMenuData,
  roleLabels,
} from '@/config/sidebar-menus';

interface TenantAdminSidebarProps {
  isExpanded: boolean;
  onToggle: () => void;
  onMenuItemClick?: (itemId: string) => void;
  isDarkMode?: boolean;
  language?: 'ko' | 'en';
}

export function TenantAdminSidebar(props: TenantAdminSidebarProps) {
  const location = useLocation();
  const isB2BSocial = location.pathname.startsWith('/b2b-social');

  return (
    <BaseSidebar
      {...props}
      menuData={isB2BSocial ? b2bSocialTaMenuData : tenantAdminMenuData}
      roleLabel={isB2BSocial ? roleLabels.b2bSocialTa : roleLabels.tenantAdmin}
    />
  );
}
