/**
 * 장바구니(Cart) 관련 타입 정의
 */

// 장바구니 아이템
export interface CartItem {
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
  totalHours: number;
  isSelected: boolean;
}

// 장바구니 응답
export interface CartResponse {
  items: CartItem[];
  totalCount: number;
}

// 장바구니 요약
export interface CartSummary {
  originalTotal: number;
  discountTotal: number;
  finalTotal: number;
  selectedCount: number;
}

// 쿠폰 정보
export interface Coupon {
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minPurchaseAmount?: number;
  expiresAt?: string;
}

// 쿠폰 적용 요청
export interface ApplyCouponRequest {
  couponCode: string;
}

// 쿠폰 적용 응답
export interface ApplyCouponResponse {
  success: boolean;
  discount: number;
  message?: string;
}

// 장바구니 아이템 추가 요청
export interface AddToCartRequest {
  courseId: number;
}

// 장바구니 아이템 삭제 요청
export interface RemoveFromCartRequest {
  itemIds: number[];
}
