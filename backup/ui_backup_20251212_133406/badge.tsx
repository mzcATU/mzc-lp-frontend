import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/utils/cn';

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-md px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-btn-neutral text-white',
        brand: 'bg-btn-brand text-white',
        secondary: 'bg-bg-secondary text-text-primary',
        outline: 'border border-border text-text-primary',
        success: 'bg-status-success-bg text-status-success',
        warning: 'bg-status-warning-bg text-status-warning',
        error: 'bg-status-error-bg text-status-error',
        disabled: 'bg-status-disabled-bg text-status-disabled',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <span
        className={cn(badgeVariants({ variant }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Badge.displayName = 'Badge';

export { Badge, badgeVariants };
