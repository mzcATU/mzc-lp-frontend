/**
 * Course 도메인 타입 정의
 * 백엔드 엔티티 구조에 맞춘 타입들
 */

// ============================================
// Enums (Union Types)
// ============================================

/** 강의 난이도 */
export type CourseLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

/** 강의 유형 */
export type CourseType = 'ONLINE' | 'OFFLINE' | 'BLENDED';

/** 강의 발행 상태 (API용, UI용 CourseStatus와 구분) */
export type CoursePublishStatus = 'DRAFT' | 'PUBLISHED';

/**
 * 과정 등록 워크플로우 상태 (CO용)
 * - DRAFT: 작성 중
 * - READY: 검토 대기 (TU가 제출)
 * - REGISTERED: 승인됨 (차수 생성 가능)
 * - REJECTED: 반려됨
 */
export type CourseRegistrationStatus =
  | 'DRAFT'
  | 'READY'
  | 'REGISTERED'
  | 'REJECTED';

// ============================================
// Response Types
// ============================================

/** 강의 목록 조회 응답 */
export interface CourseResponse {
  courseId: number;
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  level: CourseLevel | null;
  type: CourseType | null;
  /** 발행 상태 (DRAFT: 임시저장, PUBLISHED: 발행됨) */
  status: CoursePublishStatus;
  estimatedHours: number | null;
  categoryId: number | null;
  startDate: string | null;
  endDate: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  /** 완성 여부 (title, description, categoryId, items 1개 이상) */
  isComplete: boolean;
  /** 커리큘럼 아이템 개수 */
  itemCount: number;
}

/** 강의 아이템 응답 (CourseDetailResponse에서 사용) */
export interface CourseItemResponse {
  itemId: number;
  itemName: string;
  depth: number;
  parentId: number | null;
  learningObjectId: number | null;
  isFolder: boolean;
  displayName: string | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

/** 강의 아이템 계층 구조 응답 (트리 조회용) */
export interface CourseItemHierarchyResponse {
  itemId: number;
  itemName: string;
  depth: number;
  learningObjectId: number | null;
  isFolder: boolean;
  displayName: string | null;
  description: string | null;
  children: CourseItemHierarchyResponse[];
}

/** 강의 상세 조회 응답 */
export interface CourseDetailResponse {
  courseId: number;
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  level: CourseLevel | null;
  type: CourseType | null;
  /** 발행 상태 (DRAFT: 임시저장, PUBLISHED: 발행됨) */
  status: CoursePublishStatus;
  estimatedHours: number | null;
  categoryId: number | null;
  startDate: string | null;
  endDate: string | null;
  tags: string[];
  items: CourseItemResponse[];
  itemCount: number;
  /** 완성 여부 (title, description, categoryId, items 1개 이상) */
  isComplete: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// Request Types
// ============================================

/** 강의 생성 요청 */
export interface CreateCourseRequest {
  title: string;
  description?: string;
  level?: CourseLevel;
  type?: CourseType;
  estimatedHours?: number;
  categoryId?: number;
  thumbnailUrl?: string;
  startDate?: string;
  endDate?: string;
  tags?: string[];
  /** 스냅샷 연결 (TU 과정 신청 시 사용) */
  snapshotId?: number;
}

/** 강의 수정 요청 */
export interface UpdateCourseRequest {
  title?: string;
  description?: string;
  level?: CourseLevel;
  type?: CourseType;
  estimatedHours?: number;
  categoryId?: number;
  thumbnailUrl?: string;
  startDate?: string;
  endDate?: string;
  tags?: string[];
  status?: CoursePublishStatus;
}

// ============================================
// CourseItem Request Types
// ============================================

/** 차시 생성 요청 */
export interface CreateItemRequest {
  itemName: string;
  parentId?: number | null;
  contentId: number;
  displayName?: string;
  description?: string;
}

/** 폴더 생성 요청 */
export interface CreateFolderRequest {
  folderName: string;
  parentId?: number | null;
}

/** 항목 이동 요청 */
export interface MoveItemRequest {
  itemId: number;
  targetParentId?: number | null;
  targetIndex?: number;
}

/** 항목 이름 변경 요청 */
export interface UpdateItemNameRequest {
  itemName: string;
}

/** 학습 객체 변경 요청 */
export interface UpdateLearningObjectRequest {
  learningObjectId: number;
}

/** 표시 정보 변경 요청 */
export interface UpdateDisplayInfoRequest {
  displayName?: string;
  description?: string;
}

// ============================================
// Utility Types
// ============================================

/** CourseLevel 라벨 맵 */
export const COURSE_LEVEL_LABELS: Record<CourseLevel, string> = {
  BEGINNER: '초급',
  INTERMEDIATE: '중급',
  ADVANCED: '고급',
};

/** CourseType 라벨 맵 */
export const COURSE_TYPE_LABELS: Record<CourseType, string> = {
  ONLINE: '온라인',
  OFFLINE: '오프라인',
  BLENDED: '블렌디드',
};

/** CoursePublishStatus 라벨 맵 */
export const COURSE_PUBLISH_STATUS_LABELS: Record<CoursePublishStatus, string> = {
  DRAFT: '임시저장',
  PUBLISHED: '발행됨',
};

// ============================================
// CO 워크플로우 타입 (과정 등록/승인)
// ============================================

/**
 * 등록된 과정 응답 (CO용)
 * TU가 제출한 과정 목록 조회에 사용
 */
export interface CourseRegistrationResponse {
  id: number;
  courseId: number;
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  level: CourseLevel | null;
  type: CourseType | null;
  estimatedHours: number | null;
  status: CourseRegistrationStatus;
  creatorId: number;
  creatorName: string | null;
  ownerId: number | null;
  ownerName: string | null;
  ownerEmail: string | null;
  snapshotId: number | null;
  /** Course 권장 운영 기간 (차수 생성 시 참고용) */
  courseStartDate: string | null;
  courseEndDate: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * 등록된 과정 상세 응답 (CO용)
 */
export interface CourseRegistrationDetailResponse extends CourseRegistrationResponse {
  snapshotName: string | null;
  /** 승인 정보 */
  approvedBy: number | null;
  approvedByName: string | null;
  approvedAt: string | null;
  approvalComment: string | null;
  /** 반려 정보 */
  rejectionReason: string | null;
  rejectedAt: string | null;
  /** 제출 정보 */
  submittedAt: string | null;
}

/**
 * 검토 대기 과정 응답 (CO용)
 */
export interface ReadyCourseResponse {
  id: number;
  courseId: number;
  title: string;
  thumbnailUrl: string | null;
  level: CourseLevel | null;
  type: CourseType | null;
  creatorId: number;
  creatorName: string | null;
  submittedAt: string;
  snapshotId: number | null;
}

/** 과정 승인 요청 */
export interface RegisterCourseRequest {
  comment?: string;
}

/** 과정 반려 요청 */
export interface UnreadyCourseRequest {
  reason: string;
}

/** CourseRegistrationStatus 라벨 맵 */
export const COURSE_REGISTRATION_STATUS_LABELS: Record<CourseRegistrationStatus, string> = {
  DRAFT: '작성 중',
  READY: '검토 대기',
  REGISTERED: '승인됨',
  REJECTED: '반려됨',
};

/** CourseRegistrationStatus 색상 맵 (UI용) */
export const COURSE_REGISTRATION_STATUS_COLORS: Record<
  CourseRegistrationStatus,
  { bg: string; text: string }
> = {
  DRAFT: { bg: 'bg-gray-100', text: 'text-gray-700' },
  READY: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  REGISTERED: { bg: 'bg-green-100', text: 'text-green-700' },
  REJECTED: { bg: 'bg-red-100', text: 'text-red-700' },
};
