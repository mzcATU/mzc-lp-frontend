import type { LucideIcon } from 'lucide-react';

export interface TimelineItemProps {
  title: string;
  description?: string;
  time?: string;
  icon?: LucideIcon;
  iconClassName?: string;
  isLast?: boolean;
  children?: React.ReactNode;
}

export interface TimelineProps {
  children: React.ReactNode;
  className?: string;
}

export interface HorizontalTimelineItemProps {
  title: string;
  description?: string;
  isActive?: boolean;
  isCompleted?: boolean;
  isLast?: boolean;
}

export interface HorizontalTimelineProps {
  children: React.ReactNode;
  className?: string;
}
