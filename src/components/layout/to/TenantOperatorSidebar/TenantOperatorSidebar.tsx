import { useLocation } from 'react-router-dom';
import { BaseSidebar } from '../../common/BaseSidebar';
import {
  tenantOperatorMenuData,
  b2bSocialToMenuData,
  roleLabels,
} from '@/config/sidebar-menus';

interface TenantOperatorSidebarProps {
  isExpanded: boolean;
  onToggle: () => void;
  onMenuItemClick?: (itemId: string) => void;
  isDarkMode?: boolean;
  language?: 'ko' | 'en';
}

export function TenantOperatorSidebar(props: TenantOperatorSidebarProps) {
  const location = useLocation();
  const isB2BSocial = location.pathname.includes('/b2b-social');

  return (
    <BaseSidebar
      {...props}
      menuData={isB2BSocial ? b2bSocialToMenuData : tenantOperatorMenuData}
      roleLabel={isB2BSocial ? roleLabels.b2bSocialTo : roleLabels.tenantOperator}
    />
  );
}
