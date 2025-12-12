import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';
import type { ButtonProps } from './Button.types';

const buttonVariants = cva(
  'inline-flex items-center justify-center font-medium transition-colors rounded-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        neutral: 'bg-btn-neutral text-white hover:bg-btn-neutral-hover',
        brand: 'bg-btn-brand text-white hover:bg-btn-brand-hover',
        ghost: 'bg-transparent text-text-secondary hover:bg-bg-secondary',
        danger: 'bg-status-error-bg text-status-error hover:bg-red-100',
      },
      size: {
        sm: 'h-8 px-3 text-sm gap-1',
        md: 'h-10 px-4 gap-2',
        lg: 'h-12 px-6 text-lg gap-2',
      },
    },
    defaultVariants: {
      variant: 'brand',
      size: 'md',
    },
  }
);

export const Button = ({
  className,
  variant,
  size,
  children,
  ...props
}: ButtonProps & VariantProps<typeof buttonVariants>) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </button>
  );
};
