/**
 * 차수(CourseTime) 검증 유틸리티
 * 클라이언트 사이드 즉시 검증 로직
 */

import { differenceInDays } from 'date-fns';
import type {
  DeliveryType,
  EnrollmentMethod,
  DurationType,
  ValidationError,
} from '@/types/co/time.types';

/**
 * 클라이언트 사이드 검증 데이터 타입
 */
interface CourseTimeValidationData {
  deliveryType: DeliveryType;
  enrollmentMethod: EnrollmentMethod;
  durationType: DurationType;
  capacity: number | null;
  locationInfo: string | null;
  allowLateEnrollment: boolean;
  durationDays: number | null;
  classStartDate: string | null;
  classEndDate: string | null;
  enrollStartDate: string | null;
  enrollEndDate: string | null;
}

/**
 * 클라이언트 사이드 즉시 검증
 * 서버 검증 전 빠른 피드백 제공
 *
 * @param data 검증할 차수 데이터
 * @returns 검증 오류 목록
 */
export function validateCourseTimeClient(
  data: CourseTimeValidationData
): ValidationError[] {
  const errors: ValidationError[] = [];

  // R61: FIXED 타입에서 classEndDate 필수
  if (data.durationType === 'FIXED' && !data.classEndDate) {
    errors.push({
      ruleId: 'R61',
      message: '고정 날짜(FIXED) 방식은 학습 종료일이 필수입니다.',
    });
  }

  // R62: RELATIVE 타입에서 durationDays 필수
  if (
    data.durationType === 'RELATIVE' &&
    (!data.durationDays || data.durationDays <= 0)
  ) {
    errors.push({
      ruleId: 'R62',
      message: '상대 기간(RELATIVE) 방식은 수강 일수를 1일 이상 입력해야 합니다.',
    });
  }

  // R63: UNLIMITED 타입에서 classEndDate 금지
  if (data.durationType === 'UNLIMITED' && data.classEndDate) {
    errors.push({
      ruleId: 'R63',
      message: '무제한(UNLIMITED) 방식은 학습 종료일을 지정할 수 없습니다.',
    });
  }

  // R64: enrollEndDate < classStartDate
  if (
    data.enrollEndDate &&
    data.classStartDate &&
    new Date(data.enrollEndDate) > new Date(data.classStartDate)
  ) {
    errors.push({
      ruleId: 'R64',
      message: '모집 종료일은 학습 시작일 이전이어야 합니다.',
    });
  }

  // R65: classEndDate >= classStartDate
  if (
    data.classStartDate &&
    data.classEndDate &&
    new Date(data.classEndDate) < new Date(data.classStartDate)
  ) {
    errors.push({
      ruleId: 'R65',
      message: '학습 종료일은 시작일 이후여야 합니다.',
    });
  }

  // R21: OFFLINE/BLENDED/LIVE는 FIXED 필수
  if (
    ['OFFLINE', 'BLENDED', 'LIVE'].includes(data.deliveryType) &&
    data.durationType !== 'FIXED'
  ) {
    errors.push({
      ruleId: 'R21',
      message:
        '오프라인/블렌디드/실시간 과정은 고정 날짜(FIXED) 학습 기간만 지원합니다.',
    });
  }

  // R22: LIVE는 중도 등록 불가
  if (data.deliveryType === 'LIVE' && data.allowLateEnrollment) {
    errors.push({
      ruleId: 'R22',
      message: '실시간(LIVE) 과정은 중도 등록을 허용할 수 없습니다.',
    });
  }

  return errors;
}

/**
 * DeliveryType에 따른 기본 DurationType 계산
 *
 * @param deliveryType 진행 방식
 * @returns 권장 학습 기간 유형
 */
export function getDefaultDurationType(
  deliveryType: DeliveryType
): DurationType {
  if (deliveryType === 'ONLINE') {
    return 'RELATIVE';
  }
  return 'FIXED';
}

/**
 * 두 날짜 사이의 일수 계산 (시작일 포함)
 * FIXED 타입에서 사용
 *
 * @param startDate 시작일 (YYYY-MM-DD)
 * @param endDate 종료일 (YYYY-MM-DD)
 * @returns 총 일수 (시작일 포함)
 */
export function calculateDurationDays(
  startDate: string,
  endDate: string
): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = differenceInDays(end, start);
  return days + 1; // 시작일 포함
}

/**
 * durationDays 기본값 계산 (참고용)
 * 백엔드에 FormData API가 없으므로 로컬에서 계산
 *
 * @param estimatedHours 예상 학습 시간 (Course의 estimatedHours)
 * @returns 권장 수강 일수
 */
export function calculateSuggestedDurationDays(
  estimatedHours: number | null
): number | null {
  if (!estimatedHours || estimatedHours <= 0) {
    return null;
  }
  // 1일 8시간 기준
  return Math.ceil(estimatedHours / 8);
}
