import type { InputHTMLAttributes, ReactNode } from 'react';

export interface TagInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  label?: ReactNode;
  hint?: string;
  error?: string;
  value: string[];
  onChange: (tags: string[]) => void;
}
