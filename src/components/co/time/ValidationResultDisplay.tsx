/**
 * ValidationResultDisplay 컴포넌트
 * 차수 생성 시 클라이언트 검증 결과 표시
 *
 * variant:
 * - "inline" (기본): 부드러운 인라인 텍스트 스타일
 * - "alert": Alert 박스 스타일 (더 강조가 필요한 경우)
 *
 * @example
 * ```tsx
 * <ValidationResultDisplay
 *   validationResult={{
 *     valid: false,
 *     errors: [{ ruleId: 'R61', message: '학습 종료일이 필수입니다.' }],
 *     warnings: [],
 *     qualityRating: null
 *   }}
 * />
 * ```
 */

import { AlertCircle, Info } from 'lucide-react';
import type { CourseTimeValidationResult } from '@/types/co/time.types';
import { QualityRatingBadge } from '@/components/common/feedback/QualityRatingBadge';
import { designTokens } from '@/styles/admin-design-tokens';

interface ValidationResultDisplayProps {
  validationResult: CourseTimeValidationResult;
  /** 표시 스타일: "inline" (기본, 부드러운 톤) | "alert" (강조) */
  variant?: 'inline' | 'alert';
  /** 개발 모드에서 시스템 코드 표시 여부 */
  showRuleId?: boolean;
}

export function ValidationResultDisplay({
  validationResult,
  variant = 'inline',
  showRuleId = false,
}: ValidationResultDisplayProps) {
  if (!validationResult) return null;

  const hasErrors = validationResult.errors.length > 0;
  const hasWarnings = validationResult.warnings.length > 0;

  if (!hasErrors && !hasWarnings && !validationResult.qualityRating) {
    return null;
  }

  // 개발 모드에서만 콘솔에 시스템 코드 로깅
  if (import.meta.env.DEV && (hasErrors || hasWarnings)) {
    console.debug('[ValidationResultDisplay] Rules:', {
      errors: validationResult.errors.map((e) => e.ruleId),
      warnings: validationResult.warnings.map((w) => w.ruleId),
    });
  }

  return (
    <div className="space-y-2">
      {/* Quality Rating */}
      {validationResult.qualityRating && (
        <div className="flex items-center gap-2">
          <span
            className="text-sm font-medium"
            style={{ color: designTokens.text.secondary }}
          >
            조합 품질:
          </span>
          <QualityRatingBadge rating={validationResult.qualityRating} />
        </div>
      )}

      {/* Errors - 부드러운 인라인 스타일 */}
      {validationResult.errors.map((error, index) => (
        <div
          key={error.ruleId || index}
          className="flex items-start gap-2 px-3 py-2 rounded-md"
          style={{
            backgroundColor: variant === 'alert'
              ? designTokens.status.error_background
              : 'transparent',
          }}
        >
          <AlertCircle
            className="h-4 w-4 mt-0.5 flex-shrink-0"
            style={{ color: designTokens.status.error_text }}
          />
          <p
            className="text-sm"
            style={{ color: designTokens.status.error_text }}
          >
            {showRuleId && <span className="font-mono text-xs mr-1">[{error.ruleId}]</span>}
            {error.message}
          </p>
        </div>
      ))}

      {/* Warnings - 부드러운 인라인 스타일 */}
      {validationResult.warnings.map((warning, index) => (
        <div
          key={warning.ruleId || index}
          className="flex items-start gap-2 px-3 py-2 rounded-md"
          style={{
            backgroundColor: variant === 'alert'
              ? designTokens.status.warning_background
              : 'transparent',
          }}
        >
          <Info
            className="h-4 w-4 mt-0.5 flex-shrink-0"
            style={{ color: designTokens.status.warning_text }}
          />
          <p
            className="text-sm"
            style={{ color: designTokens.status.warning_text }}
          >
            {showRuleId && <span className="font-mono text-xs mr-1">[{warning.ruleId}]</span>}
            {warning.message}
          </p>
        </div>
      ))}
    </div>
  );
}
