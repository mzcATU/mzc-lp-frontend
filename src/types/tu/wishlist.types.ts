/**
 * 찜 목록(Wishlist) 관련 타입 정의
 */

// 찜 목록 아이템
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

// 찜 목록 응답
export interface WishlistResponse {
  items: WishlistItem[];
  totalCount: number;
}

// 찜 추가 요청
export interface AddToWishlistRequest {
  courseId: number;
}

// 찜 삭제 요청
export interface RemoveFromWishlistRequest {
  itemIds: number[];
}

// 찜 목록 전체 장바구니 담기 요청
export interface AddAllToCartRequest {
  itemIds: number[];
}
