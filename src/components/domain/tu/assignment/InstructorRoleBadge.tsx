/**
 * 강사 역할 Badge 컴포넌트
 */
import { Badge } from '@/components/common';
import type { InstructorRole } from '@/types/tu';
import { INSTRUCTOR_ROLE_LABELS } from '@/types/tu';

interface InstructorRoleBadgeProps {
  role: InstructorRole;
  language?: 'ko' | 'en';
  className?: string;
}

const roleVariantMap: Record<InstructorRole, 'blue' | 'purple' | 'gray'> = {
  MAIN: 'blue',
  SUB: 'purple',
  ASSISTANT: 'gray',
};

export function InstructorRoleBadge({
  role,
  language = 'ko',
  className,
}: Readonly<InstructorRoleBadgeProps>) {
  const label = INSTRUCTOR_ROLE_LABELS[role][language];
  const variant = roleVariantMap[role];

  return (
    <Badge variant={variant} className={className}>
      {label}
    </Badge>
  );
}
