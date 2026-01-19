import { useMemo } from 'react';
import { BaseSidebar } from '../../common/BaseSidebar';
import { tenantUserMenuData, roleLabels } from '@/config/sidebar-menus';
import { usePublicLayout } from '@/hooks/tu';
import { useTenantFeatures } from '@/contexts/TenantFeaturesContext';
import { useAuthStore } from '@/store/common/authStore';
import type { MenuItem } from '@/types';

interface TenantUserSidebarProps {
  isExpanded: boolean;
  onToggle: () => void;
  onMenuItemClick?: (itemId: string) => void;
  isDarkMode?: boolean;
  language?: 'ko' | 'en';
}

// 브랜딩 설정의 visible 속성을 기반으로 메뉴 필터링
interface BrandingSidebarItem {
  id: string;
  label: string;
  url: string;
  icon: string;
  visible: boolean;
  children?: BrandingSidebarItem[];
}

export function TenantUserSidebar(props: TenantUserSidebarProps) {
  const { data: layoutData } = usePublicLayout();
  const sidebarSettings = layoutData?.sidebarTUSettings as { enabled?: boolean; items?: BrandingSidebarItem[] } | undefined;

  // 사용자 역할 가져오기 (다중 역할 지원)
  const userRole = useAuthStore((state) => state.user?.role);
  const userRoles = useAuthStore((state) => state.user?.roles);

  // 기능 설정 가져오기
  const { isFeatureEnabled } = useTenantFeatures();
  const instructorTabEnabled = isFeatureEnabled('instructorTabEnabled');

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

  // 글로벌 역할 스위처 표시 여부 (프론트엔드 역할이 2개 이상인 경우)
  const showGlobalRoleSwitcher = instructorTabEnabled && frontendRoleCount >= 2;

  // 브랜딩 설정 + 역할 기반 메뉴 필터링
  const filteredMenuData = useMemo((): MenuItem[] => {
    let menuData = tenantUserMenuData;

    // 1. 역할 기반 필터링 (보유한 모든 역할 기반)
    const rolesToCheck = (userRoles && userRoles.length > 0) ? Array.from(userRoles) : [];
    if (rolesToCheck.length > 0) {
      menuData = menuData
        .filter((item) => !item.roles || item.roles.some(role => rolesToCheck.includes(role)))
        .map((item) => ({
          ...item,
          subItems: item.subItems?.filter((sub) => !sub.roles || sub.roles.some(role => rolesToCheck.includes(role))),
        }));
    }

    // 2. 브랜딩 설정 기반 필터링
    if (sidebarSettings?.items && sidebarSettings.items.length > 0) {
      // visible: false인 항목 찾기
      const hiddenIds = new Set<string>();
      const collectHiddenIds = (items: BrandingSidebarItem[]) => {
        for (const item of items) {
          if (!item.visible) {
            hiddenIds.add(item.id);
          }
          if (item.children) {
            collectHiddenIds(item.children);
          }
        }
      };
      collectHiddenIds(sidebarSettings.items);

      // 숨겨진 항목 필터링
      menuData = menuData
        .filter((item) => !hiddenIds.has(item.id))
        .map((item) => ({
          ...item,
          subItems: item.subItems?.filter((sub) => !hiddenIds.has(sub.id)),
        }));
    }

    return menuData;
  }, [sidebarSettings, userRoles]);

  return (
    <BaseSidebar
      {...props}
      menuData={filteredMenuData}
      roleLabel={roleLabels.tenantUser}
      showModeSwitcher={false}
      showGlobalRoleSwitcher={showGlobalRoleSwitcher}
      roleType="tu"
    />
  );
}
