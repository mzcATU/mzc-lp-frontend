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
}: Readonly<RadioOptionCardProps>) {
  return (
    <label
      className={cn(
        'flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-all',
        className
      )}
      style={{
        border: `1px solid ${isSelected ? designTokens.action.primary_default : designTokens.bg.border}`,
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
      {/* 좌측 라디오 마커 */}
      <div
        className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
        style={{
          borderColor: isSelected ? designTokens.action.primary_default : designTokens.bg.border,
        }}
      >
        {isSelected && (
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: designTokens.action.primary_default }}
          />
        )}
      </div>
      {Icon && (
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: iconBg }}
        >
          <Icon className="w-5 h-5" style={{ color: iconColor }} />
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
    </label>
  );
}
