/**
 * Program API 서비스 (TO - Tenant Operator)
 */
import axiosInstance from '@/services/common/api/axiosInstance';
import { API_ENDPOINTS } from '@/services/common/api/endpoints';
import type {
  ProgramStatus,
  ProgramResponse,
  ProgramDetailResponse,
  PendingProgramResponse,
  CreateProgramRequest,
  UpdateProgramRequest,
  ApproveRequest,
  RejectRequest,
} from '@/types/common';

// Spring Page 응답 타입
interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

// 프로그램 필터 파라미터
export interface ProgramFilterParams {
  status?: ProgramStatus;
  creatorId?: number;
  page?: number;
  size?: number;
  sort?: string;
}

export const programService = {
  // ============================================
  // Program CRUD
  // ============================================

  /** 프로그램 생성 */
  async createProgram(
    request: CreateProgramRequest
  ): Promise<ProgramResponse> {
    const { data } = await axiosInstance.post<ProgramResponse>(
      API_ENDPOINTS.PROGRAMS.BASE,
      request
    );
    return data;
  },

  /** 프로그램 목록 조회 */
  async getPrograms(
    params?: ProgramFilterParams
  ): Promise<PageResponse<ProgramResponse>> {
    const { data } = await axiosInstance.get<PageResponse<ProgramResponse>>(
      API_ENDPOINTS.PROGRAMS.BASE,
      { params }
    );
    return data;
  },

  /** 프로그램 상세 조회 */
  async getProgram(id: number): Promise<ProgramDetailResponse> {
    const { data } = await axiosInstance.get<ProgramDetailResponse>(
      API_ENDPOINTS.PROGRAMS.BY_ID(id)
    );
    return data;
  },

  /** 프로그램 수정 */
  async updateProgram(
    id: number,
    request: UpdateProgramRequest
  ): Promise<ProgramResponse> {
    const { data } = await axiosInstance.put<ProgramResponse>(
      API_ENDPOINTS.PROGRAMS.BY_ID(id),
      request
    );
    return data;
  },

  /** 프로그램 삭제 */
  async deleteProgram(id: number): Promise<void> {
    await axiosInstance.delete(API_ENDPOINTS.PROGRAMS.BY_ID(id));
  },

  // ============================================
  // Program 워크플로우 (상태 전이)
  // ============================================

  /** 프로그램 개설 신청 (DRAFT/REJECTED → PENDING) */
  async submitProgram(id: number): Promise<ProgramResponse> {
    const { data } = await axiosInstance.post<ProgramResponse>(
      API_ENDPOINTS.PROGRAMS.SUBMIT(id)
    );
    return data;
  },

  /** 검토 대기 프로그램 목록 조회 (OPERATOR용) */
  async getPendingPrograms(
    params?: Pick<ProgramFilterParams, 'page' | 'size' | 'sort'>
  ): Promise<PageResponse<PendingProgramResponse>> {
    const { data } = await axiosInstance.get<PageResponse<PendingProgramResponse>>(
      API_ENDPOINTS.PROGRAMS.PENDING,
      { params }
    );
    return data;
  },

  /** 프로그램 승인 (PENDING → APPROVED) */
  async approveProgram(
    id: number,
    request?: ApproveRequest
  ): Promise<ProgramDetailResponse> {
    const { data } = await axiosInstance.post<ProgramDetailResponse>(
      API_ENDPOINTS.PROGRAMS.APPROVE(id),
      request
    );
    return data;
  },

  /** 프로그램 반려 (PENDING → REJECTED) */
  async rejectProgram(
    id: number,
    request: RejectRequest
  ): Promise<ProgramDetailResponse> {
    const { data } = await axiosInstance.post<ProgramDetailResponse>(
      API_ENDPOINTS.PROGRAMS.REJECT(id),
      request
    );
    return data;
  },

  /** 프로그램 종료 (APPROVED/DRAFT → CLOSED) */
  async closeProgram(id: number): Promise<ProgramResponse> {
    const { data } = await axiosInstance.post<ProgramResponse>(
      API_ENDPOINTS.PROGRAMS.CLOSE(id)
    );
    return data;
  },

  // ============================================
  // Program 스냅샷 연결
  // ============================================

  /** 스냅샷 연결 */
  async linkSnapshot(
    programId: number,
    snapshotId: number
  ): Promise<ProgramResponse> {
    const { data } = await axiosInstance.post<ProgramResponse>(
      API_ENDPOINTS.PROGRAMS.SNAPSHOT(programId),
      null,
      { params: { snapshotId } }
    );
    return data;
  },
};
