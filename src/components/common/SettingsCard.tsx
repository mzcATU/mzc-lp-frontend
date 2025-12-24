import { LucideIcon } from 'lucide-react';
import { designTokens } from '@/styles/admin-design-tokens';

type BadgeColor = 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'indigo' | 'purple' | 'gray';

// 카드 색상 자동 순환 (새 카드 추가 시 color 지정 불필요)
const CARD_COLORS: BadgeColor[] = ['indigo', 'orange', 'green', 'blue', 'purple', 'red'];

interface SettingsCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick: () => void;
  color?: BadgeColor; // optional - 없으면 index 기반 자동 할당
  index?: number; // 자동 색상 할당용 index
}

export function SettingsCard({
  icon: Icon,
  title,
  description,
  onClick,
  color,
  index = 0,
}: SettingsCardProps) {
  const colorKey = color ?? CARD_COLORS[index % CARD_COLORS.length];
  const badgeColor = designTokens.badge[colorKey];

  return (
    <button
      onClick={onClick}
      style={{
        backgroundColor: designTokens.bg.default,
        border: `1px solid ${designTokens.bg.border}`,
        borderRadius: '12px',
        padding: '24px',
        textAlign: 'left',
        cursor: 'pointer',
        transition: 'all 0.2s',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = badgeColor.text;
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.12)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = designTokens.bg.border;
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.08)';
      }}
    >
      {/* Icon Container */}
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          backgroundColor: badgeColor.bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px',
        }}
      >
        <Icon style={{ width: '24px', height: '24px', color: badgeColor.text }} />
      </div>

      {/* Title */}
      <h3
        style={{
          color: designTokens.text.primary,
          fontSize: '16px',
          fontWeight: 500,
          marginBottom: '8px',
        }}
      >
        {title}
      </h3>

      {/* Description */}
      <p
        style={{
          color: designTokens.text.secondary,
          fontSize: '14px',
          lineHeight: 1.5,
        }}
      >
        {description}
      </p>
    </button>
  );
}
