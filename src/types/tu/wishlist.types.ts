/**
 * 찜 목록(Wishlist) 관련 타입 정의 - 백엔드 API 스펙 기반
 */

// 찜 아이템 응답 (백엔드 WishlistItemResponse)
export interface WishlistItemResponse {
  id: number;
  courseId: number;
  courseTitle: string | null;
  courseThumbnailUrl: string | null;
  courseLevel: string | null;
  courseType: string | null;
  courseEstimatedHours: number | null;
  addedAt: string;
}

// 찜 추가 요청
export interface WishlistAddRequest {
  courseId: number;
}

// 여러 강의 찜 여부 확인 요청
export interface WishlistCheckRequest {
  courseIds: number[];
}

// 여러 강의 찜 여부 확인 응답
export interface WishlistCheckResponse {
  wishlistStatus: Record<number, boolean>;
}

// 찜 개수 응답
export interface WishlistCountResponse {
  count: number;
}

// === Legacy 타입 (하위 호환용) ===

/** @deprecated Use WishlistItemResponse instead */
export interface WishlistItem {
  id: number;
  courseId: number;
  title: string;
  instructor: string;
  originalPrice: number;
  price: number;
  image: string;
  discount: number;
  rating: number;
  reviewCount: number;
  studentCount: number;
  totalHours: number;
  addedAt?: string;
}

/** @deprecated Use Page<WishlistItemResponse> instead */
export interface WishlistResponse {
  items: WishlistItem[];
  totalCount: number;
}

/** @deprecated Use WishlistAddRequest instead */
export interface AddToWishlistRequest {
  courseId: number;
}

/** @deprecated */
export interface RemoveFromWishlistRequest {
  itemIds: number[];
}

/** @deprecated */
export interface AddAllToCartRequest {
  itemIds: number[];
}
