import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import {
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  PanelLeft,
  GraduationCap,
  LogOut,
} from 'lucide-react';
import { toast } from 'sonner';
import type { SidebarColors } from '@/types';
import { designTokens } from '@/styles/admin-design-tokens';
import { cn } from '@/utils/cn';
import { useTenantBranding } from '@/contexts/TenantBrandingContext';
import { GlobalRoleSwitcher } from '../../common/GlobalRoleSwitcher';
import { useAuthStore } from '@/store/common/authStore';
import { authService } from '@/services/common/authService';
import { tenantAdminMenuData } from '@/config/sidebar-menus';

interface TenantAdminSidebarProps {
  isExpanded: boolean;
  onToggle: () => void;
  onMenuItemClick?: (itemId: string) => void;
  isDarkMode?: boolean;
  language?: 'ko' | 'en';
}

export function TenantAdminSidebar({
  isExpanded,
  onToggle,
  onMenuItemClick,
  isDarkMode = true,
  language = 'ko',
}: TenantAdminSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [activeItem, setActiveItem] = useState<string>('dashboard');
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // 인증 스토어
  const { refreshToken, logout } = useAuthStore();

  // 테넌트 브랜딩
  const { branding } = useTenantBranding();

  // 현재 경로에 맞는 메뉴 아이템 찾기
  const findActiveMenuItem = useMemo(() => {
    const { pathname } = location;

    // 가장 긴 경로부터 매칭하기 위해 모든 경로를 수집하고 정렬
    const allPaths: { path: string; itemId: string; parentId: string | null }[] = [];

    for (const item of tenantAdminMenuData) {
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
      if (pathname === path || pathname.startsWith(path + '/')) {
        return { itemId, parentId };
      }
    }

    // 정확한 매칭이 없으면 startsWith로 다시 시도
    for (const { path, itemId, parentId } of allPaths) {
      if (pathname.startsWith(path)) {
        return { itemId, parentId };
      }
    }

    return { itemId: 'dashboard', parentId: null };
  }, [location.pathname]);

  // URL 변경 시 활성 상태 동기화
  useEffect(() => {
    setActiveItem(findActiveMenuItem.itemId);

    if (findActiveMenuItem.parentId && !expandedItems.includes(findActiveMenuItem.parentId)) {
      setExpandedItems(prev => [...prev, findActiveMenuItem.parentId!]);
    }
  }, [findActiveMenuItem]);

  // 로그아웃 핸들러
  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    try {
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      logout();
      queryClient.clear();
      toast.success(language === 'ko' ? '로그아웃되었습니다.' : 'Logged out successfully.');
      navigate('/admin/login');
      setIsLoggingOut(false);
    }
  };

  const logoUrl = (isDarkMode ? branding?.darkLogoUrl : branding?.logoUrl) || branding?.logoUrl;
  const platformName = branding?.tenantName || 'Learning Hub';

  // Color tokens
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

  const handleItemClick = (itemId: string, hasSubItems: boolean) => {
    if (hasSubItems) {
      toggleExpand(itemId);
    } else {
      setActiveItem(itemId);
      if (onMenuItemClick) {
        onMenuItemClick(itemId);
      }
    }
  };

  const handleSubItemClick = (subItemId: string, parentId: string) => {
    setActiveItem(subItemId);
    if (!expandedItems.includes(parentId)) {
      setExpandedItems([...expandedItems, parentId]);
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
            </div>
          )}
        </div>

        {/* Global Role Switcher (TA/CO/TU 전환) */}
        <div className={cn('mb-3', !isExpanded && 'flex justify-center')}>
          <GlobalRoleSwitcher
            currentRole="TA"
            isExpanded={isExpanded}
            language={language}
            colors={colors}
            isDarkMode={isDarkMode}
          />
        </div>

        {/* Divider */}
        <div
          className="mb-4"
          style={{
            borderBottom: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : colors.border}`,
          }}
        />

        {/* Navigation Menu */}
        <nav
          className={cn(
            'flex-1 overflow-y-auto overflow-x-hidden space-y-1',
            'sidebar-scrollbar',
            !isDarkMode && 'sidebar-scrollbar-light'
          )}
        >
          {tenantAdminMenuData.map((item) => {
            const Icon = item.icon;
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const isExpandedItem = expandedItems.includes(item.id);
            const isActive = activeItem === item.id;

            return (
              <div key={item.id} className="mb-1">
                {/* Level 1 Menu Item */}
                <button
                  onClick={() => handleItemClick(item.id, !!hasSubItems)}
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
                            handleSubItemClick(subItem.id, item.id)
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
                                handleSubItemClick(subItem.id, item.id)
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

        {/* Footer */}
        <div
          className="mt-4 pt-4 space-y-1"
          style={{
            borderTop: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : colors.border}`,
          }}
        >
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center rounded-xl transition-all duration-300 overflow-hidden"
            style={{
              width: isExpanded ? '100%' : '44px',
              height: '44px',
              padding: isExpanded ? '0 16px' : '0',
              justifyContent: 'center',
              color: colors.textPrimary,
              margin: isExpanded ? '0' : '0 auto',
              opacity: isLoggingOut ? 0.5 : 1,
              cursor: isLoggingOut ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={(e) => {
              if (!isLoggingOut) {
                e.currentTarget.style.backgroundColor = colors.hover;
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            title={language === 'ko' ? '로그아웃' : 'Logout'}
          >
            <LogOut
              className="w-5 h-5 flex-shrink-0"
              style={{ color: colors.textSecondary }}
            />
            {isExpanded && (
              <span className="flex-1 text-left text-sm font-medium whitespace-nowrap ml-3">
                {isLoggingOut
                  ? (language === 'ko' ? '로그아웃 중...' : 'Logging out...')
                  : (language === 'ko' ? '로그아웃' : 'Logout')
                }
              </span>
            )}
          </button>

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
