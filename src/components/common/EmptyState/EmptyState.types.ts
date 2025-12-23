import type { LucideIcon } from 'lucide-react';

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  iconClassName?: string;
}

export interface NoResultsEmptyProps {
  searchTerm?: string;
  onClear?: () => void;
  className?: string;
}

export interface NoDataEmptyProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export interface ErrorEmptyProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}
