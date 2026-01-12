/**
 * TO(Tenant Operator) 차수(CourseTime) 관리 API 서비스
 */
import axiosInstance from '@/services/common/api/axiosInstance';
import { API_ENDPOINTS } from '@/services/common/api/endpoints';
import type {
  CourseTimeResponse,
  CourseTimeDetailResponse,
  CreateCourseTimeRequest,
  UpdateCourseTimeRequest,
  CloneCourseTimeRequest,
  CourseTimeFilterParams,
  CapacityResponse,
  PriceResponse,
} from '@/types/co/time.types';

// Spring Page 응답 타입
interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export const timeService = {
  // ============================================
  // CourseTime CRUD
  // ============================================

  /** 차수 생성 */
  async createTime(request: CreateCourseTimeRequest): Promise<CourseTimeResponse> {
    const { data } = await axiosInstance.post<CourseTimeResponse>(
      API_ENDPOINTS.TIMES.BASE,
      request
    );
    return data;
  },

  /** 차수 목록 조회 */
  async getTimes(params?: CourseTimeFilterParams): Promise<PageResponse<CourseTimeResponse>> {
    const response = await axiosInstance.get<PageResponse<CourseTimeResponse>>(
      API_ENDPOINTS.TIMES.BASE,
      { params }
    );
    return response.data;
  },

  /** 차수 상세 조회 */
  async getTime(id: number): Promise<CourseTimeDetailResponse> {
    const { data } = await axiosInstance.get<CourseTimeDetailResponse>(
      API_ENDPOINTS.TIMES.BY_ID(id)
    );
    return data;
  },

  /** 차수 수정 */
  async updateTime(id: number, request: UpdateCourseTimeRequest): Promise<CourseTimeResponse> {
    const { data } = await axiosInstance.patch<CourseTimeResponse>(
      API_ENDPOINTS.TIMES.BY_ID(id),
      request
    );
    return data;
  },

  /** 차수 삭제 */
  async deleteTime(id: number): Promise<void> {
    await axiosInstance.delete(API_ENDPOINTS.TIMES.BY_ID(id));
  },

  /** 차수 복제 */
  async cloneTime(id: number, request: CloneCourseTimeRequest): Promise<CourseTimeResponse> {
    const { data } = await axiosInstance.post<CourseTimeResponse>(
      API_ENDPOINTS.TIMES.CLONE(id),
      request
    );
    return data;
  },

  // ============================================
  // 상태 전이 워크플로우
  // ============================================

  /** 모집 개시 (DRAFT → RECRUITING) */
  async openTime(id: number): Promise<CourseTimeResponse> {
    const { data } = await axiosInstance.post<CourseTimeResponse>(
      API_ENDPOINTS.TIMES.OPEN(id)
    );
    return data;
  },

  /** 수업 시작 (RECRUITING → ONGOING) */
  async startTime(id: number): Promise<CourseTimeResponse> {
    const { data } = await axiosInstance.post<CourseTimeResponse>(
      API_ENDPOINTS.TIMES.START(id)
    );
    return data;
  },

  /** 수업 종료 (ONGOING → CLOSED) */
  async closeTime(id: number): Promise<CourseTimeResponse> {
    const { data } = await axiosInstance.post<CourseTimeResponse>(
      API_ENDPOINTS.TIMES.CLOSE(id)
    );
    return data;
  },

  /** 보관 처리 (CLOSED → ARCHIVED) */
  async archiveTime(id: number): Promise<CourseTimeResponse> {
    const { data } = await axiosInstance.post<CourseTimeResponse>(
      API_ENDPOINTS.TIMES.ARCHIVE(id)
    );
    return data;
  },

  // ============================================
  // 조회
  // ============================================

  /** 정원 정보 조회 */
  async getCapacity(id: number): Promise<CapacityResponse> {
    const { data } = await axiosInstance.get<CapacityResponse>(
      API_ENDPOINTS.TIMES.CAPACITY(id)
    );
    return data;
  },

  /** 가격 정보 조회 */
  async getPrice(id: number): Promise<PriceResponse> {
    const { data } = await axiosInstance.get<PriceResponse>(
      API_ENDPOINTS.TIMES.PRICE(id)
    );
    return data;
  },
};
