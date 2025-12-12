import { cn } from '@/utils/cn';
import type { InputProps, TextareaProps, SelectProps } from './Input.types';

const baseInputStyles =
  'w-full px-3 py-2 border border-border rounded-md bg-bg-default text-text-primary placeholder:text-text-placeholder focus:outline-none focus:ring-2 focus:ring-action-primary focus:border-transparent transition-colors';

const labelStyles = 'block text-sm font-medium text-text-primary mb-1';

const errorStyles = 'text-sm text-status-error mt-1';

export const Input = ({ label, error, className, ...props }: InputProps) => {
  return (
    <div>
      {label && <label className={labelStyles}>{label}</label>}
      <input
        className={cn(baseInputStyles, error && 'border-status-error', className)}
        {...props}
      />
      {error && <p className={errorStyles}>{error}</p>}
    </div>
  );
};

export const Textarea = ({ label, error, className, ...props }: TextareaProps) => {
  return (
    <div>
      {label && <label className={labelStyles}>{label}</label>}
      <textarea
        className={cn(baseInputStyles, 'min-h-[100px] resize-y', error && 'border-status-error', className)}
        {...props}
      />
      {error && <p className={errorStyles}>{error}</p>}
    </div>
  );
};

export const Select = ({ label, error, options, className, ...props }: SelectProps) => {
  return (
    <div>
      {label && <label className={labelStyles}>{label}</label>}
      <select
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
