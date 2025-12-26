import type { LucideIcon } from 'lucide-react';
import { designTokens } from '@/styles/admin-design-tokens';
import { cn } from '@/utils/cn';

/**
 * RadioOptionCard - 라디오 선택 컴포넌트
 *
 * variant:
 * - "card" (기본): 카드 스타일 라디오 (설명, 아이콘 포함 가능)
 * - "simple": 기본 라디오 버튼 스타일 (RadioGroup 대체)
 *
 * 사용 예시:
 * ```tsx
 * // 카드 스타일 (설정 페이지 등)
 * <RadioOptionCard
 *   name="theme"
 *   value="dark"
 *   label="다크 모드"
 *   description="어두운 테마를 사용합니다"
 *   isSelected={theme === 'dark'}
 *   onChange={setTheme}
 * />
 *
 * // 심플 스타일 (일반 폼)
 * <RadioOptionCard
 *   variant="simple"
 *   name="notification"
 *   value="email"
 *   label="이메일"
 *   isSelected={notification === 'email'}
 *   onChange={setNotification}
 * />
 * ```
 */

interface RadioOptionCardProps {
  /** 라디오 그룹 이름 */
  name: string;
  /** 라디오 값 */
  value: string;
  /** 라벨 텍스트 */
  label: string;
  /** 설명 텍스트 (card 스타일에서만 표시) */
  description?: string;
  /** 선택 여부 */
  isSelected: boolean;
  /** 값 변경 핸들러 */
  onChange: (value: string) => void;
  /** 아이콘 (card 스타일에서만 표시) */
  icon?: LucideIcon;
  /** 아이콘 배경색 */
  iconBg?: string;
  /** 아이콘 색상 */
  iconColor?: string;
  /** 추가 클래스 */
  className?: string;
  /** 스타일 변형: "card" (기본) | "simple" */
  variant?: 'card' | 'simple';
  /** HTML id (simple 스타일에서 label 연결용) */
  id?: string;
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
  variant = 'card',
  id,
}: Readonly<RadioOptionCardProps>) {
  // Simple 스타일: 기본 라디오 버튼 (RadioGroup 대체)
  if (variant === 'simple') {
    const inputId = id || `${name}-${value}`;
    return (
      <div className={cn('flex items-center space-x-2', className)}>
        <input
          type="radio"
          name={name}
          value={value}
          id={inputId}
          checked={isSelected}
          onChange={() => onChange(value)}
          className={cn(
            'aspect-square size-4 shrink-0 rounded-full border shadow-xs transition-[color,box-shadow] outline-none cursor-pointer',
            'focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50',
            'appearance-none',
            isSelected
              ? 'border-primary bg-primary'
              : 'border-input bg-background'
          )}
          style={{
            backgroundImage: isSelected
              ? 'radial-gradient(circle, white 35%, transparent 40%)'
              : 'none',
          }}
        />
        <label
          htmlFor={inputId}
          className="text-sm font-medium leading-none cursor-pointer"
        >
          {label}
        </label>
      </div>
    );
  }

  // Card 스타일: 기존 카드형 라디오
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
