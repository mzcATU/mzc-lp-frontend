import { cn } from '@/utils/cn';
import { formStyles } from '@/styles/form';
import type { TextareaProps } from './Textarea.types';

export const Textarea = ({ label, error, className, ...props }: TextareaProps) => {
  return (
    <div>
      {label && <label className={formStyles.label}>{label}</label>}
      <textarea
        data-slot="textarea"
        className={cn(formStyles.textarea, error && formStyles.errorBorder, className)}
        {...props}
      />
      {error && <p className={formStyles.error}>{error}</p>}
    </div>
  );
};
