import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronRight, Sun, Moon, Globe, Loader2, BookOpen, GraduationCap } from 'lucide-react';
import { toast } from 'sonner';
import { myPageMenuData } from '@/config/sidebar-menus';
import { useThemeStore } from '@/store/common/themeStore';
import { useLanguageStore, useTranslation } from '@/store/common/languageStore';
import { useAuthStore } from '@/store/common/authStore';
import { userService } from '@/services/common/userService';
import { authService } from '@/services/common/authService';
import { useSubdomainPath } from '@/hooks/common';
import { cn } from '@/utils/cn';
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

interface MyPageSidebarProps {
  isExpanded: boolean;
  onToggle: () => void;
  onMenuItemClick?: (itemId: string) => void;
  isDarkMode?: boolean;
  language?: 'ko' | 'en';
  subdomain?: string;
}

type ViewMode = 'instructor' | 'learner';

export function MyPageSidebar({ onMenuItemClick }: MyPageSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { prefixPath } = useSubdomainPath();

  const { theme, toggleTheme } = useThemeStore();
  const { language, toggleLanguage } = useLanguageStore();
  const { t } = useTranslation();
  const { user, updateUser } = useAuthStore();
  const isDark = theme === 'dark';
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['my-enrollments', 'my-teaching', 'mypage-settings']);
  const [currentMode, setCurrentMode] = useState<ViewMode>('learner');
  const [showCreateCourseDialog, setShowCreateCourseDialog] = useState(false);
  const [isGrantingRole, setIsGrantingRole] = useState(false);
  // USER: 권한 없음, INSTRUCTOR: 강사, DESIGNER: 강의 개설 권한, OWNER: 강의 소유자
  const [courseRoleStatus, setCourseRoleStatus] = useState<'USER' | 'INSTRUCTOR' | 'DESIGNER' | 'OWNER'>('USER');

  // CourseRole API로 역할 확인
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

  // 사용자가 강사/디자이너 역할을 가지고 있는지 확인 (CourseRole 기준)
  const isDesigner = courseRoleStatus !== 'USER';

  // 강의 개설하기 클릭 핸들러
  const handleCreateCourseClick = () => {
    setShowCreateCourseDialog(true);
  };

  const handleCreateCourseConfirm = async () => {
    // 이미 DESIGNER인 경우 바로 이동
    if (isDesigner) {
      setShowCreateCourseDialog(false);
      onMenuItemClick?.('create-course');
      return;
    }

    setIsGrantingRole(true);
    try {
      // DESIGNER 역할 부여 API 호출
      await userService.applyDesignerRole();

      // 토큰 갱신 (CourseRole이 반영된 새 토큰 발급)
      const refreshToken = useAuthStore.getState().refreshToken;
      if (refreshToken) {
        const tokenResponse = await authService.refresh(refreshToken);
        useAuthStore.getState().setTokens(tokenResponse.accessToken, tokenResponse.refreshToken);
      }

      // 사용자 정보 다시 조회하여 역할 업데이트
      const updatedUser = await userService.getMe();
      updateUser({ role: updatedUser.role });

      toast.success(language === 'ko' ? '강의 디자인 권한이 부여되었습니다.' : 'Designer permission granted.');
      setShowCreateCourseDialog(false);
      onMenuItemClick?.('create-course');
    } catch (error) {
      // 409 Conflict = 이미 DESIGNER 역할을 가지고 있음
      const axiosError = error as { response?: { status?: number } };
      if (axiosError.response?.status === 409) {
        // 토큰 갱신 (이미 권한이 있어도 토큰에 반영 필요)
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

  // 강의 디자인 다이얼로그 설명 텍스트
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

  // 현재 유저 롤로 subItem 필터링
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

  const isActive = (path?: string) => {
    if (!path) return false;
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const renderMenuItem = (item: MenuItem) => {
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isExpanded = expandedMenus.includes(item.id);
    const active = isActive(item.path);
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

        {/* Sub Items */}
        {hasSubItems && isExpanded && (
          <div className="mt-1 ml-4 pl-4 border-l-2" style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb' }}>
            {filterSubItemsByRole(item.subItems).map((subItem) => {
              const subActive = isActive(subItem.path);
              const SubIcon = subItem.icon;
              return (
                <button
                  key={subItem.id}
                  onClick={() => {
                    // 강의 개설하기 클릭 시 확인 다이얼로그 표시
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
      className={`w-72 flex-shrink-0 p-4 ${
        isDark ? 'bg-[#1e1e1e]' : 'bg-gray-50'
      }`}
    >
      {/* 카드형 사이드바 */}
      <div
        className={`rounded-2xl p-4 h-full flex flex-col ${
          isDark
            ? 'bg-white/5 border border-white/10 backdrop-blur-sm'
            : 'bg-white border border-gray-200 shadow-sm'
        }`}
      >
        {/* 모드 스위처 (디자이너 권한이 있는 경우에만 표시) */}
        {isDesigner && (
          <>
            <div
              className="relative rounded-lg p-1 mb-3"
              style={{
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
              }}
            >
              <div className="flex gap-1">
                <button
                  onClick={() => {
                    setCurrentMode('instructor');
                    navigate(prefixPath('/tu/dashboard'));
                  }}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md',
                    'transition-all duration-200 text-sm font-medium whitespace-nowrap'
                  )}
                  style={{
                    backgroundColor: currentMode === 'instructor'
                      ? (isDark ? '#7C5CBF' : '#D4CDEF')
                      : 'transparent',
                    color: currentMode === 'instructor'
                      ? (isDark ? '#FFFFFF' : '#4C2D9A')
                      : (isDark ? '#9E9E9E' : '#666666'),
                  }}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>{language === 'ko' ? '강사' : 'Instructor'}</span>
                </button>
                <button
                  onClick={() => {
                    setCurrentMode('learner');
                    navigate(prefixPath('/tu/b2c/mypage'));
                  }}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md',
                    'transition-all duration-200 text-sm font-medium whitespace-nowrap'
                  )}
                  style={{
                    backgroundColor: currentMode === 'learner'
                      ? (isDark ? '#7C5CBF' : '#D4CDEF')
                      : 'transparent',
                    color: currentMode === 'learner'
                      ? (isDark ? '#FFFFFF' : '#4C2D9A')
                      : (isDark ? '#9E9E9E' : '#666666'),
                  }}
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>{language === 'ko' ? '학습자' : 'Learner'}</span>
                </button>
              </div>
            </div>
            {/* 구분선 */}
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
          {myPageMenuData.map(renderMenuItem)}
        </nav>

        {/* 설정 토글 영역 */}
        <div className={`mt-4 pt-4 border-t space-y-2 ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
          {/* 테마 토글 */}
          <button
            onClick={toggleTheme}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
              isDark
                ? 'bg-white/5 hover:bg-white/10 text-gray-300'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            <div className="flex items-center gap-3">
              {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              <span className="font-medium text-sm">
                {isDark ? t.common.darkMode : t.common.lightMode}
              </span>
            </div>
            <div
              className={`w-12 h-6 rounded-full p-1 transition-colors ${
                isDark ? 'bg-[#6778ff]' : 'bg-gray-300'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white shadow-md transition-transform ${
                  isDark ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </div>
          </button>

          {/* 언어 토글 */}
          <button
            onClick={toggleLanguage}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
              isDark
                ? 'bg-white/5 hover:bg-white/10 text-gray-300'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5" />
              <span className="font-medium text-sm">
                {t.settings.language}
              </span>
            </div>
            <div
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                isDark
                  ? 'bg-[#6778ff]/20 text-[#6778ff]'
                  : 'bg-blue-100 text-blue-600'
              }`}
            >
              {language === 'ko' ? '한국어' : 'EN'}
            </div>
          </button>
        </div>
      </div>

      {/* 강의 디자인 확인 다이얼로그 */}
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
