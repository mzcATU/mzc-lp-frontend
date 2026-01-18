/**
 * QualityRatingBadge 컴포넌트
 * 차수 생성 시 DeliveryType + EnrollmentMethod + DurationType 조합의 품질 등급 표시
 *
 * @example
 * ```tsx
 * <QualityRatingBadge rating="BEST" />
 * <QualityRatingBadge rating="CAUTION" />
 * ```
 */

import { cn } from '@/lib/utils';
import type { QualityRating } from '@/types/co/time.types';
import { QUALITY_RATING_LABELS } from '@/types/co/time.types';
import { designTokens } from '@/styles/admin-design-tokens';

interface QualityRatingBadgeProps {
  rating: QualityRating;
  className?: string;
}

const ratingConfig: Record<
  QualityRating,
  { icon: string; textColor: string; bgColor: string }
> = {
  BEST: {
    icon: '⭐',
    textColor: designTokens.status.success_text,
    bgColor: designTokens.status.success_background,
  },
  GOOD: {
    icon: '✅',
    textColor: designTokens.badge.blue.text,
    bgColor: designTokens.badge.blue.bg,
  },
  COMMON: {
    icon: '✅',
    textColor: designTokens.badge.gray.text,
    bgColor: designTokens.badge.gray.bg,
  },
  CAUTION: {
    icon: '⚠️',
    textColor: designTokens.status.warning_text,
    bgColor: designTokens.status.warning_background,
  },
};

export function QualityRatingBadge({
  rating,
  className,
}: QualityRatingBadgeProps) {
  const config = ratingConfig[rating];

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border',
        className
      )}
      style={{
        color: config.textColor,
        backgroundColor: config.bgColor,
        borderColor: config.textColor,
      }}
    >
      <span>{config.icon}</span>
      <span className="font-medium text-sm">
        {QUALITY_RATING_LABELS[rating]}
      </span>
    </div>
  );
}
