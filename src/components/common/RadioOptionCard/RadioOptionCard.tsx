import type { LucideIcon } from 'lucide-react';
import { designTokens } from '@/styles/admin-design-tokens';
import { cn } from '@/utils/cn';

interface RadioOptionCardProps {
  name: string;
  value: string;
  label: string;
  description?: string;
  isSelected: boolean;
  onChange: (value: string) => void;
  icon?: LucideIcon;
  iconBg?: string;
  iconColor?: string;
  className?: string;
}

export function RadioOptionCard({
  name,
  value,
  label,
  description,
  isSelected,
  onChange,
  icon: Icon,
  iconBg,
  iconColor,
  className,
}: RadioOptionCardProps) {
  return (
    <label
      className={cn(
        'flex items-center p-4 rounded-xl cursor-pointer transition-all hover:bg-muted/50',
        className
      )}
      style={{
        border: `1px solid ${isSelected ? designTokens.text.secondary : designTokens.bg.border}`,
        backgroundColor: isSelected ? designTokens.bg.secondary : 'transparent',
      }}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={isSelected}
        onChange={() => onChange(value)}
        className="hidden"
      />
      {Icon && (
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mr-4"
          style={{ backgroundColor: iconBg }}
        >
          <Icon className="w-6 h-6" style={{ color: iconColor }} />
        </div>
      )}
      <div className="flex-1">
        <div style={{ color: designTokens.text.primary, fontSize: '14px', marginBottom: description ? '4px' : 0 }}>
          {label}
        </div>
        {description && (
          <div style={{ color: designTokens.text.secondary, fontSize: '12px' }}>
            {description}
          </div>
        )}
      </div>
      {isSelected && (
        <div
          className="w-5 h-5 rounded-full flex items-center justify-center ml-3"
          style={{ backgroundColor: designTokens.text.secondary }}
        >
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: designTokens.bg.default }}
          />
        </div>
      )}
    </label>
  );
}
