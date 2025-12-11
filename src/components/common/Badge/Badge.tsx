import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';
import type { BadgeProps, CategoryBadgeProps } from './Badge.types';

const badgeVariants = cva(
  'inline-flex items-center px-3 py-1 rounded-md text-xs font-medium',
  {
    variants: {
      variant: {
        default: 'bg-bg-secondary text-text-secondary',
        success: 'bg-status-success-bg text-status-success',
        warning: 'bg-status-warning-bg text-status-warning',
        error: 'bg-status-error-bg text-status-error',
        custom: '',
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
  customBg,
  customText,
}: BadgeProps & VariantProps<typeof badgeVariants>) => {
  const customStyle =
    variant === 'custom' && customBg && customText
      ? { backgroundColor: customBg, color: customText }
      : undefined;

  return (
    <span className={cn(badgeVariants({ variant }), className)} style={customStyle}>
      {children}
    </span>
  );
};

// 카테고리별 색상 매핑
const categoryColors: Record<string, { bg: string; text: string }> = {
  프로그래밍: { bg: '#E3F2FD', text: '#1565C0' },
  백엔드: { bg: '#E8F5E9', text: '#2E7D32' },
  '개발 도구': { bg: '#FFF3E0', text: '#E65100' },
  프론트엔드: { bg: '#F3E5F5', text: '#7B1FA2' },
  데이터베이스: { bg: '#FFEBEE', text: '#C62828' },
  default: { bg: '#F5F5F5', text: '#616161' },
};

const getCategoryColor = (category: string) => {
  return categoryColors[category] || categoryColors.default;
};

export const CategoryBadge = ({ category, className }: CategoryBadgeProps) => {
  const colors = getCategoryColor(category);

  return (
    <Badge variant="custom" customBg={colors.bg} customText={colors.text} className={className}>
      {category}
    </Badge>
  );
};
