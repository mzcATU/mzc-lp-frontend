/**
 * 장바구니(Cart) 관련 타입 정의
 * CourseTime 기반으로 변경 (#207)
 */

// 장바구니 항목 응답 (백엔드 API)
export interface CartItemResponse {
  cartItemId: number;
  courseTimeId: number;
  courseTimeTitle: string;
  thumbnailUrl: string | null;
  level: string | null;
  estimatedHours: number | null;
  isFree: boolean;
  price: string | null;
  addedAt: string;
}

// 장바구니 추가 요청
export interface CartAddRequest {
  courseTimeId: number;
}

// 장바구니 삭제 요청 (일괄)
export interface CartRemoveRequest {
  courseTimeIds: number[];
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
