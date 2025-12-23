import { cn } from '@/utils/cn';
import { inputVariants, labelStyles, errorStyles } from '@/styles/form';
import type { InputProps } from './Input.types';

export const Input = ({ label, error, className, type, ...props }: InputProps) => {
  return (
    <div>
      {label && <label className={labelStyles}>{label}</label>}
      <input
        type={type}
        data-slot="input"
        className={cn(inputVariants({ state: error ? 'error' : 'default' }), className)}
        {...props}
      />
      {error && <p className={errorStyles}>{error}</p>}
    </div>
  );
};
