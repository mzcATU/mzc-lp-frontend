import { cn } from '@/utils/cn';
import { selectVariants, labelStyles, errorStyles } from '@/styles/form';
import type { NativeSelectProps } from './NativeSelect.types';

export const NativeSelect = ({ label, error, options, className, ...props }: NativeSelectProps) => {
  return (
    <div>
      {label && <label className={labelStyles}>{label}</label>}
      <select
        data-slot="select"
        className={cn(selectVariants({ state: error ? 'error' : 'default' }), className)}
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
