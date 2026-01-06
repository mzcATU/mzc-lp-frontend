/**
 * TA 배너 관련 타입 정의
 */

// 배너 위치 enum
export type BannerPosition =
  | 'MAIN_TOP'
  | 'MAIN_MIDDLE'
  | 'COURSE_LIST'
  | 'LEARNING_HOME'
  | 'LOGIN';

// 링크 타겟
export type LinkTarget = '_self' | '_blank';

// 배너 응답 (백엔드 BannerResponse와 일치)
export interface BannerResponse {
  id: number;
  title: string;
  imageUrl: string;
  linkUrl: string | null;
  linkTarget: string | null;
  position: BannerPosition;
  sortOrder: number | null;
  isActive: boolean;
  startDate: string | null;
  endDate: string | null;
  description: string | null;
  isDisplayable: boolean;
  createdAt: string;
  updatedAt: string;
  // UI용 추가 필드 (백엔드에는 없음)
  mobileImageUrl?: string | null;
}

// 배너 생성 요청
export interface CreateBannerRequest {
  title: string;
  imageUrl: string;
  position: BannerPosition;
  linkUrl?: string | null;
  linkTarget?: string | null;
  sortOrder?: number | null;
  startDate?: string | null;
  endDate?: string | null;
  description?: string | null;
}

// 배너 수정 요청
export interface UpdateBannerRequest {
  title?: string;
  imageUrl?: string;
  linkUrl?: string | null;
  linkTarget?: string | null;
  position?: BannerPosition;
  sortOrder?: number | null;
  isActive?: boolean;
  startDate?: string | null;
  endDate?: string | null;
  description?: string | null;
}

// 배너 목록 조회 파라미터
export interface BannerListParams {
  position?: BannerPosition;
  isActive?: boolean;
}

// 공개 배너 조회 파라미터
export interface PublicBannerParams {
  position?: BannerPosition;
}

/**
 * 요청 객체에서 undefined 값 제거
 * JSON.stringify는 undefined를 무시하지만, 명시적으로 제거하는 것이 안전
 */
export function cleanRequest<T extends Record<string, unknown>>(obj: T): Partial<T> {
  const cleaned: Partial<T> = {};
  for (const key in obj) {
    if (obj[key] !== undefined) {
      cleaned[key] = obj[key];
    }
  }
  return cleaned;
}
