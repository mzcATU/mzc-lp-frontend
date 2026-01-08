/**
 * 찜 목록(Wishlist) 관련 타입 정의
 * CourseTime 기반으로 변경 (#207)
 */

// 찜 아이템 응답 (백엔드 API)
export interface WishlistItemResponse {
  id: number;
  courseTimeId: number;
  courseTimeTitle: string;
  thumbnailUrl: string | null;
  level: string | null;
  estimatedHours: number | null;
  isFree: boolean;
  price: string | null;
  addedAt: string;
}

// 찜 추가 요청
export interface WishlistAddRequest {
  courseTimeId: number;
}

// 여러 CourseTime 찜 여부 확인 요청
export interface WishlistCheckRequest {
  courseTimeIds: number[];
}

// 여러 CourseTime 찜 여부 확인 응답
export interface WishlistCheckResponse {
  wishlistStatus: Record<number, boolean>;
}

// 찜 개수 응답
export interface WishlistCountResponse {
  count: number;
}
