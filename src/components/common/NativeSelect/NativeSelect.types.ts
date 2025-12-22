import type { SelectHTMLAttributes, ReactNode } from 'react';

export interface NativeSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: ReactNode;
  error?: string;
  options: { value: string; label: string }[];
}
