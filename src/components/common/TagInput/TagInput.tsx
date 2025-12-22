import { useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Badge } from '../Badge';
import type { TagInputProps } from './TagInput.types';

const baseInputStyles =
  'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base bg-input-background transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]';

const labelStyles = 'block text-sm font-medium text-text-primary mb-1';

const hintStyles = 'text-sm text-text-secondary mb-2';

const errorStyles = 'text-sm text-status-error mt-1';

export const TagInput = ({
  label,
  hint,
  error,
  value,
  onChange,
  placeholder = '태그를 입력하세요 (쉼표로 구분)',
  className,
  ...props
}: TagInputProps) => {
  const [inputValue, setInputValue] = useState(value.join(', '));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    const tags = newValue
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag);
    onChange(tags);
  };

  const handleRemoveTag = (indexToRemove: number) => {
    const newTags = value.filter((_, index) => index !== indexToRemove);
    onChange(newTags);
    setInputValue(newTags.join(', '));
  };

  return (
    <div>
      {label && <label className={labelStyles}>{label}</label>}
      {hint && <p className={hintStyles}>{hint}</p>}
      <input
        type="text"
        data-slot="input"
        value={inputValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        className={cn(baseInputStyles, error && 'border-status-error', className)}
        {...props}
      />
      {value.length > 0 && (
        <div className="flex gap-2 flex-wrap mt-3">
          {value.map((tag, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="flex items-center gap-1 pr-1"
            >
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(index)}
                className="p-0.5 rounded-full hover:bg-bg-secondary transition-colors"
              >
                <X size={14} />
              </button>
            </Badge>
          ))}
        </div>
      )}
      {error && <p className={errorStyles}>{error}</p>}
    </div>
  );
};
