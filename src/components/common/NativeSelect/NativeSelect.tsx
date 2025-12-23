import { cn } from '@/utils/cn';
import type { NativeSelectProps } from './NativeSelect.types';

const baseInputStyles =
  'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base bg-input-background transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive';

const labelStyles = 'block text-sm font-medium text-text-primary mb-1';

const errorStyles = 'text-sm text-status-error mt-1';

export const NativeSelect = ({ label, error, options, className, ...props }: NativeSelectProps) => {
  return (
    <div>
      {label && <label className={labelStyles}>{label}</label>}
      <select
        data-slot="select"
        className={cn(baseInputStyles, 'cursor-pointer', error && 'border-status-error', className)}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className={errorStyles}>{error}</p>}
    </div>
  );
};
