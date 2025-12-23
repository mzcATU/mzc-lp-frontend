import { cn } from '@/utils/cn';
import type { InputProps } from './Input.types';

const baseInputStyles =
  'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base bg-input-background transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive';

const labelStyles = 'block text-sm font-medium text-text-primary mb-1';

const errorStyles = 'text-sm text-status-error mt-1';

export const Input = ({ label, error, className, type, ...props }: InputProps) => {
  return (
    <div>
      {label && <label className={labelStyles}>{label}</label>}
      <input
        type={type}
        data-slot="input"
        className={cn(baseInputStyles, error && 'border-status-error', className)}
        {...props}
      />
      {error && <p className={errorStyles}>{error}</p>}
    </div>
  );
};
