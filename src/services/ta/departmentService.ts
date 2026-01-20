/**
 * Department API 서비스 (TA - Tenant Admin)
 */
import axiosInstance from '@/services/common/api/axiosInstance';
import { API_ENDPOINTS } from '@/services/common/api/endpoints';
import type {
  DepartmentResponse,
  DepartmentMemberResponse,
  CreateDepartmentRequest,
  UpdateDepartmentRequest,
} from '@/types/ta/department.types';

export const departmentService = {
  // ============================================
  // Department CRUD
  // ============================================

  /** 부서 목록 조회 */
  async getAll(): Promise<DepartmentResponse[]> {
    const { data } = await axiosInstance.get<DepartmentResponse[]>(
      API_ENDPOINTS.DEPARTMENTS.BASE
    );
    return data;
  },

  /** 부서 트리 조회 (계층 구조) */
  async getTree(): Promise<DepartmentResponse[]> {
    const { data } = await axiosInstance.get<DepartmentResponse[]>(
      API_ENDPOINTS.DEPARTMENTS.TREE
    );
    return data;
  },

  /** 활성 부서 조회 */
  async getActive(): Promise<DepartmentResponse[]> {
    const { data } = await axiosInstance.get<DepartmentResponse[]>(
      API_ENDPOINTS.DEPARTMENTS.ACTIVE
    );
    return data;
  },

  /** 부서 검색 */
  async search(keyword: string): Promise<DepartmentResponse[]> {
    const { data } = await axiosInstance.get<DepartmentResponse[]>(
      API_ENDPOINTS.DEPARTMENTS.SEARCH,
      { params: { keyword } }
    );
    return data;
  },

  /** 부서 상세 조회 */
  async getById(id: number): Promise<DepartmentResponse> {
    const { data } = await axiosInstance.get<DepartmentResponse>(
      API_ENDPOINTS.DEPARTMENTS.BY_ID(id)
    );
    return data;
  },

  /** 부서 생성 */
  async create(request: CreateDepartmentRequest): Promise<DepartmentResponse> {
    const { data } = await axiosInstance.post<DepartmentResponse>(
      API_ENDPOINTS.DEPARTMENTS.BASE,
      request
    );
    return data;
  },

  /** 부서 수정 */
  async update(id: number, request: UpdateDepartmentRequest): Promise<DepartmentResponse> {
    const { data } = await axiosInstance.put<DepartmentResponse>(
      API_ENDPOINTS.DEPARTMENTS.BY_ID(id),
      request
    );
    return data;
  },

  /** 부서 삭제 */
  async delete(id: number): Promise<void> {
    await axiosInstance.delete(API_ENDPOINTS.DEPARTMENTS.BY_ID(id));
  },

  /** 부서 멤버 목록 조회 */
  async getMembers(id: number): Promise<DepartmentMemberResponse[]> {
    const { data } = await axiosInstance.get<DepartmentMemberResponse[]>(
      API_ENDPOINTS.DEPARTMENTS.MEMBERS(id)
    );
    return data;
  },

  /** 부서에 추가 가능한 인원 목록 조회 */
  async getAvailableMembers(id: number): Promise<DepartmentMemberResponse[]> {
    const { data } = await axiosInstance.get<DepartmentMemberResponse[]>(
      API_ENDPOINTS.DEPARTMENTS.AVAILABLE_MEMBERS(id)
    );
    return data;
  },

  /** 부서에 인원 추가 */
  async addMember(departmentId: number, userId: number): Promise<void> {
    await axiosInstance.post(
      API_ENDPOINTS.DEPARTMENTS.ADD_MEMBER(departmentId, userId)
    );
  },
};
