import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';
import type { BadgeProps, CategoryBadgeProps, BadgeColor } from './Badge.types';

export const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90',
        destructive:
          'border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          'text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
        // Status variants
        success: 'border-transparent bg-status-success-bg text-status-success',
        warning: 'border-transparent bg-status-warning-bg text-status-warning',
        error: 'border-transparent bg-status-error-bg text-status-error',
        // Badge color variants (뮤트 톤)
        red: 'border-transparent bg-badge-red-bg text-badge-red',
        orange: 'border-transparent bg-badge-orange-bg text-badge-orange',
        yellow: 'border-transparent bg-badge-yellow-bg text-badge-yellow',
        green: 'border-transparent bg-badge-green-bg text-badge-green',
        blue: 'border-transparent bg-badge-blue-bg text-badge-blue',
        indigo: 'border-transparent bg-badge-indigo-bg text-badge-indigo',
        purple: 'border-transparent bg-badge-purple-bg text-badge-purple',
        gray: 'border-transparent bg-badge-gray-bg text-badge-gray',
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
  asChild = false,
  ...props
}: BadgeProps & VariantProps<typeof badgeVariants> & { asChild?: boolean }) => {
  const Comp = asChild ? Slot : 'span';

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    >
      {children}
    </Comp>
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
