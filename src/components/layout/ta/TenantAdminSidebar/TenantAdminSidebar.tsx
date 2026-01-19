import { BaseSidebar } from '../../common/BaseSidebar';
import { tenantAdminMenuData, roleLabels } from '@/config/sidebar-menus';
import { useAuthStore } from '@/store/common/authStore';

interface TenantAdminSidebarProps {
  isExpanded: boolean;
  onToggle: () => void;
  onMenuItemClick?: (itemId: string) => void;
  isDarkMode?: boolean;
  language?: 'ko' | 'en';
}

export function TenantAdminSidebar(props: TenantAdminSidebarProps) {
  // 사용자 역할 가져오기 (다중 역할 지원)
  const userRoles = useAuthStore((state) => state.user?.roles);

  // 프론트엔드 역할 개수 계산 (GlobalRoleSwitcher와 동일한 로직)
  const frontendRoleCount = (() => {
    if (!userRoles || userRoles.length === 0) return 0;

    let count = 0;
    if (userRoles.includes('USER')) count++;
    if (userRoles.includes('DESIGNER')) count++;
    if (userRoles.includes('INSTRUCTOR')) count++;
    if (userRoles.includes('OPERATOR')) count++;
    if (userRoles.includes('TENANT_ADMIN')) count++;
    return count;
  })();

  // 프론트엔드 역할이 2개 이상이면 글로벌 역할 스위처 표시
  const showGlobalRoleSwitcher = frontendRoleCount >= 2;

  return (
    <BaseSidebar
      {...props}
      menuData={tenantAdminMenuData}
      roleLabel={roleLabels.tenantAdmin}
      showGlobalRoleSwitcher={showGlobalRoleSwitcher}
      roleType="ta"
    />
  );
}
