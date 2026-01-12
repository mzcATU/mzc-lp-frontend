import { type ReactNode } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CourseOperatorSidebar } from './CourseOperatorSidebar';
import { SystemNoticePopup } from '@/components/domain/admin';
import { designTokens } from '@/styles/admin-design-tokens';
import { courseOperatorMenuData } from '@/config/sidebar-menus';
import { useUIStore, useIsDarkMode } from '@/store/common/uiStore';

interface CourseOperatorLayoutProps {
  children: ReactNode;
}

export function CourseOperatorLayout({
  children,
}: CourseOperatorLayoutProps) {
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
    const menuItem = courseOperatorMenuData.find((item) => item.id === itemId);
    if (menuItem?.path) {
      navigate(prefixPath(menuItem.path));
      return;
    }

    // Check subItems
    for (const item of courseOperatorMenuData) {
      const subItem = item.subItems?.find((sub) => sub.id === itemId);
      if (subItem?.path) {
        navigate(prefixPath(subItem.path));
        return;
      }
    }
  };

  return (
    <div
      className="flex h-screen"
      style={{ backgroundColor: designTokens.bg.app_default }}
    >
      <CourseOperatorSidebar
        isExpanded={isSidebarExpanded}
        onToggle={toggleSidebar}
        onMenuItemClick={handleMenuItemClick}
        isDarkMode={isDarkMode}
        language={language}
      />

      <main className="flex-1 overflow-auto">{children}</main>

      {/* SA/TA 시스템 공지 팝업 */}
      <SystemNoticePopup />
    </div>
  );
}
