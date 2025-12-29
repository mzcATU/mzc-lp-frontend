import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/Card';
import { cn } from '@/utils/cn';

interface RecentItem {
  id: string | number;
  title: string;
  subtitle?: string;
  timestamp: string;
  badge?: React.ReactNode;
  avatar?: React.ReactNode;
}

interface RecentItemsListProps {
  title: string;
  items: RecentItem[];
  emptyMessage?: string;
  onItemClick?: (id: string | number) => void;
  viewAllLink?: string;
  className?: string;
}

export function RecentItemsList({
  title,
  items,
  emptyMessage = '항목이 없습니다.',
  onItemClick,
  viewAllLink,
  className,
}: RecentItemsListProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        {viewAllLink && (
          <a
            href={viewAllLink}
            className="text-sm text-brand-primary hover:underline"
          >
            전체 보기
          </a>
        )}
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-center text-text-secondary py-8">{emptyMessage}</p>
        ) : (
          <ul className="divide-y divide-border">
            {items.map((item) => (
              <li
                key={item.id}
                className={cn(
                  'py-3 first:pt-0 last:pb-0',
                  onItemClick && 'cursor-pointer hover:bg-bg-secondary rounded-lg px-2 -mx-2 transition-colors'
                )}
                onClick={() => onItemClick?.(item.id)}
              >
                <div className="flex items-center gap-3">
                  {item.avatar && (
                    <div className="flex-shrink-0">{item.avatar}</div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.title}</p>
                    {item.subtitle && (
                      <p className="text-sm text-text-secondary truncate">
                        {item.subtitle}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {item.badge}
                    <span className="text-xs text-text-secondary">
                      {item.timestamp}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
