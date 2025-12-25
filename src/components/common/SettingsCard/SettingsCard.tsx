import { LucideIcon } from 'lucide-react';
import { cn } from '@/utils/cn';

type BadgeColor = 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'indigo' | 'purple' | 'gray';

// 카드 색상 자동 순환 (새 카드 추가 시 color 지정 불필요)
const CARD_COLORS: BadgeColor[] = ['indigo', 'orange', 'green', 'blue', 'purple', 'red'];

// 디자인 토큰 클래스 매핑 (Badge 컴포넌트와 동일한 토큰 사용)
const colorStyles: Record<BadgeColor, { bg: string; text: string; hoverBorder: string }> = {
  indigo: { bg: 'bg-badge-indigo-bg', text: 'text-badge-indigo', hoverBorder: 'hover:border-badge-indigo' },
  orange: { bg: 'bg-badge-orange-bg', text: 'text-badge-orange', hoverBorder: 'hover:border-badge-orange' },
  green: { bg: 'bg-badge-green-bg', text: 'text-badge-green', hoverBorder: 'hover:border-badge-green' },
  blue: { bg: 'bg-badge-blue-bg', text: 'text-badge-blue', hoverBorder: 'hover:border-badge-blue' },
  purple: { bg: 'bg-badge-purple-bg', text: 'text-badge-purple', hoverBorder: 'hover:border-badge-purple' },
  red: { bg: 'bg-badge-red-bg', text: 'text-badge-red', hoverBorder: 'hover:border-badge-red' },
  yellow: { bg: 'bg-badge-yellow-bg', text: 'text-badge-yellow', hoverBorder: 'hover:border-badge-yellow' },
  gray: { bg: 'bg-badge-gray-bg', text: 'text-badge-gray', hoverBorder: 'hover:border-badge-gray' },
};

interface SettingsCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick: () => void;
  color?: BadgeColor; // optional - 없으면 index 기반 자동 할당
  index?: number; // 자동 색상 할당용 index
  className?: string;
}

export const SettingsCard = ({
  icon: Icon,
  title,
  description,
  onClick,
  color,
  index = 0,
  className,
}: SettingsCardProps) => {
  const colorKey = color ?? CARD_COLORS[index % CARD_COLORS.length];
  const styles = colorStyles[colorKey];

  return (
    <button
      onClick={onClick}
      className={cn(
        'bg-bg-default border border-border rounded-xl p-6 text-left cursor-pointer',
        'transition-all duration-200 shadow-sm hover:shadow-md',
        styles.hoverBorder,
        className
      )}
    >
      {/* Icon Container */}
      <div
        className={cn(
          'w-12 h-12 rounded-xl flex items-center justify-center mb-4',
          styles.bg
        )}
      >
        <Icon className={cn('w-6 h-6', styles.text)} />
      </div>

      {/* Title */}
      <h3 className="text-text-primary text-base font-medium mb-2">
        {title}
      </h3>

      {/* Description */}
      <p className="text-text-secondary text-sm leading-relaxed">
        {description}
      </p>
    </button>
  );
};
