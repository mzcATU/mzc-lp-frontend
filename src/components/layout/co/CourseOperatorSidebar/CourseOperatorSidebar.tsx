import { BaseSidebar } from '../../common/BaseSidebar';
import { courseOperatorMenuData, roleLabels } from '@/config/sidebar-menus';

interface CourseOperatorSidebarProps {
  isExpanded: boolean;
  onToggle: () => void;
  onMenuItemClick?: (itemId: string) => void;
  isDarkMode?: boolean;
  language?: 'ko' | 'en';
}

export function CourseOperatorSidebar(props: CourseOperatorSidebarProps) {
  return (
    <BaseSidebar
      {...props}
      menuData={courseOperatorMenuData}
      roleLabel={roleLabels.courseOperator}
      roleType="co"
    />
  );
}
