/**
 * TO(Tenant Operator) 차수(CourseTime) 관리 타입 정의
 * 백엔드 TS 모듈 API와 연동
 */

// ============================================
// Enums (Union Types)
// ============================================

/** 차수 상태 */
export type CourseTimeStatus =
  | 'DRAFT' // 작성 중
  | 'RECRUITING' // 모집 중
  | 'ONGOING' // 진행 중
  | 'CLOSED' // 종료됨
  | 'ARCHIVED'; // 보관됨

/** 진행 방식 */
export type DeliveryType =
  | 'ONLINE' // 온라인
  | 'OFFLINE' // 오프라인
  | 'BLENDED' // 블렌디드
  | 'LIVE'; // 실시간

/** 수강 신청 방식 */
export type EnrollmentMethod =
  | 'FIRST_COME' // 선착순
  | 'APPROVAL' // 승인제
  | 'INVITE_ONLY'; // 초대 전용

/** 학습 기간 유형 */
export type DurationType =
  | 'FIXED' // 고정 날짜 (classStartDate ~ classEndDate)
  | 'RELATIVE' // 상대 기간 (등록일 기준 durationDays일)
  | 'UNLIMITED'; // 무제한 (종료일 없음)

/** 요일 (0=일요일, 1=월요일, ..., 6=토요일) */
export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/** 조합 품질 등급 */
export type QualityRating =
  | 'BEST' // 최적 조합
  | 'GOOD' // 권장 조합
  | 'COMMON' // 일반 조합
  | 'CAUTION'; // 주의 필요

// ============================================
// Response Types
// ============================================

/** 정기 수업 일정 (선택 사항) */
export interface RecurringSchedule {
  daysOfWeek: DayOfWeek[]; // 수업 요일 (예: [2, 4] = 화요일, 목요일)
  startTime: string; // 시작 시간 (HH:mm 형식, 예: "19:00")
  endTime: string; // 종료 시간 (HH:mm 형식, 예: "21:00")
  locationInfo?: string; // 장소 정보 (선택)
  excludeHolidays?: boolean; // 공휴일 제외 여부 (기본값: false)
}

/** 차수 목록 조회 응답 (백엔드 CourseTimeResponse 매칭) */
export interface CourseTimeResponse {
  id: number;
  cmCourseId: number;
  cmCourseVersionId: number | null;
  title: string;
  deliveryType: DeliveryType;
  durationType: DurationType; // 학습 기간 유형
  status: CourseTimeStatus;
  enrollStartDate: string; // 모집 시작일
  enrollEndDate: string; // 모집 종료일
  classStartDate: string; // 학습 시작일
  classEndDate: string | null; // 학습 종료일 (RELATIVE/UNLIMITED는 null)
  durationDays: number | null; // 학습 일수 (FIXED: 자동계산, RELATIVE: 필수, UNLIMITED: null)
  capacity: number | null; // null = 무제한
  currentEnrollment: number;
  availableSeats: number | null; // null = 무제한
  enrollmentMethod: EnrollmentMethod;
  price: string | null; // BigDecimal -> string
  isFree: boolean;
  allowLateEnrollment: boolean;
  recurringSchedule: RecurringSchedule | null; // 정기 수업 일정 (선택)
  createdAt: string;
  instructors: CourseTimeInstructor[];
  courseTitle: string | null; // Phase 3: programTitle → courseTitle
}

/** 강사 정보 (상세 조회용) */
export interface CourseTimeInstructor {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  role: 'MAIN' | 'SUB' | 'ASSISTANT';
  status: 'ACTIVE' | 'REPLACED' | 'CANCELLED';
}

/** 차수 상세 조회 응답 (백엔드 CourseTimeDetailResponse 매칭) */
export interface CourseTimeDetailResponse extends CourseTimeResponse {
  courseId: number | null; // Phase 3: programId → courseId
  courseTitle: string | null; // Phase 3: programTitle → courseTitle
  courseDescription: string | null; // Phase 3: programDescription → courseDescription
  maxWaitingCount: number | null;
  minProgressForCompletion: number | null;
  locationInfo: string | null;
  createdBy: number | null;
  updatedAt: string;
  instructors: CourseTimeInstructor[];
}

/** 정원 조회 응답 */
export interface CapacityResponse {
  courseTimeId: number;
  capacity: number | null;
  currentEnrollment: number;
  availableSeats: number | null;
  unlimited: boolean;
}

/** 가격 조회 응답 */
export interface PriceResponse {
  courseTimeId: number;
  price: number | null;
  free: boolean;
}

// ============================================
// Request Types
// ============================================

/** 차수 생성 요청 (백엔드 CreateCourseTimeRequest 매칭) */
export interface CreateCourseTimeRequest {
  courseId: number; // Phase 3: programId → courseId
  title: string;
  description?: string; // 차수 설명
  deliveryType: DeliveryType;
  durationType: DurationType; // 학습 기간 유형
  enrollStartDate: string; // LocalDate (YYYY-MM-DD)
  enrollEndDate: string; // LocalDate (YYYY-MM-DD)
  classStartDate: string; // LocalDate (YYYY-MM-DD)
  classEndDate: string | null; // LocalDate (YYYY-MM-DD) - RELATIVE/UNLIMITED는 null
  durationDays?: number | null; // RELATIVE만 필수 입력
  capacity?: number | null;
  maxWaitingCount?: number | null;
  enrollmentMethod: EnrollmentMethod;
  minProgressForCompletion: number; // 0-100
  price: string; // BigDecimal -> string
  isFree: boolean;
  locationInfo?: string;
  allowLateEnrollment?: boolean;
  recurringSchedule?: RecurringSchedule | null; // 정기 수업 일정 (선택)
}

/** 차수 수정 요청 */
export interface UpdateCourseTimeRequest {
  cmCourseId?: number;
  title?: string;
  deliveryType?: DeliveryType;
  enrollmentMethod?: EnrollmentMethod;
  enrollmentStartDate?: string;
  enrollmentEndDate?: string;
  startDate?: string;
  endDate?: string;
  capacity?: number | null;
  price?: number | null;
  description?: string;
  location?: string;
}

/** 차수 복제 요청 */
export interface CloneCourseTimeRequest {
  title: string;
  enrollmentStartDate: string;
  enrollmentEndDate: string;
  startDate: string;
  endDate: string;
}

// ============================================
// Validation Types
// ============================================

/** 검증 오류 */
export interface ValidationError {
  ruleId: string; // R61, R62 등
  message: string; // 오류 메시지
}

/** 검증 경고 */
export interface ValidationWarning {
  ruleId: string;
  message: string;
}

/** 차수 검증 결과 */
export interface CourseTimeValidationResult {
  valid: boolean; // 검증 통과 여부
  errors: ValidationError[]; // 오류 목록
  warnings: ValidationWarning[]; // 경고 목록
  qualityRating: QualityRating | null; // 조합 품질 등급 (valid=true일 때만)
}

// ============================================
// Filter Types
// ============================================

/** 차수 목록 조회 필터 */
export interface CourseTimeFilterParams {
  courseId?: number; // Phase 3: programId → courseId
  status?: CourseTimeStatus;
  page?: number;
  size?: number;
  sort?: string;
}

// ============================================
// Utility Types & Constants
// ============================================

/** CourseTimeStatus 라벨 맵 */
export const COURSE_TIME_STATUS_LABELS: Record<CourseTimeStatus, string> = {
  DRAFT: '작성 중',
  RECRUITING: '모집 중',
  ONGOING: '진행 중',
  CLOSED: '종료됨',
  ARCHIVED: '보관됨',
};

/** CourseTimeStatus 색상 맵 (UI용) */
export const COURSE_TIME_STATUS_COLORS: Record<
  CourseTimeStatus,
  { bg: string; text: string }
> = {
  DRAFT: { bg: 'bg-gray-100', text: 'text-gray-700' },
  RECRUITING: { bg: 'bg-blue-100', text: 'text-blue-700' },
  ONGOING: { bg: 'bg-green-100', text: 'text-green-700' },
  CLOSED: { bg: 'bg-slate-100', text: 'text-slate-700' },
  ARCHIVED: { bg: 'bg-purple-100', text: 'text-purple-700' },
};

/** DeliveryType 라벨 맵 */
export const DELIVERY_TYPE_LABELS: Record<DeliveryType, string> = {
  ONLINE: '온라인',
  OFFLINE: '오프라인',
  BLENDED: '블렌디드',
  LIVE: '실시간',
};

/** DeliveryType 설명 맵 */
export const DELIVERY_TYPE_DESCRIPTIONS: Record<DeliveryType, string> = {
  ONLINE: '녹화된 영상으로 자유롭게 학습',
  OFFLINE: '지정된 장소에서 대면 학습',
  BLENDED: '온라인과 오프라인 혼합 학습',
  LIVE: '실시간 화상 강의',
};

/** EnrollmentMethod 라벨 맵 */
export const ENROLLMENT_METHOD_LABELS: Record<EnrollmentMethod, string> = {
  FIRST_COME: '선착순',
  APPROVAL: '승인제',
  INVITE_ONLY: '선발',
};

/** EnrollmentMethod 설명 맵 */
export const ENROLLMENT_METHOD_DESCRIPTIONS: Record<EnrollmentMethod, string> = {
  FIRST_COME: '신청 순서대로 등록',
  APPROVAL: '운영자 승인 후 등록',
  INVITE_ONLY: '운영자가 직접 선발하여 등록',
};

/** DurationType 라벨 맵 */
export const DURATION_TYPE_LABELS: Record<DurationType, string> = {
  FIXED: '고정 날짜',
  RELATIVE: '상대 기간',
  UNLIMITED: '무제한',
};

/** DurationType 설명 맵 */
export const DURATION_TYPE_DESCRIPTIONS: Record<DurationType, string> = {
  FIXED: '특정 시작일과 종료일 지정',
  RELATIVE: '수강 신청일 기준 지정 기간 동안 학습',
  UNLIMITED: '종료일 없이 무제한 학습',
};

/** QualityRating 라벨 맵 */
export const QUALITY_RATING_LABELS: Record<QualityRating, string> = {
  BEST: '최적 조합',
  GOOD: '권장 조합',
  COMMON: '일반 조합',
  CAUTION: '주의 필요',
};

/** 요일 라벨 맵 */
export const DAY_OF_WEEK_LABELS: Record<DayOfWeek, string> = {
  0: '일',
  1: '월',
  2: '화',
  3: '수',
  4: '목',
  5: '금',
  6: '토',
};

/** 요일 전체 이름 */
export const DAY_OF_WEEK_FULL_LABELS: Record<DayOfWeek, string> = {
  0: '일요일',
  1: '월요일',
  2: '화요일',
  3: '수요일',
  4: '목요일',
  5: '금요일',
  6: '토요일',
};

/** 상태 전이 가능 여부 */
export const COURSE_TIME_STATUS_TRANSITIONS: Record<
  CourseTimeStatus,
  CourseTimeStatus | null
> = {
  DRAFT: 'RECRUITING', // open
  RECRUITING: 'ONGOING', // start
  ONGOING: 'CLOSED', // close
  CLOSED: 'ARCHIVED', // archive
  ARCHIVED: null, // 최종 상태
};
