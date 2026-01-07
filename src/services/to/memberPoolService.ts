/**
 * Member Pool API 서비스 (TO - Tenant Operator)
 */
import axiosInstance from '@/services/common/api/axiosInstance';
import { API_ENDPOINTS } from '@/services/common/api/endpoints';
import type {
  MemberPoolResponse,
  MemberPoolMembersResponse,
  CreateMemberPoolRequest,
  UpdateMemberPoolRequest,
  PreviewMembersRequest,
  MemberPoolQueryParams,
  MemberPoolMemberQueryParams,
} from '@/types/to/memberPool.types';

export const memberPoolService = {
  // ============================================
  // Member Pool CRUD
  // ============================================

  /** 전체 회원 풀 조회 */
  async getMemberPools(
    params?: MemberPoolQueryParams
  ): Promise<MemberPoolResponse[]> {
    const { data } = await axiosInstance.get<MemberPoolResponse[]>(
      API_ENDPOINTS.MEMBER_POOLS.BASE,
      { params }
    );
    return data;
  },

  /** 회원 풀 상세 조회 */
  async getMemberPool(id: number): Promise<MemberPoolResponse> {
    const { data } = await axiosInstance.get<MemberPoolResponse>(
      API_ENDPOINTS.MEMBER_POOLS.BY_ID(id)
    );
    return data;
  },

  /** 회원 풀 생성 */
  async createMemberPool(
    request: CreateMemberPoolRequest
  ): Promise<MemberPoolResponse> {
    const { data } = await axiosInstance.post<MemberPoolResponse>(
      API_ENDPOINTS.MEMBER_POOLS.BASE,
      request
    );
    return data;
  },

  /** 회원 풀 수정 */
  async updateMemberPool(
    id: number,
    request: UpdateMemberPoolRequest
  ): Promise<MemberPoolResponse> {
    const { data } = await axiosInstance.put<MemberPoolResponse>(
      API_ENDPOINTS.MEMBER_POOLS.BY_ID(id),
      request
    );
    return data;
  },

  /** 회원 풀 삭제 */
  async deleteMemberPool(id: number): Promise<void> {
    await axiosInstance.delete(API_ENDPOINTS.MEMBER_POOLS.BY_ID(id));
  },

  // ============================================
  // Member Pool Activation
  // ============================================

  /** 회원 풀 활성화 */
  async activateMemberPool(id: number): Promise<MemberPoolResponse> {
    const { data } = await axiosInstance.post<MemberPoolResponse>(
      API_ENDPOINTS.MEMBER_POOLS.ACTIVATE(id)
    );
    return data;
  },

  /** 회원 풀 비활성화 */
  async deactivateMemberPool(id: number): Promise<MemberPoolResponse> {
    const { data } = await axiosInstance.post<MemberPoolResponse>(
      API_ENDPOINTS.MEMBER_POOLS.DEACTIVATE(id)
    );
    return data;
  },

  // ============================================
  // Member Pool Members
  // ============================================

  /** 회원 풀 멤버 조회 (페이징) */
  async getMemberPoolMembers(
    id: number,
    params?: MemberPoolMemberQueryParams
  ): Promise<MemberPoolMembersResponse> {
    const { data } = await axiosInstance.get<MemberPoolMembersResponse>(
      `${API_ENDPOINTS.MEMBER_POOLS.BY_ID(id)}/members`,
      { params }
    );
    return data;
  },

  /** 멤버 미리보기 (페이징) */
  async previewMembers(
    request: PreviewMembersRequest
  ): Promise<MemberPoolMembersResponse> {
    const { data } = await axiosInstance.post<MemberPoolMembersResponse>(
      `${API_ENDPOINTS.MEMBER_POOLS.BASE}/preview`,
      request
    );
    return data;
  },

  /** 회원 풀 매칭 카운트 조회 */
  async getMemberPoolMatchCount(id: number): Promise<number> {
    const { data} = await axiosInstance.get<{ count: number }>(
      API_ENDPOINTS.MEMBER_POOLS.MATCH_COUNT(id)
    );
    return data.count;
  },
};
