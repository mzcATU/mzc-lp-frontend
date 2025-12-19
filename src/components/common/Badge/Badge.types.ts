export type BadgeColor = 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'indigo' | 'purple' | 'gray';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'error' | BadgeColor;
  className?: string;
}

export interface CategoryBadgeProps {
  category: string;
  className?: string;
}
