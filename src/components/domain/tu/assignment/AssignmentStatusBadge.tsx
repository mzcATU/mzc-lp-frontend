/**
 * 배정 상태 Badge 컴포넌트
 */
import { Badge } from '@/components/common';
import type { AssignmentStatus } from '@/types/tu';
import { ASSIGNMENT_STATUS_LABELS } from '@/types/tu';

interface AssignmentStatusBadgeProps {
  status: AssignmentStatus;
  language?: 'ko' | 'en';
  className?: string;
}

const statusVariantMap: Record<AssignmentStatus, 'success' | 'warning' | 'error'> = {
  ACTIVE: 'success',
  REPLACED: 'warning',
  CANCELLED: 'error',
};

export function AssignmentStatusBadge({
  status,
  language = 'ko',
  className,
}: Readonly<AssignmentStatusBadgeProps>) {
  const label = ASSIGNMENT_STATUS_LABELS[status][language];
  const variant = statusVariantMap[status];

  return (
    <Badge variant={variant} className={className}>
      {label}
    </Badge>
  );
}
