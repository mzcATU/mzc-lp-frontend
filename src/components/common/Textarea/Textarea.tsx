import { cn } from '@/utils/cn';
import { textareaVariants, labelStyles, errorStyles } from '@/styles/form';
import type { TextareaProps } from './Textarea.types';

export const Textarea = ({ label, error, className, ...props }: TextareaProps) => {
  return (
    <div>
      {label && <label className={labelStyles}>{label}</label>}
      <textarea
        data-slot="textarea"
        className={cn(textareaVariants({ state: error ? 'error' : 'default' }), className)}
        {...props}
      />
      {error && <p className={errorStyles}>{error}</p>}
    </div>
  );
};
