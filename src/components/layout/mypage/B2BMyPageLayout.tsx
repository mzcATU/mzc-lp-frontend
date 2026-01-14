import { type ReactNode } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { B2BMyPageSidebar } from './B2BMyPageSidebar';
import { LandingFooter } from '@/components/landing';
import { B2BLandingHeader } from '@/pages/tu/b2b/components/B2BLandingHeader';
import { b2bMyPageMenuData } from '@/config/sidebar-menus';
import { useUIStore, useIsDarkMode } from '@/store/common/uiStore';

interface B2BMyPageLayoutProps {
  children: ReactNode;
}

export function B2BMyPageLayout({ children }: B2BMyPageLayoutProps) {
  const navigate = useNavigate();
  const { subdomain } = useParams<{ subdomain: string }>();
  const { isSidebarExpanded, language, toggleSidebar } = useUIStore();
  const isDarkMode = useIsDarkMode();

  const prefixPath = (path: string) => {
    if (subdomain) {
      return `/${subdomain}${path}`;
    }
    return path;
  };

  const handleMenuItemClick = (itemId: string) => {
    const menuItem = b2bMyPageMenuData.find((item) => item.id === itemId);
    if (menuItem?.path) {
      navigate(prefixPath(menuItem.path));
      return;
    }

    for (const item of b2bMyPageMenuData) {
      const subItem = item.subItems?.find((sub) => sub.id === itemId);
      if (subItem?.path) {
        navigate(prefixPath(subItem.path));
        return;
      }
    }
  };

  return (
    <div className={`flex flex-col min-h-screen ${isDarkMode ? 'landing-dark bg-[#1e1e1e]' : 'landing-light bg-gray-50'}`}>
      <B2BLandingHeader />

      <div className="flex flex-1">
        <B2BMyPageSidebar
          isExpanded={isSidebarExpanded}
          onToggle={toggleSidebar}
          onMenuItemClick={handleMenuItemClick}
          isDarkMode={isDarkMode}
          language={language}
          subdomain={subdomain}
        />

        <main className="flex-1 overflow-auto">{children}</main>
      </div>

      <LandingFooter />
    </div>
  );
}
