import { cn } from '@/utils/cn';
import { formStyles } from '@/styles/form';
import type { NativeSelectProps } from './NativeSelect.types';

export const NativeSelect = ({ label, error, options, className, ...props }: NativeSelectProps) => {
  return (
    <div>
      {label && <label className={formStyles.label}>{label}</label>}
      <select
        data-slot="select"
        className={cn(formStyles.input, 'cursor-pointer', error && formStyles.errorBorder, className)}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className={formStyles.error}>{error}</p>}
    </div>
  );
};
