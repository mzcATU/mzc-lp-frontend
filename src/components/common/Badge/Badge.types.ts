export type BadgeColor = 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'indigo' | 'purple' | 'gray';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | BadgeColor;
  className?: string;
}

export interface CategoryBadgeProps {
  category: string;
  className?: string;
}
