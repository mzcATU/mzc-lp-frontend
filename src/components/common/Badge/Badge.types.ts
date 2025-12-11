export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'custom';
  className?: string;
  customBg?: string;
  customText?: string;
}

export interface CategoryBadgeProps {
  category: string;
  className?: string;
}
