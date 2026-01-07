/**
 * TO(Tenant Operator) 강사 배정 관리 API 서비스
 */
import axiosInstance from '@/services/common/api/axiosInstance';
import { API_ENDPOINTS } from '@/services/common/api/endpoints';
import type { InstructorAssignmentResponse } from '@/types/tu/instructorAssignment.types';
import type {
  AssignInstructorRequest,
  UpdateInstructorRoleRequest,
  ReplaceInstructorRequest,
  CancelAssignmentRequest,
  InstructorAssignmentFilterParams,
  InstructorAssignmentListResponse,
} from '@/types/to/instructorAssignment.types';
import type { PageResponse } from '@/types/common/api.types';

export const instructorAssignmentService = {
  // ============================================
  // 전체 강사 배정 목록 조회 (TO용)
  // ============================================

  /** 전체 강사 배정 목록 조회 */
  async getAssignments(
    params?: InstructorAssignmentFilterParams
  ): Promise<PageResponse<InstructorAssignmentListResponse>> {
    const { data } = await axiosInstance.get<PageResponse<InstructorAssignmentListResponse>>(
      API_ENDPOINTS.INSTRUCTOR_ASSIGNMENTS.BASE,
      { params }
    );
    return data;
  },

  // ============================================
  // 강사 배정 CRUD (차수 기준)
  // ============================================

  /** 강사 배정 */
  async assignInstructor(
    timeId: number,
    request: AssignInstructorRequest
  ): Promise<InstructorAssignmentResponse> {
    const { data } = await axiosInstance.post<InstructorAssignmentResponse>(
      API_ENDPOINTS.TIMES.INSTRUCTORS(timeId),
      request
    );
    return data;
  },

  /** 차수별 강사 목록 조회 */
  async getInstructors(
    timeId: number,
    params?: InstructorAssignmentFilterParams
  ): Promise<InstructorAssignmentResponse[]> {
    const { data } = await axiosInstance.get<InstructorAssignmentResponse[]>(
      API_ENDPOINTS.TIMES.INSTRUCTORS(timeId),
      { params }
    );
    return data;
  },

  /** 강사 역할 변경 */
  async updateRole(
    timeId: number,
    assignmentId: number,
    request: UpdateInstructorRoleRequest
  ): Promise<InstructorAssignmentResponse> {
    const { data } = await axiosInstance.put<InstructorAssignmentResponse>(
      API_ENDPOINTS.TIMES.INSTRUCTOR_BY_ID(timeId, assignmentId),
      request
    );
    return data;
  },

  /** 강사 교체 */
  async replaceInstructor(
    timeId: number,
    assignmentId: number,
    request: ReplaceInstructorRequest
  ): Promise<InstructorAssignmentResponse> {
    const { data } = await axiosInstance.post<InstructorAssignmentResponse>(
      API_ENDPOINTS.TIMES.INSTRUCTOR_REPLACE(timeId, assignmentId),
      request
    );
    return data;
  },

  /** 배정 취소 */
  async cancelAssignment(
    timeId: number,
    assignmentId: number,
    request?: CancelAssignmentRequest
  ): Promise<void> {
    await axiosInstance.delete(
      API_ENDPOINTS.TIMES.INSTRUCTOR_BY_ID(timeId, assignmentId),
      { data: request }
    );
  },
};
