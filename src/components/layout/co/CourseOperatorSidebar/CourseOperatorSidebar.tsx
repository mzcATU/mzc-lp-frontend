import { useMemo } from 'react';
import { BaseSidebar } from '../../common/BaseSidebar';
import { courseOperatorMenuData, roleLabels } from '@/config/sidebar-menus';
import { usePublicLayout } from '@/hooks/tu';
import { useAuthStore } from '@/store/common/authStore';
import type { MenuItem } from '@/types';

interface CourseOperatorSidebarProps {
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

export function CourseOperatorSidebar(props: CourseOperatorSidebarProps) {
  const { data: layoutData } = usePublicLayout();
  const sidebarSettings = layoutData?.sidebarCOSettings as { enabled?: boolean; items?: BrandingSidebarItem[] } | undefined;

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

  // 브랜딩 설정을 기반으로 메뉴 필터링
  const filteredMenuData = useMemo((): MenuItem[] => {
    if (!sidebarSettings?.items || sidebarSettings.items.length === 0) {
      return courseOperatorMenuData;
    }

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
    return courseOperatorMenuData
      .filter((item) => !hiddenIds.has(item.id))
      .map((item) => ({
        ...item,
        subItems: item.subItems?.filter((sub) => !hiddenIds.has(sub.id)),
      }));
  }, [sidebarSettings]);

  return (
    <BaseSidebar
      {...props}
      menuData={filteredMenuData}
      roleLabel={roleLabels.courseOperator}
      showGlobalRoleSwitcher={showGlobalRoleSwitcher}
      roleType="co"
    />
  );
}
