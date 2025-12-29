import { Badge } from '@/components/common/Badge';

// 배지 variant 타입
type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'error' | 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'indigo' | 'purple' | 'gray';

// 시스템 역할
export type SystemRole = 'SUPER_ADMIN' | 'TENANT_ADMIN' | 'OPERATOR' | 'USER';

// 강의 역할
export type CourseRole = 'DESIGNER' | 'OWNER' | 'INSTRUCTOR' | 'TUTOR' | 'VIEWER';

interface RoleBadgeProps {
  role: SystemRole | CourseRole;
  className?: string;
}

const systemRoleConfig: Record<
  SystemRole,
  { label: { ko: string; en: string }; variant: BadgeVariant }
> = {
  SUPER_ADMIN: { label: { ko: '슈퍼 관리자', en: 'Super Admin' }, variant: 'purple' },
  TENANT_ADMIN: { label: { ko: '테넌트 관리자', en: 'Tenant Admin' }, variant: 'indigo' },
  OPERATOR: { label: { ko: '운영자', en: 'Operator' }, variant: 'blue' },
  USER: { label: { ko: '사용자', en: 'User' }, variant: 'gray' },
};

const courseRoleConfig: Record<
  CourseRole,
  { label: { ko: string; en: string }; variant: BadgeVariant }
> = {
  DESIGNER: { label: { ko: '설계자', en: 'Designer' }, variant: 'orange' },
  OWNER: { label: { ko: '소유자', en: 'Owner' }, variant: 'green' },
  INSTRUCTOR: { label: { ko: '강사', en: 'Instructor' }, variant: 'blue' },
  TUTOR: { label: { ko: '튜터', en: 'Tutor' }, variant: 'indigo' },
  VIEWER: { label: { ko: '열람자', en: 'Viewer' }, variant: 'gray' },
};

export function RoleBadge({ role, className }: RoleBadgeProps) {
  const isSystemRole = role in systemRoleConfig;
  const config = isSystemRole
    ? systemRoleConfig[role as SystemRole]
    : courseRoleConfig[role as CourseRole];

  // TODO: language store 연동
  const language = 'ko';

  return (
    <Badge variant={config.variant} className={className}>
      {config.label[language]}
    </Badge>
  );
}

// 여러 역할을 표시하는 컴포넌트
interface RoleBadgeListProps {
  roles: (SystemRole | CourseRole)[];
  className?: string;
  maxDisplay?: number;
}

export function RoleBadgeList({ roles, className, maxDisplay = 3 }: RoleBadgeListProps) {
  const displayRoles = roles.slice(0, maxDisplay);
  const remainingCount = roles.length - maxDisplay;

  return (
    <div className={`flex flex-wrap gap-1 ${className}`}>
      {displayRoles.map((role) => (
        <RoleBadge key={role} role={role} />
      ))}
      {remainingCount > 0 && (
        <Badge variant="gray">+{remainingCount}</Badge>
      )}
    </div>
  );
}
