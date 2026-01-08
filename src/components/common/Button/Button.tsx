import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';
import type { ButtonProps } from './Button.types';

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary-hover',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-border bg-white text-text-primary hover:bg-bg-secondary',
        secondary: 'border border-border bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground text-text-primary',
        link: 'text-primary underline-offset-4 hover:underline',
        // 디자인 토큰 기반 버튼 variants
        neutral: 'bg-btn-neutral text-white hover:bg-btn-neutral-hover',
        brand: 'bg-btn-brand text-white hover:bg-btn-brand-hover',
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
