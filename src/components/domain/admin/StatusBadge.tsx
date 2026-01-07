import { Badge } from '@/components/common/Badge';

// 배지 variant 타입
type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'error' | 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'indigo' | 'purple' | 'gray';

// 테넌트 상태
export type TenantStatus = 'ACTIVE' | 'SUSPENDED' | 'PENDING' | 'TERMINATED';

// 사용자 상태
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'BLOCKED';

// 플랜 타입
export type PlanType = 'BASIC' | 'PRO' | 'ENTERPRISE';

interface StatusBadgeProps {
  status: TenantStatus | UserStatus;
  className?: string;
}

const statusConfig: Record<
  TenantStatus | UserStatus,
  { label: { ko: string; en: string }; variant: BadgeVariant }
> = {
  ACTIVE: { label: { ko: '활성', en: 'Active' }, variant: 'success' },
  INACTIVE: { label: { ko: '비활성', en: 'Inactive' }, variant: 'gray' },
  SUSPENDED: { label: { ko: '정지', en: 'Suspended' }, variant: 'error' },
  PENDING: { label: { ko: '대기', en: 'Pending' }, variant: 'warning' },
  BLOCKED: { label: { ko: '차단', en: 'Blocked' }, variant: 'error' },
  TERMINATED: { label: { ko: '종료', en: 'Terminated' }, variant: 'gray' },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  // TODO: language store 연동
  const language = 'ko';

  return (
    <Badge variant={config.variant} className={className}>
      {config.label[language]}
    </Badge>
  );
}

// 플랜 배지
interface PlanBadgeProps {
  plan: PlanType;
  className?: string;
}

const planConfig: Record<
  PlanType,
  { label: string; variant: BadgeVariant }
> = {
  BASIC: { label: 'Basic', variant: 'gray' },
  PRO: { label: 'Pro', variant: 'blue' },
  ENTERPRISE: { label: 'Enterprise', variant: 'purple' },
};

export function PlanBadge({ plan, className }: PlanBadgeProps) {
  const config = planConfig[plan];

  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  );
}
