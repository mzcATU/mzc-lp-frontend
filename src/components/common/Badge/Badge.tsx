import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';
import type { BadgeProps, CategoryBadgeProps, BadgeColor } from './Badge.types';

export const badgeVariants = cva(
  'inline-flex items-center px-3 py-1 rounded-md text-xs font-medium',
  {
    variants: {
      variant: {
        // Status variants
        default: 'bg-bg-secondary text-text-secondary',
        secondary: 'bg-bg-secondary text-text-primary',
        destructive: 'bg-status-error-bg text-status-error',
        outline: 'border border-border text-text-primary',
        success: 'bg-status-success-bg text-status-success',
        warning: 'bg-status-warning-bg text-status-warning',
        error: 'bg-status-error-bg text-status-error',
        // Badge color variants (뮤트 톤)
        red: 'bg-badge-red-bg text-badge-red',
        orange: 'bg-badge-orange-bg text-badge-orange',
        yellow: 'bg-badge-yellow-bg text-badge-yellow',
        green: 'bg-badge-green-bg text-badge-green',
        blue: 'bg-badge-blue-bg text-badge-blue',
        indigo: 'bg-badge-indigo-bg text-badge-indigo',
        purple: 'bg-badge-purple-bg text-badge-purple',
        gray: 'bg-badge-gray-bg text-badge-gray',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export const Badge = ({
  children,
  variant,
  className,
}: BadgeProps & VariantProps<typeof badgeVariants>) => {
  return (
    <span className={cn(badgeVariants({ variant }), className)}>
      {children}
    </span>
  );
};

// 카테고리별 Badge 컬러 매핑
const categoryColorMap: Record<string, BadgeColor> = {
  프로그래밍: 'blue',
  백엔드: 'green',
  '개발 도구': 'orange',
  프론트엔드: 'purple',
  데이터베이스: 'red',
};

export const CategoryBadge = ({ category, className }: CategoryBadgeProps) => {
  const colorVariant = categoryColorMap[category] || 'gray';

  return (
    <Badge variant={colorVariant} className={className}>
      {category}
    </Badge>
  );
};
