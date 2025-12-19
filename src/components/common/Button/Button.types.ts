import type { ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'neutral' | 'brand' | 'danger';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  children?: React.ReactNode;
}
