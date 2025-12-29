import { type LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/common/Card';
import { cn } from '@/utils/cn';

interface AdminStatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  className?: string;
}

const variantStyles = {
  default: {
    iconBg: 'bg-bg-secondary',
    iconColor: 'text-text-secondary',
  },
  primary: {
    iconBg: 'bg-brand-primary/10',
    iconColor: 'text-brand-primary',
  },
  success: {
    iconBg: 'bg-status-success/10',
    iconColor: 'text-status-success',
  },
  warning: {
    iconBg: 'bg-status-warning/10',
    iconColor: 'text-status-warning',
  },
  error: {
    iconBg: 'bg-status-error/10',
    iconColor: 'text-status-error',
  },
};

export function AdminStatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'default',
  className,
}: AdminStatsCardProps) {
  const styles = variantStyles[variant];

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-text-secondary">{title}</p>
            <p className="text-3xl font-bold mt-2">{value}</p>
            {subtitle && (
              <p className="text-sm text-text-secondary mt-1">{subtitle}</p>
            )}
            {trend && (
              <p
                className={cn(
                  'text-sm mt-2 flex items-center gap-1',
                  trend.value > 0 ? 'text-status-success' : trend.value < 0 ? 'text-status-error' : 'text-text-secondary'
                )}
              >
                <span>{trend.value > 0 ? '+' : ''}{trend.value}%</span>
                <span className="text-text-secondary">{trend.label}</span>
              </p>
            )}
          </div>
          <div
            className={cn(
              'w-12 h-12 rounded-lg flex items-center justify-center',
              styles.iconBg
            )}
          >
            <Icon className={cn('w-6 h-6', styles.iconColor)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// 그리드 레이아웃 컴포넌트
interface AdminStatsGridProps {
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}

export function AdminStatsGrid({ children, columns = 4, className }: AdminStatsGridProps) {
  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={cn('grid gap-4', gridCols[columns], className)}>
      {children}
    </div>
  );
}
