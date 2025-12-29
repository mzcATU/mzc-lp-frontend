import { type ReactNode } from 'react';
import { type LucideIcon } from 'lucide-react';
import { Button } from '@/components/common/Button';

interface ActionItem {
  label: string;
  icon?: LucideIcon;
  onClick: () => void;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'destructive';
}

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  actions?: ActionItem[] | ReactNode;
  breadcrumb?: {
    label: string;
    href?: string;
  }[];
}

export function AdminPageHeader({
  title,
  description,
  actions,
  breadcrumb,
}: AdminPageHeaderProps) {
  return (
    <div className="mb-6">
      {/* Breadcrumb */}
      {breadcrumb && breadcrumb.length > 0 && (
        <nav className="mb-2">
          <ol className="flex items-center gap-2 text-sm text-text-secondary">
            {breadcrumb.map((item, index) => (
              <li key={index} className="flex items-center gap-2">
                {index > 0 && <span>/</span>}
                {item.href ? (
                  <a href={item.href} className="hover:text-text-primary">
                    {item.label}
                  </a>
                ) : (
                  <span className="text-text-primary">{item.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}

      {/* Title and Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          {description && (
            <p className="text-text-secondary mt-1">{description}</p>
          )}
        </div>

        {actions && (
          <div className="flex items-center gap-2">
            {Array.isArray(actions)
              ? actions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <Button
                      key={index}
                      variant={action.variant || 'default'}
                      onClick={action.onClick}
                    >
                      {Icon && <Icon className="w-4 h-4 mr-2" />}
                      {action.label}
                    </Button>
                  );
                })
              : actions}
          </div>
        )}
      </div>
    </div>
  );
}
