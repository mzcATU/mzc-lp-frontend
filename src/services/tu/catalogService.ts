import axiosInstance from '@/services/common/api/axiosInstance';
import { API_ENDPOINTS } from '@/services/common/api/endpoints';

/**
 * 카탈로그 프로그램 타입
 */
export interface CatalogProgram {
  id: number;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  categoryId?: number;
  categoryName?: string;
  instructorName?: string;
  difficulty?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  duration?: number; // 총 학습 시간 (분)
  enrollmentCount?: number;
  rating?: number;
  status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'CLOSED';
  createdAt: string;
}

/**
 * 카탈로그 차수 타입
 */
export interface CatalogCourseTime {
  id: number;
  programId: number;
  name: string;
  startDate: string;
  endDate: string;
  enrollmentStartDate?: string;
  enrollmentEndDate?: string;
  capacity?: number;
  currentEnrollment?: number;
  status: 'DRAFT' | 'OPEN' | 'CLOSED' | 'COMPLETED';
  isEnrollable: boolean;
}

/**
 * 프로그램 목록 필터 파라미터
 */
export interface CatalogFilterParams {
  page?: number;
  size?: number;
  search?: string;
  categoryId?: number;
  difficulty?: string;
  status?: string;
  sortBy?: 'createdAt' | 'title' | 'enrollmentCount' | 'rating';
  sortDirection?: 'ASC' | 'DESC';
}

/**
 * 페이지네이션 응답 타입
 */
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

/**
 * API 응답 래퍼 타입
 */
interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: {
    code: string;
    message: string;
  };
}

/**
 * 카탈로그 서비스
 */
export const catalogService = {
  /**
   * 프로그램 목록 조회 (카탈로그)
   */
  getPrograms: async (params?: CatalogFilterParams): Promise<PageResponse<CatalogProgram>> => {
    const response = await axiosInstance.get<ApiResponse<PageResponse<CatalogProgram>>>(
      API_ENDPOINTS.PROGRAMS.BASE,
      { params: { ...params, status: 'APPROVED' } }
    );
    return response.data.data;
  },

  /**
   * 프로그램 상세 조회
   */
  getProgram: async (id: number): Promise<CatalogProgram> => {
    const response = await axiosInstance.get<ApiResponse<CatalogProgram>>(
      API_ENDPOINTS.PROGRAMS.BY_ID(id)
    );
    return response.data.data;
  },

  /**
   * 프로그램의 차수 목록 조회
   */
  getCourseTimes: async (programId: number): Promise<CatalogCourseTime[]> => {
    const response = await axiosInstance.get<ApiResponse<CatalogCourseTime[]>>(
      API_ENDPOINTS.TIMES.BASE,
      { params: { programId, status: 'OPEN' } }
    );
    return response.data.data;
  },

  /**
   * 차수 상세 조회
   */
  getCourseTime: async (id: number): Promise<CatalogCourseTime> => {
    const response = await axiosInstance.get<ApiResponse<CatalogCourseTime>>(
      API_ENDPOINTS.TIMES.BY_ID(id)
    );
    return response.data.data;
  },
};

export default catalogService;
