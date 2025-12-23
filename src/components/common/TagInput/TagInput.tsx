import { useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { formStyles } from '@/styles/form';
import { Badge } from '../Badge';
import type { TagInputProps } from './TagInput.types';

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
      {label && <label className={formStyles.label}>{label}</label>}
      {hint && <p className={formStyles.hint}>{hint}</p>}
      <input
        type="text"
        data-slot="input"
        value={inputValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        className={cn(formStyles.input, error && formStyles.errorBorder, className)}
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
      {error && <p className={formStyles.error}>{error}</p>}
    </div>
  );
};
