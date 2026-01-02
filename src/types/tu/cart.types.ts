/**
 * 장바구니(Cart) 관련 타입 정의 - 백엔드 API 스펙 기반
 */

// 장바구니 항목 응답 (백엔드 API)
export interface CartItemResponse {
  cartItemId: number;
  courseId: number;
  courseTitle: string;
  courseDescription: string | null;
  thumbnailUrl: string | null;
  level: string | null;
  type: string | null;
  estimatedHours: number | null;
  addedAt: string;
}

// 장바구니 추가 요청
export interface CartAddRequest {
  courseId: number;
}

// 장바구니 삭제 요청 (일괄)
export interface CartRemoveRequest {
  courseIds: number[];
}

// 장바구니 개수 응답
export interface CartCountResponse {
  count: number;
}

// UI용 장바구니 아이템 (선택 상태 포함)
export interface CartItem extends CartItemResponse {
  isSelected: boolean;
}

// 장바구니 요약 (UI용)
export interface CartSummary {
  totalCount: number;
  selectedCount: number;
}
