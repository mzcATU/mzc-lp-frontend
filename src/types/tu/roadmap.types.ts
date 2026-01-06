/**
 * TU 로드맵 관리 타입 정의
 * 백엔드 API 응답 구조에 맞춰 작성
 */

// ============================================
// Enums & Constants
// ============================================

/** 로드맵 상태 */
export type RoadmapStatus = 'published' | 'draft';

// ============================================
// Response Types
// ============================================

/** 로드맵 프로그램 정보 */
export interface RoadmapProgramDto {
  id: number;
  title: string;
  category: string;
  duration: string; // "8시간" 형식
  order: number;
}

/** 로드맵 기본 응답 (목록용) */
export interface RoadmapResponse {
  id: number;
  title: string;
  description: string;
  courseCount: number;
  enrolledStudents: number;
  status: RoadmapStatus;
  createdAt: string; // ISO 8601 형식
  updatedAt: string; // ISO 8601 형식
}

/** 로드맵 상세 응답 */
export interface RoadmapDetailResponse extends RoadmapResponse {
  programs: RoadmapProgramDto[];
}

/** 로드맵 통계 응답 */
export interface RoadmapStatisticsResponse {
  totalRoadmaps: number;
  totalEnrollments: number;
  averageCourseCount: number;
}

/** 로드맵 목록 페이지 응답 (Spring Page) */
export interface RoadmapPageResponse {
  content: RoadmapResponse[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// ============================================
// Request Types
// ============================================

/** 로드맵 생성 요청 */
export interface CreateRoadmapRequest {
  title: string;
  description?: string;
  programIds: number[];
  status: RoadmapStatus;
}

/** 로드맵 수정 요청 */
export interface UpdateRoadmapRequest {
  title?: string;
  description?: string;
  programIds?: number[];
  status?: RoadmapStatus;
}

/** 로드맵 임시 저장 요청 */
export interface SaveDraftRequest {
  title: string;
  description?: string;
  programIds?: number[];
}

// ============================================
// Query Parameters
// ============================================

/** 로드맵 목록 조회 파라미터 */
export interface RoadmapQueryParams {
  status?: RoadmapStatus;
  sortBy?: 'updatedAt' | 'title' | 'enrolledStudents';
  page?: number;
  size?: number;
}
