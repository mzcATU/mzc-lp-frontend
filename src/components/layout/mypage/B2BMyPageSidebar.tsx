import { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { b2bMyPageMenuData } from '@/config/sidebar-menus';
import { useThemeStore } from '@/store/common/themeStore';
import { useLanguageStore } from '@/store/common/languageStore';
import { useAuthStore } from '@/store/common/authStore';
import { userService } from '@/services/common/userService';
import { authService } from '@/services/common/authService';
import { usePublicLayout } from '@/hooks/tu';
import { useTenantFeatures } from '@/contexts/TenantFeaturesContext';
import { GlobalRoleSwitcher } from '../common/GlobalRoleSwitcher';
import { designTokens } from '@/styles/admin-design-tokens';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/common';
import type { MenuItem } from '@/types';

interface BrandingSidebarItem {
  id: string;
  label: string;
  url: string;
  icon: string;
  visible: boolean;
  children?: BrandingSidebarItem[];
}

interface B2BMyPageSidebarProps {
  isExpanded: boolean;
  onToggle: () => void;
  onMenuItemClick?: (itemId: string) => void;
  isDarkMode?: boolean;
  language?: 'ko' | 'en';
  subdomain?: string;
}

export function B2BMyPageSidebar({ onMenuItemClick }: B2BMyPageSidebarProps) {
  const location = useLocation();

  const { data: layoutData } = usePublicLayout();
  const sidebarSettings = layoutData?.sidebarTUSettings as { enabled?: boolean; items?: BrandingSidebarItem[] } | undefined;

  const { isFeatureEnabled } = useTenantFeatures();
  const userCourseCreationEnabled = isFeatureEnabled('userCourseCreationEnabled');
  const instructorTabEnabled = isFeatureEnabled('instructorTabEnabled');

  const filteredMenuData = useMemo((): MenuItem[] => {
    const hiddenIds = new Set<string>();
    if (sidebarSettings?.items && sidebarSettings.items.length > 0) {
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
    }

    if (!userCourseCreationEnabled) {
      hiddenIds.add('my-teaching');
      hiddenIds.add('create-course');
    }

    return b2bMyPageMenuData
      .filter((item) => !hiddenIds.has(item.id))
      .map((item) => ({
        ...item,
        subItems: item.subItems?.filter((sub) => !hiddenIds.has(sub.id)),
      }));
  }, [sidebarSettings, userCourseCreationEnabled]);

  const { theme } = useThemeStore();
  const { language } = useLanguageStore();
  const { user, updateUser } = useAuthStore();
  const isDark = theme === 'dark';
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['my-enrollments', 'my-teaching']);
  const [showCreateCourseDialog, setShowCreateCourseDialog] = useState(false);
  const [isGrantingRole, setIsGrantingRole] = useState(false);
  const [courseRoleStatus, setCourseRoleStatus] = useState<'USER' | 'INSTRUCTOR' | 'DESIGNER' | 'OWNER'>('USER');

  useEffect(() => {
    const checkCourseRole = async () => {
      try {
        const roles = await userService.getMyCourseRoles();
        if (Array.isArray(roles) && roles.length > 0) {
          const hasOwner = roles.some((r: { role: string }) => r.role === 'OWNER');
          const hasDesigner = roles.some((r: { role: string }) => r.role === 'DESIGNER');
          const hasInstructor = roles.some((r: { role: string }) => r.role === 'INSTRUCTOR');

          if (hasOwner) {
            setCourseRoleStatus('OWNER');
          } else if (hasDesigner) {
            setCourseRoleStatus('DESIGNER');
          } else if (hasInstructor) {
            setCourseRoleStatus('INSTRUCTOR');
          }
        }
      } catch (error) {
        console.error('Failed to fetch course roles:', error);
      }
    };
    checkCourseRole();
  }, []);

  // 관리자이거나 강의 역할이 있으면 토글 표시 가능
  const isAdminOrDesigner = courseRoleStatus !== 'USER' || user?.role === 'TENANT_ADMIN' || user?.roles?.includes('TENANT_ADMIN');

  const handleCreateCourseClick = () => {
    setShowCreateCourseDialog(true);
  };

  const handleCreateCourseConfirm = async () => {
    if (isAdminOrDesigner) {
      setShowCreateCourseDialog(false);
      onMenuItemClick?.('create-course');
      return;
    }

    setIsGrantingRole(true);
    try {
      await userService.applyDesignerRole();

      const refreshToken = useAuthStore.getState().refreshToken;
      if (refreshToken) {
        const tokenResponse = await authService.refresh(refreshToken);
        useAuthStore.getState().setTokens(tokenResponse.accessToken, tokenResponse.refreshToken);
      }

      const updatedUser = await userService.getMe();
      updateUser({ role: updatedUser.role });

      toast.success(language === 'ko' ? '강의 디자인 권한이 부여되었습니다.' : 'Designer permission granted.');
      setShowCreateCourseDialog(false);
      onMenuItemClick?.('create-course');
    } catch (error) {
      const axiosError = error as { response?: { status?: number } };
      if (axiosError.response?.status === 409) {
        const refreshToken = useAuthStore.getState().refreshToken;
        if (refreshToken) {
          const tokenResponse = await authService.refresh(refreshToken);
          useAuthStore.getState().setTokens(tokenResponse.accessToken, tokenResponse.refreshToken);
        }

        const updatedUser = await userService.getMe();
        updateUser({ role: updatedUser.role });

        toast.success(language === 'ko' ? '이미 강의 디자인 권한이 있습니다.' : 'You already have designer permission.');
        setShowCreateCourseDialog(false);
        onMenuItemClick?.('create-course');
      } else {
        toast.error(language === 'ko' ? '권한 부여에 실패했습니다.' : 'Failed to grant permission.');
      }
    } finally {
      setIsGrantingRole(false);
    }
  };

  const getCreateCourseDialogDescription = () => {
    if (courseRoleStatus === 'OWNER') {
      return language === 'ko'
        ? '이미 강의 소유자입니다. 새 강의를 디자인하시겠습니까?'
        : 'You are already a course owner. Would you like to design a new course?';
    }
    if (courseRoleStatus === 'DESIGNER') {
      return language === 'ko'
        ? '이미 강의 디자인 권한이 있습니다. 강의 디자인 페이지로 이동하시겠습니까?'
        : 'You already have course design permission. Would you like to go to the course design page?';
    }
    return language === 'ko'
      ? '강의 디자인을 위해 디자이너 권한이 부여됩니다. 강의 디자인 페이지로 이동하시겠습니까?'
      : 'Designer permission will be granted for course design. Would you like to proceed to the course design page?';
  };

  const filterSubItemsByRole = (subItems?: MenuItem['subItems']) => {
    if (!subItems) return [];
    return subItems.filter((item) => {
      if (!item.roles || item.roles.length === 0) return true;
      return user?.role && item.roles.includes(user.role);
    });
  };

  const toggleMenu = (menuId: string) => {
    setExpandedMenus((prev) =>
      prev.includes(menuId) ? prev.filter((id) => id !== menuId) : [...prev, menuId]
    );
  };

  const isActive = (path?: string, isExactMatch?: boolean) => {
    if (!path) return false;
    // 서브도메인 제거: /{subdomain}/tu/... -> /tu/...
    const tuIndex = location.pathname.indexOf('/tu/');
    const normalizedPath = tuIndex !== -1 ? location.pathname.substring(tuIndex) : location.pathname;
    if (isExactMatch) {
      return normalizedPath === path;
    }
    return normalizedPath === path || normalizedPath.startsWith(path + '/');
  };

  const renderMenuItem = (item: MenuItem) => {
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isExpanded = expandedMenus.includes(item.id);
    // 홈 메뉴는 정확히 일치할 때만 활성화
    const isHomeMenu = item.id === 'mypage-home';
    const active = isActive(item.path, isHomeMenu);
    const Icon = item.icon;

    return (
      <div key={item.id} className="mb-1">
        <button
          onClick={() => {
            if (hasSubItems) {
              toggleMenu(item.id);
            } else if (item.path && onMenuItemClick) {
              onMenuItemClick(item.id);
            }
          }}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
            active
              ? isDark
                ? 'bg-gradient-to-r from-[#6778ff]/20 to-[#a855f7]/20 text-white'
                : 'bg-blue-50 text-blue-600'
              : isDark
              ? 'text-gray-300 hover:bg-white/5 hover:text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Icon className={`w-5 h-5 ${active ? (isDark ? 'text-[#6778ff]' : 'text-blue-600') : ''}`} />
          <span className="flex-1 font-medium text-sm">{item.label[language]}</span>
          {hasSubItems && (
            <span className={`transition-transform ${isExpanded ? 'rotate-0' : ''}`}>
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </span>
          )}
        </button>

        {hasSubItems && isExpanded && (
          <div className="mt-1 ml-4 pl-4 border-l-2" style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb' }}>
            {filterSubItemsByRole(item.subItems).map((subItem) => {
              const subActive = isActive(subItem.path);
              const SubIcon = subItem.icon;
              return (
                <button
                  key={subItem.id}
                  onClick={() => {
                    if (subItem.id === 'create-course') {
                      handleCreateCourseClick();
                      return;
                    }
                    subItem.path && onMenuItemClick?.(subItem.id);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all text-sm ${
                    subActive
                      ? isDark
                        ? 'bg-white/10 text-white'
                        : 'bg-blue-50 text-blue-600'
                      : isDark
                      ? 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <SubIcon className="w-4 h-4" />
                  <span>{subItem.label[language]}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside
      className={`flex-shrink-0 py-4 pl-6 md:pl-12 lg:pl-16 pr-4 sticky top-0 h-[calc(100vh-64px)] w-[calc(theme(spacing.72)+theme(spacing.6))] md:w-[calc(theme(spacing.72)+theme(spacing.12))] lg:w-[calc(theme(spacing.72)+theme(spacing.16))] ${
        isDark ? 'bg-[#1e1e1e]' : 'bg-gray-50'
      }`}
    >
      <div
        className={`rounded-2xl p-4 h-full flex flex-col overflow-y-auto ${
          isDark
            ? 'bg-white/5 border border-white/10 backdrop-blur-sm'
            : 'bg-white border border-gray-200 shadow-sm'
        }`}
      >
        {/* 글로벌 역할 스위처 (디자이너 권한 + 강사 탭 기능이 활성화된 경우에만 표시) */}
        {isAdminOrDesigner && instructorTabEnabled && (
          <>
            <div className="mb-3">
              <GlobalRoleSwitcher
                currentRole="USER"
                isExpanded={true}
                language={language}
                colors={isDark ? {
                  bg: designTokens.darkMode.bg,
                  border: designTokens.darkMode.border,
                  textPrimary: designTokens.darkMode.textPrimary,
                  textSecondary: designTokens.darkMode.textSecondary,
                  hover: designTokens.darkMode.hover,
                  activeBg: designTokens.darkMode.activeBg,
                  activeText: designTokens.darkMode.activeText,
                  tooltipBg: designTokens.darkMode.tooltipBg,
                } : {
                  bg: designTokens.lightMode.bg,
                  border: designTokens.lightMode.border,
                  textPrimary: designTokens.lightMode.textPrimary,
                  textSecondary: designTokens.lightMode.textSecondary,
                  hover: designTokens.lightMode.hover,
                  activeBg: designTokens.lightMode.activeBg,
                  activeText: designTokens.lightMode.activeText,
                  tooltipBg: designTokens.lightMode.tooltipBg,
                }}
                isDarkMode={isDark}
              />
            </div>
            <div
              className="mb-3"
              style={{
                borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb'}`,
              }}
            />
          </>
        )}

        {/* 메뉴 리스트 */}
        <nav className="space-y-1 flex-1">
          {filteredMenuData.map(renderMenuItem)}
        </nav>
      </div>

      <AlertDialog open={showCreateCourseDialog} onOpenChange={setShowCreateCourseDialog}>
        <AlertDialogContent className={isDark ? 'bg-[#2a2a2a] border-white/10' : ''}>
          <AlertDialogHeader>
            <AlertDialogTitle className={isDark ? 'text-white' : ''}>
              {language === 'ko' ? '강의 디자인' : 'Course Design'}
            </AlertDialogTitle>
            <AlertDialogDescription className={isDark ? 'text-gray-300' : ''}>
              {getCreateCourseDialogDescription()}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isGrantingRole}
              className={isDark ? 'bg-transparent border-white/20 text-gray-200 hover:bg-white/10 hover:text-white' : ''}
            >
              {language === 'ko' ? '취소' : 'Cancel'}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleCreateCourseConfirm} disabled={isGrantingRole}>
              {isGrantingRole ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {language === 'ko' ? '처리 중...' : 'Processing...'}
                </>
              ) : (
                language === 'ko' ? '이동' : 'Proceed'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </aside>
  );
}
