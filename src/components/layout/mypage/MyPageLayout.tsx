import { type ReactNode } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MyPageSidebar } from './MyPageSidebar';
import { LandingHeader, LandingFooter } from '@/components/landing';
import { myPageMenuData } from '@/config/sidebar-menus';
import { useUIStore, useIsDarkMode } from '@/store/common/uiStore';

interface MyPageLayoutProps {
  children: ReactNode;
}

export function MyPageLayout({ children }: MyPageLayoutProps) {
  const navigate = useNavigate();
  const { subdomain } = useParams<{ subdomain: string }>();
  const { isSidebarExpanded, language, toggleSidebar } = useUIStore();
  const isDarkMode = useIsDarkMode();

  // 서브도메인이 있으면 경로에 프리픽스 추가
  const prefixPath = (path: string) => {
    if (subdomain) {
      return `/${subdomain}${path}`;
    }
    return path;
  };

  const handleMenuItemClick = (itemId: string) => {
    // Check top-level menu items
    const menuItem = myPageMenuData.find((item) => item.id === itemId);
    if (menuItem?.path) {
      navigate(prefixPath(menuItem.path));
      return;
    }

    // Check subItems
    for (const item of myPageMenuData) {
      const subItem = item.subItems?.find((sub) => sub.id === itemId);
      if (subItem?.path) {
        navigate(prefixPath(subItem.path));
        return;
      }
    }
  };

  return (
    <div className={`flex flex-col min-h-screen ${isDarkMode ? 'landing-dark bg-[#1e1e1e]' : 'landing-light bg-gray-50'}`}>
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
