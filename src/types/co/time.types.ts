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

// ============================================
// Response Types
// ============================================

/** 차수 목록 조회 응답 (백엔드 CourseTimeResponse 매칭) */
export interface CourseTimeResponse {
  id: number;
  cmCourseId: number;
  cmCourseVersionId: number | null;
  title: string;
  deliveryType: DeliveryType;
  status: CourseTimeStatus;
  enrollStartDate: string; // 모집 시작일
  enrollEndDate: string; // 모집 종료일
  classStartDate: string; // 학습 시작일
  classEndDate: string; // 학습 종료일
  capacity: number | null; // null = 무제한
  currentEnrollment: number;
  availableSeats: number | null; // null = 무제한
  enrollmentMethod: EnrollmentMethod;
  price: string | null; // BigDecimal -> string
  isFree: boolean;
  allowLateEnrollment: boolean;
  createdAt: string;
  instructors: CourseTimeInstructor[];
  programTitle: string | null; // 프로그램명
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
  programId: number | null;
  programTitle: string | null;
  programDescription: string | null;
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
  programId: number;
  cmCourseId?: number; // deprecated
  cmCourseVersionId?: number; // deprecated
  title: string;
  description?: string; // 차수 설명
  deliveryType: DeliveryType;
  enrollStartDate: string; // LocalDate (YYYY-MM-DD)
  enrollEndDate: string; // LocalDate (YYYY-MM-DD)
  classStartDate: string; // LocalDate (YYYY-MM-DD)
  classEndDate: string; // LocalDate (YYYY-MM-DD)
  capacity?: number | null;
  maxWaitingCount?: number | null;
  enrollmentMethod: EnrollmentMethod;
  minProgressForCompletion: number; // 0-100
  price: string; // BigDecimal -> string
  isFree: boolean;
  locationInfo?: string;
  allowLateEnrollment?: boolean;
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
// Filter Types
// ============================================

/** 차수 목록 조회 필터 */
export interface CourseTimeFilterParams {
  programId?: number;
  cmCourseId?: number;
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
