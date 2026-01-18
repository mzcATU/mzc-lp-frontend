/**
 * ValidationResultDisplay 컴포넌트
 * 차수 생성 시 클라이언트 검증 결과 표시
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

import { Alert, AlertDescription } from '@/components/common/Alert/Alert';
import { AlertCircle, AlertTriangle } from 'lucide-react';
import type { CourseTimeValidationResult } from '@/types/co/time.types';
import { QualityRatingBadge } from '@/components/common/feedback/QualityRatingBadge';
import { designTokens } from '@/styles/admin-design-tokens';

interface ValidationResultDisplayProps {
  validationResult: CourseTimeValidationResult;
}

export function ValidationResultDisplay({
  validationResult,
}: ValidationResultDisplayProps) {
  if (!validationResult) return null;

  const hasErrors = validationResult.errors.length > 0;
  const hasWarnings = validationResult.warnings.length > 0;

  if (!hasErrors && !hasWarnings && !validationResult.qualityRating) {
    return null;
  }

  return (
    <div className="space-y-3">
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

      {/* Errors */}
      {validationResult.errors.map((error) => (
        <Alert key={error.ruleId} variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>[{error.ruleId}]</strong> {error.message}
          </AlertDescription>
        </Alert>
      ))}

      {/* Warnings */}
      {validationResult.warnings.map((warning) => (
        <Alert
          key={warning.ruleId}
          className="border-l-4"
          style={{
            backgroundColor: designTokens.status.warning_background,
            borderLeftColor: designTokens.status.warning_text,
          }}
        >
          <AlertTriangle
            className="h-4 w-4"
            style={{ color: designTokens.status.warning_text }}
          />
          <AlertDescription style={{ color: designTokens.status.warning_text }}>
            <strong>[{warning.ruleId}]</strong> {warning.message}
          </AlertDescription>
        </Alert>
      ))}
    </div>
  );
}
