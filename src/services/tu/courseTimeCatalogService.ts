/**
 * 학습자용 CourseTime 카탈로그 API 서비스
 * Public API (인증 불필요)
 */

import axios from 'axios';
import type {
  CourseTimeCatalogResponse,
  CourseTimePublicDetailResponse,
  CourseTimeCatalogParams,
} from '@/types/tu/courseTimeCatalog.types';
import type { ApiResponse, PageResponse } from '@/types/common';

/**
 * URL에서 서브도메인 추출
 * 예: /mzc/tu/b2c/courses → 'mzc'
 */
function getSubdomainFromUrl(): string | null {
  const pathname = window.location.pathname;
  // 패턴: /:subdomain/tu/... 또는 /:subdomain/ta/... 등
  const match = pathname.match(/^\/([^/]+)\/(?:tu|ta|co)\//);
  if (match) {
    return match[1];
  }
  return null;
}

// Public API용 axios 인스턴스 (인증 토큰 불필요)
// VITE_API_BASE_URL이 이미 /api를 포함하므로 BASE_URL에서 /api 제거
const publicAxios = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  timeout: 10000,
});

// 요청 인터셉터: X-Subdomain 헤더 추가
publicAxios.interceptors.request.use((config) => {
  const subdomain = getSubdomainFromUrl();
  if (subdomain) {
    config.headers['X-Subdomain'] = subdomain;
  }
  return config;
});

const BASE_URL = '/public/course-times';

export const courseTimeCatalogService = {
  /**
   * 학습자용 차수 목록 조회 (카탈로그)
   * @param params 검색/필터 파라미터
   * @returns 페이징된 차수 목록
   */
  getCatalog: async (
    params?: CourseTimeCatalogParams
  ): Promise<PageResponse<CourseTimeCatalogResponse>> => {
    const searchParams = new URLSearchParams();

    // 상태 필터 (다중 선택 가능)
    if (params?.status && params.status.length > 0) {
      params.status.forEach((s) => searchParams.append('status', s));
    }

    // 운영 방식 필터
    if (params?.deliveryType) {
      searchParams.append('deliveryType', params.deliveryType);
    }

    // 프로그램 ID 필터
    if (params?.programId) {
      searchParams.append('programId', String(params.programId));
    }

    // 무료/유료 필터
    if (params?.isFree !== undefined) {
      searchParams.append('isFree', String(params.isFree));
    }

    // 키워드 검색
    if (params?.keyword) {
      searchParams.append('keyword', params.keyword);
    }

    // 카테고리 ID 필터
    if (params?.categoryId) {
      searchParams.append('categoryId', String(params.categoryId));
    }

    // 페이징
    if (params?.page !== undefined) {
      searchParams.append('page', String(params.page));
    }
    if (params?.size) {
      searchParams.append('size', String(params.size));
    }

    // 정렬
    if (params?.sort) {
      searchParams.append('sort', params.sort);
    }

    const query = searchParams.toString();
    const url = query ? `${BASE_URL}?${query}` : BASE_URL;
    const response = await publicAxios.get<ApiResponse<PageResponse<CourseTimeCatalogResponse>>>(url);

    return response.data.data;
  },

  /**
   * 학습자용 차수 상세 조회
   * @param id 차수 ID
   * @returns 차수 상세 정보 (커리큘럼, 강사 정보 포함)
   */
  getDetail: async (id: number): Promise<CourseTimePublicDetailResponse> => {
    const response = await publicAxios.get<ApiResponse<CourseTimePublicDetailResponse>>(
      `${BASE_URL}/${id}`
    );
    return response.data.data;
  },
};
