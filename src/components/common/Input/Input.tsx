import { cn } from '@/utils/cn';
import { formStyles } from '@/styles/form';
import type { InputProps } from './Input.types';

export const Input = ({ label, error, className, type, ...props }: InputProps) => {
  return (
    <div>
      {label && <label className={formStyles.label}>{label}</label>}
      <input
        type={type}
        data-slot="input"
        className={cn(formStyles.input, error && formStyles.errorBorder, className)}
        {...props}
      />
      {error && <p className={formStyles.error}>{error}</p>}
    </div>
  );
};
