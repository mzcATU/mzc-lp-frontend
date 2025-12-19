import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';
import type { ButtonProps } from './Button.types';

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        default: 'bg-btn-brand text-white hover:bg-btn-brand-hover',
        destructive: 'bg-status-error text-white hover:bg-status-error/90',
        outline: 'border border-border bg-transparent hover:bg-bg-secondary text-text-primary',
        secondary: 'bg-bg-secondary text-text-primary hover:bg-bg-secondary/80',
        ghost: 'bg-transparent text-text-secondary hover:bg-bg-secondary',
        link: 'text-action-primary underline-offset-4 hover:underline',
        neutral: 'bg-btn-neutral text-white hover:bg-btn-neutral-hover',
        brand: 'bg-btn-brand text-white hover:bg-btn-brand-hover',
        danger: 'bg-status-error-bg text-status-error hover:bg-status-error-bg/80',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4',
        lg: 'h-12 px-6 text-lg',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export const Button = ({
  className,
  variant,
  size,
  asChild = false,
  children,
  ...props
}: ButtonProps & VariantProps<typeof buttonVariants> & { asChild?: boolean }) => {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {children}
    </Comp>
  );
};
