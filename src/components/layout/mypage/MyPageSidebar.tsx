import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight, Sun, Moon, Globe } from 'lucide-react';
import { myPageMenuData } from '@/config/sidebar-menus';
import { useThemeStore } from '@/store/common/themeStore';
import { useLanguageStore, useTranslation } from '@/store/common/languageStore';
import { useAuthStore } from '@/store/common/authStore';
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
}

export function MyPageSidebar({ onMenuItemClick }: MyPageSidebarProps) {
  const location = useLocation();
  const { theme, toggleTheme } = useThemeStore();
  const { language, toggleLanguage } = useLanguageStore();
  const { t } = useTranslation();
  const { user, updateUser } = useAuthStore();
  const isDark = theme === 'dark';
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['my-enrollments', 'my-teaching', 'mypage-settings']);
  const [showCreateCourseDialog, setShowCreateCourseDialog] = useState(false);

  // 강의 개설하기 클릭 핸들러
  const handleCreateCourseClick = () => {
    setShowCreateCourseDialog(true);
  };

  const handleCreateCourseConfirm = () => {
    // USER인 경우 DESIGNER 권한 부여
    if (user?.role === 'USER') {
      updateUser({ role: 'DESIGNER' });
    }
    setShowCreateCourseDialog(false);
    onMenuItemClick?.('create-course');
  };

  // 강의 개설 다이얼로그 설명 텍스트
  const getCreateCourseDialogDescription = () => {
    if (user?.role === 'USER') {
      return language === 'ko'
        ? '강의 개설을 위해 디자이너 권한이 부여됩니다. 강의 설계 / 개설 페이지로 이동하시겠습니까?'
        : 'Designer permission will be granted for course creation. Would you like to proceed to the course design / creation page?';
    }
    return language === 'ko'
      ? '강의 설계 / 개설 페이지로 이동하시겠습니까?'
      : 'Would you like to proceed to the course design / creation page?';
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

      {/* 강의 개설 확인 다이얼로그 */}
      <AlertDialog open={showCreateCourseDialog} onOpenChange={setShowCreateCourseDialog}>
        <AlertDialogContent className={isDark ? 'bg-[#2a2a2a] border-white/10' : ''}>
          <AlertDialogHeader>
            <AlertDialogTitle className={isDark ? 'text-white' : ''}>
              {language === 'ko' ? '강의 설계 / 개설' : 'Course Design / Creation'}
            </AlertDialogTitle>
            <AlertDialogDescription className={isDark ? 'text-gray-300' : ''}>
              {getCreateCourseDialogDescription()}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className={isDark ? 'bg-transparent border-white/20 text-gray-200 hover:bg-white/10 hover:text-white' : ''}>
              {language === 'ko' ? '취소' : 'Cancel'}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleCreateCourseConfirm}>
              {language === 'ko' ? '이동' : 'Proceed'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </aside>
  );
}
