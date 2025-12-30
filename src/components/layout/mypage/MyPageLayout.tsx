import { type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { MyPageSidebar } from './MyPageSidebar';
import { LandingHeader, LandingFooter } from '@/components/landing';
import { myPageMenuData } from '@/config/sidebar-menus';
import { useUIStore } from '@/store/common/uiStore';
import { useThemeStore } from '@/store/common/themeStore';

interface MyPageLayoutProps {
  children: ReactNode;
}

export function MyPageLayout({ children }: MyPageLayoutProps) {
  const navigate = useNavigate();
  const { isSidebarExpanded, isDarkMode, language, toggleSidebar } = useUIStore();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const handleMenuItemClick = (itemId: string) => {
    // Check top-level menu items
    const menuItem = myPageMenuData.find((item) => item.id === itemId);
    if (menuItem?.path) {
      navigate(menuItem.path);
      return;
    }

    // Check subItems
    for (const item of myPageMenuData) {
      const subItem = item.subItems?.find((sub) => sub.id === itemId);
      if (subItem?.path) {
        navigate(subItem.path);
        return;
      }
    }
  };

  return (
    <div className={`flex flex-col min-h-screen ${isDark ? 'landing-dark bg-[#1e1e1e]' : 'landing-light bg-gray-50'}`}>
      {/* 상단 헤더 */}
      <LandingHeader />

      {/* 메인 영역: 사이드바 + 콘텐츠 */}
      <div className="flex flex-1">
        <MyPageSidebar
          isExpanded={isSidebarExpanded}
          onToggle={toggleSidebar}
          onMenuItemClick={handleMenuItemClick}
          isDarkMode={isDarkMode}
          language={language}
        />

        <main className="flex-1 overflow-auto">{children}</main>
      </div>

      {/* 하단 푸터 */}
      <LandingFooter />
    </div>
  );
}
