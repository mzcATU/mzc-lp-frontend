/**
 * Category 도메인 타입 정의
 * 백엔드 Category 엔티티 구조에 맞춘 타입들
 */

// ============================================
// Response Types
// ============================================

/** 카테고리 응답 */
export interface CategoryResponse {
  id: number;
  name: string;
  code: string;
  sortOrder: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// Request Types
// ============================================

/** 카테고리 생성 요청 */
export interface CreateCategoryRequest {
  name: string;
  code: string;
  sortOrder?: number;
  active?: boolean;
}

/** 카테고리 수정 요청 */
export interface UpdateCategoryRequest {
  name?: string;
  code?: string;
  sortOrder?: number;
  active?: boolean;
}
