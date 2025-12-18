export type BadgeColor = 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'indigo' | 'purple' | 'gray';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'secondary' | 'destructive' | 'outline' | BadgeColor;
  className?: string;
}

export interface CategoryBadgeProps {
  category: string;
  className?: string;
}
