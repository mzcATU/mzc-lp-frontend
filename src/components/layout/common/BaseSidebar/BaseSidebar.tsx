import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  PanelLeft,
  GraduationCap,
  ArrowLeft,
} from 'lucide-react';
import type { BaseSidebarProps, SidebarColors } from '@/types';
import { designTokens } from '@/styles/admin-design-tokens';
import { cn } from '@/utils/cn';
import { useTenantBranding } from '@/contexts/TenantBrandingContext';
import { GlobalRoleSwitcher, type GlobalRole } from '../GlobalRoleSwitcher';
import { useSubdomainPath } from '@/hooks/common';
import { useAuthStore } from '@/store/common/authStore';
import type { TenantRole } from '@/types/common/auth.types';

// 역할 타입
type RoleType = 'sa' | 'ta' | 'co' | 'tu';

export function BaseSidebar({
  isExpanded,
  onToggle,
  onMenuItemClick,
  isDarkMode = true,
  language = 'ko',
  menuData,
  roleLabel,
  showModeSwitcher = false,
  showGlobalRoleSwitcher = false,
  roleType = 'tu',
  showBackToTA = false,
}: BaseSidebarProps & { showModeSwitcher?: boolean; showGlobalRoleSwitcher?: boolean; roleType?: RoleType }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { prefixPath } = useSubdomainPath();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [activeItem, setActiveItem] = useState<string>('dashboard');

  // 현재 경로에 맞는 메뉴 아이템 찾기
  const findActiveMenuItem = useMemo(() => {
    const { pathname } = location;

    // 서브도메인 제거: /{subdomain}/sa/... -> /sa/..., /{subdomain}/co/... -> /co/... 등
    const rolePathPatterns = ['/sa/', '/ta/', '/co/', '/tu/'];
    let normalizedPath = pathname;
    for (const pattern of rolePathPatterns) {
      const idx = pathname.indexOf(pattern);
      if (idx !== -1) {
        normalizedPath = pathname.substring(idx);
        break;
      }
    }

    // 가장 긴 경로부터 매칭하기 위해 모든 경로를 수집하고 정렬
    const allPaths: { path: string; itemId: string; parentId: string | null }[] = [];

    for (const item of menuData) {
      if (item.subItems) {
        for (const subItem of item.subItems) {
          if (subItem.path) {
            allPaths.push({ path: subItem.path, itemId: subItem.id, parentId: item.id });
          }
        }
      }

      if (item.path) {
        allPaths.push({ path: item.path, itemId: item.id, parentId: null });
      }
    }

    // 경로 길이 내림차순 정렬 (더 구체적인 경로 먼저 매칭)
    allPaths.sort((a, b) => b.path.length - a.path.length);

    for (const { path, itemId, parentId } of allPaths) {
      if (normalizedPath === path || normalizedPath.startsWith(path + '/')) {
        return { itemId, parentId };
      }
    }

    // 정확한 매칭이 없으면 startsWith로 다시 시도
    for (const { path, itemId, parentId } of allPaths) {
      if (normalizedPath.startsWith(path)) {
        return { itemId, parentId };
      }
    }

    return { itemId: 'dashboard', parentId: null };
  }, [location.pathname, menuData]);

  // URL 변경 시 활성 상태 동기화
  useEffect(() => {
    setActiveItem(findActiveMenuItem.itemId);

    if (findActiveMenuItem.parentId && !expandedItems.includes(findActiveMenuItem.parentId)) {
      setExpandedItems(prev => [...prev, findActiveMenuItem.parentId!]);
    }
  }, [findActiveMenuItem]);

  // 테넌트 브랜딩 (SA 제외)
  const { branding } = useTenantBranding();

  // authStore에서 현재 역할 가져오기
  const storeCurrentRole = useAuthStore((state) => state.currentRole);
  const userRole = useAuthStore((state) => state.user?.role);

  // TenantRole → GlobalRole 매핑
  const tenantRoleToGlobalRole: Record<TenantRole, GlobalRole> = {
    SYSTEM_ADMIN: 'TA',
    TENANT_ADMIN: 'TA',
    OPERATOR: 'CO',
    DESIGNER: 'TU',
    INSTRUCTOR: 'TU',
    USER: 'USER',
  };

  // 글로벌 역할 타입 매핑 (fallback용)
  const globalRoleMap: Record<RoleType, GlobalRole> = {
    sa: 'TA',
    ta: 'TA',
    co: 'CO',
    tu: 'TU',
  };

  // 현재 역할 결정: authStore의 currentRole > user.role > roleType 기반 fallback
  const currentGlobalRole = storeCurrentRole
    ? tenantRoleToGlobalRole[storeCurrentRole]
    : userRole
      ? tenantRoleToGlobalRole[userRole]
      : globalRoleMap[roleType];

  // SA는 플랫폼 기본 로고, 나머지는 테넌트 브랜딩
  const isSuperAdmin = roleType === 'sa';
  const logoUrl = isSuperAdmin ? null : (isDarkMode ? branding?.darkLogoUrl : branding?.logoUrl) || branding?.logoUrl;
  const platformName = isSuperAdmin ? 'Learning Hub' : (branding?.tenantName || 'Learning Hub');

  // Color tokens - Dynamic based on theme
  const colors: SidebarColors = isDarkMode
    ? {
        bg: designTokens.darkMode.bg,
        border: designTokens.darkMode.border,
        textPrimary: designTokens.darkMode.textPrimary,
        textSecondary: designTokens.darkMode.textSecondary,
        hover: designTokens.darkMode.hover,
        activeBg: designTokens.darkMode.activeBg,
        activeText: designTokens.darkMode.activeText,
        tooltipBg: designTokens.darkMode.tooltipBg,
      }
    : {
        bg: designTokens.lightMode.bg,
        border: designTokens.lightMode.border,
        textPrimary: designTokens.lightMode.textPrimary,
        textSecondary: designTokens.lightMode.textSecondary,
        hover: designTokens.lightMode.hover,
        activeBg: designTokens.lightMode.activeBg,
        activeText: designTokens.lightMode.activeText,
        tooltipBg: designTokens.lightMode.tooltipBg,
      };

  const toggleExpand = (itemId: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleItemClick = (itemId: string, hasSubItems: boolean, path?: string) => {
    if (hasSubItems) {
      toggleExpand(itemId);
    } else {
      setActiveItem(itemId);
      if (path) {
        navigate(prefixPath(path));
      }
      if (onMenuItemClick) {
        onMenuItemClick(itemId);
      }
    }
  };

  const handleSubItemClick = (subItemId: string, parentId: string, path?: string) => {
    setActiveItem(subItemId);
    if (!expandedItems.includes(parentId)) {
      setExpandedItems([...expandedItems, parentId]);
    }
    if (path) {
      navigate(prefixPath(path));
    }
    if (onMenuItemClick) {
      onMenuItemClick(subItemId);
    }
  };

  return (
    <aside
      className="flex-shrink-0 transition-all duration-300"
      style={{
        width: isExpanded ? '300px' : '84px',
        padding: isExpanded ? '16px' : '8px',
        backgroundColor: isDarkMode ? '#1e1e1e' : designTokens.bg.app_default,
      }}
    >
      {/* 카드형 사이드바 */}
      <div
        className={cn(
          'rounded-2xl h-full flex flex-col',
          isExpanded ? 'p-4' : 'py-3 px-2',
          isDarkMode
            ? 'bg-white/5 border border-white/10 backdrop-blur-sm'
            : 'bg-white border border-gray-200 shadow-sm'
        )}
      >
        {/* Logo Section */}
        <div
          className={cn(
            'flex items-center gap-3 mb-4',
            !isExpanded && 'justify-center'
          )}
        >
          {/* 로고: 테넌트 로고가 있으면 사용, 없으면 기본 아이콘 */}
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={platformName}
              className="w-10 h-10 rounded-xl object-contain flex-shrink-0"
            />
          ) : (
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
              }}
            >
              <GraduationCap size={22} color="#FFFFFF" />
            </div>
          )}
          {isExpanded && (
            <div className="overflow-hidden">
              <h1
                className="text-lg font-semibold whitespace-nowrap"
                style={{ color: colors.textPrimary }}
              >
                {platformName}
              </h1>
              {/* 모드 스위처나 글로벌 역할 스위처가 없을 때만 라벨 표시 */}
              {!showModeSwitcher && !showGlobalRoleSwitcher && (
                <p
                  className="text-xs whitespace-nowrap"
                  style={{ color: colors.textSecondary }}
                >
                  {roleLabel[language]}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Global Role Switcher (TA, CO, TU, USER 간 전환) */}
        {showGlobalRoleSwitcher && (
          <div className={cn('mb-3', !isExpanded && 'flex justify-center')}>
            <GlobalRoleSwitcher
              currentRole={currentGlobalRole}
              isExpanded={isExpanded}
              language={language}
              colors={colors}
              isDarkMode={isDarkMode}
            />
          </div>
        )}

        {/* Divider before menu */}
        <div
          className="mb-4"
          style={{
            borderBottom: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : colors.border}`,
          }}
        />

        {/* Navigation Menu - 스크롤 영역 */}
        <nav
          className={cn(
            'flex-1 overflow-y-auto overflow-x-hidden space-y-1',
            'sidebar-scrollbar',
            !isDarkMode && 'sidebar-scrollbar-light'
          )}
          style={{
            marginLeft: isExpanded ? '-16px' : '-8px',
            marginRight: isExpanded ? '-16px' : '-8px',
            paddingLeft: isExpanded ? '16px' : '8px',
            paddingRight: isExpanded ? '16px' : '8px',
          }}
        >
          {menuData.map((item) => {
            const Icon = item.icon;
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const isExpandedItem = expandedItems.includes(item.id);
            const isActive = activeItem === item.id;

            return (
              <div key={item.id} className="mb-1">
                {/* Level 1 Menu Item */}
                <button
                  onClick={() => handleItemClick(item.id, !!hasSubItems, item.path)}
                  className="flex items-center rounded-xl transition-all duration-300 overflow-hidden"
                  style={{
                    width: isExpanded ? '100%' : '44px',
                    height: '44px',
                    padding: isExpanded ? '0 16px' : '0',
                    justifyContent: 'center',
                    backgroundColor:
                      isActive && !hasSubItems ? colors.activeBg : 'transparent',
                    color:
                      isActive && !hasSubItems
                        ? colors.activeText
                        : colors.textPrimary,
                    margin: isExpanded ? '0' : '0 auto',
                  }}
                  onMouseEnter={(e) => {
                    if (!(isActive && !hasSubItems)) {
                      e.currentTarget.style.backgroundColor = colors.hover;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!(isActive && !hasSubItems)) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                  title={!isExpanded ? item.label[language] : ''}
                >
                  <Icon
                    className="w-5 h-5 flex-shrink-0"
                    style={{
                      color:
                        isActive && !hasSubItems
                          ? colors.activeText
                          : colors.textSecondary,
                    }}
                  />
                  {isExpanded && (
                    <>
                      <span className="flex-1 text-left text-sm font-medium whitespace-nowrap ml-3">
                        {item.label[language]}
                      </span>
                      {hasSubItems && (
                        <span style={{ color: colors.textSecondary }}>
                          {isExpandedItem ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </span>
                      )}
                    </>
                  )}
                </button>

                {/* Level 2 Sub-Menu Items */}
                {hasSubItems && isExpanded && isExpandedItem && (
                  <div
                    className="mt-1 ml-4 pl-4 border-l-2 space-y-1"
                    style={{ borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : '#e5e7eb' }}
                  >
                    {item.subItems!.map((subItem) => {
                      const SubIcon = subItem.icon;
                      const isSubActive = activeItem === subItem.id;

                      return (
                        <button
                          key={subItem.id}
                          onClick={() =>
                            handleSubItemClick(subItem.id, item.id, subItem.path)
                          }
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm"
                          style={{
                            backgroundColor: isSubActive
                              ? colors.activeBg
                              : 'transparent',
                            color: isSubActive
                              ? colors.activeText
                              : colors.textPrimary,
                          }}
                          onMouseEnter={(e) => {
                            if (!isSubActive) {
                              e.currentTarget.style.backgroundColor =
                                colors.hover;
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isSubActive) {
                              e.currentTarget.style.backgroundColor =
                                'transparent';
                            }
                          }}
                        >
                          <SubIcon
                            className="w-4 h-4 flex-shrink-0"
                            style={{
                              color: isSubActive
                                ? colors.activeText
                                : colors.textSecondary,
                            }}
                          />
                          <span className="flex-1 text-left">
                            {subItem.label[language]}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Collapsed State - Tooltip */}
                {hasSubItems && !isExpanded && (
                  <div className="relative group">
                    <div className="absolute left-full top-0 ml-2 hidden group-hover:block z-50">
                      <div
                        className="border rounded-xl shadow-lg py-2 px-1 min-w-[200px]"
                        style={{
                          backgroundColor: colors.tooltipBg,
                          borderColor: colors.border,
                        }}
                      >
                        <div
                          className="px-3 py-1.5 text-xs border-b mb-1"
                          style={{
                            color: colors.textSecondary,
                            borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : colors.border,
                          }}
                        >
                          {item.label[language]}
                        </div>
                        {item.subItems!.map((subItem) => {
                          const SubIcon = subItem.icon;
                          const isSubActive = activeItem === subItem.id;

                          return (
                            <button
                              key={subItem.id}
                              onClick={() =>
                                handleSubItemClick(subItem.id, item.id, subItem.path)
                              }
                              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm"
                              style={{
                                backgroundColor: isSubActive
                                  ? colors.activeBg
                                  : 'transparent',
                                color: isSubActive
                                  ? colors.activeText
                                  : colors.textPrimary,
                              }}
                              onMouseEnter={(e) => {
                                if (!isSubActive) {
                                  e.currentTarget.style.backgroundColor =
                                    colors.hover;
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!isSubActive) {
                                  e.currentTarget.style.backgroundColor =
                                    'transparent';
                                }
                              }}
                            >
                              <SubIcon
                                className="w-4 h-4 flex-shrink-0"
                                style={{
                                  color: isSubActive
                                    ? colors.activeText
                                    : colors.textSecondary,
                                }}
                              />
                              <span className="flex-1 text-left">
                                {subItem.label[language]}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Divider before footer */}
        <div
          className="mt-4 pt-4 space-y-1"
          style={{
            borderTop: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : colors.border}`,
          }}
        >
          {/* Back to TA Button (TENANT_ADMIN이 TU/CO 페이지 접근 시) */}
          {showBackToTA && (
            <button
              onClick={() => navigate(prefixPath('/ta/dashboard'))}
              className="flex items-center rounded-xl transition-all duration-300 overflow-hidden"
              style={{
                width: isExpanded ? '100%' : '44px',
                height: '44px',
                padding: isExpanded ? '0 16px' : '0',
                justifyContent: 'center',
                color: colors.textPrimary,
                margin: isExpanded ? '0' : '0 auto',
                backgroundColor: isDarkMode ? 'rgba(99, 102, 241, 0.2)' : 'rgba(99, 102, 241, 0.1)',
                border: `1px solid ${isDarkMode ? 'rgba(99, 102, 241, 0.4)' : 'rgba(99, 102, 241, 0.3)'}`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(99, 102, 241, 0.3)' : 'rgba(99, 102, 241, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(99, 102, 241, 0.2)' : 'rgba(99, 102, 241, 0.1)';
              }}
              title={language === 'ko' ? 'TA로 돌아가기' : 'Back to TA'}
            >
              <ArrowLeft
                className="w-5 h-5 flex-shrink-0"
                style={{ color: isDarkMode ? '#a5b4fc' : '#6366f1' }}
              />
              {isExpanded && (
                <span
                  className="flex-1 text-left text-sm font-medium whitespace-nowrap ml-3"
                  style={{ color: isDarkMode ? '#a5b4fc' : '#6366f1' }}
                >
                  {language === 'ko' ? 'TA로 돌아가기' : 'Back to TA'}
                </span>
              )}
            </button>
          )}

          {/* Collapse Toggle */}
          <button
            onClick={onToggle}
            className="flex items-center rounded-xl transition-all duration-300 overflow-hidden"
            style={{
              width: isExpanded ? '100%' : '44px',
              height: '44px',
              padding: isExpanded ? '0 16px' : '0',
              justifyContent: 'center',
              color: colors.textPrimary,
              margin: isExpanded ? '0' : '0 auto',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.hover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            title={
              isExpanded
                ? language === 'ko'
                  ? '사이드바 접기'
                  : 'Collapse Sidebar'
                : language === 'ko'
                  ? '사이드바 펼치기'
                  : 'Expand Sidebar'
            }
          >
            {isExpanded ? (
              <PanelLeftClose
                className="w-5 h-5 flex-shrink-0"
                style={{ color: colors.textSecondary }}
              />
            ) : (
              <PanelLeft
                className="w-5 h-5 flex-shrink-0"
                style={{ color: colors.textSecondary }}
              />
            )}
            {isExpanded && (
              <span className="flex-1 text-left text-sm font-medium whitespace-nowrap ml-3">
                {language === 'ko' ? '접기' : 'Collapse'}
              </span>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}
