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
  estimatedHours: number | null;
  categoryId: number | null;
  createdAt: string;
  updatedAt: string;
}

/** 강의 아이템 응답 (CourseDetailResponse에서 사용) */
export interface CourseItemResponse {
  itemId: number;
  itemName: string;
  depth: number;
  parentId: number | null;
  learningObjectId: number | null;
  isFolder: boolean;
  createdAt: string;
  updatedAt: string;
}

/** 강의 상세 조회 응답 */
export interface CourseDetailResponse {
  courseId: number;
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  level: CourseLevel | null;
  type: CourseType | null;
  estimatedHours: number | null;
  categoryId: number | null;
  items: CourseItemResponse[];
  itemCount: number;
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
