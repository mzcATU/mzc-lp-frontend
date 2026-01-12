/**
 * Member Pool API 서비스 (TA - Tenant Admin)
 * TA는 회원 풀 조회만 가능 (CRUD는 TO에서 담당)
 */
import axiosInstance from '@/services/common/api/axiosInstance';
import { API_ENDPOINTS } from '@/services/common/api/endpoints';
import type {
  MemberPoolResponse,
  MemberPoolMembersResponse,
  MemberPoolQueryParams,
  MemberPoolMemberQueryParams,
} from '@/types/co/memberPool.types';

// TA에서 TO의 타입을 재사용
export type {
  MemberPoolResponse,
  MemberPoolMembersResponse,
  MemberPoolQueryParams,
  MemberPoolMemberQueryParams,
} from '@/types/co/memberPool.types';

export const memberPoolService = {
  // ============================================
  // Member Pool 조회 (Read Only)
  // ============================================

  /** 전체 회원 풀 조회 */
  async getMemberPools(params?: MemberPoolQueryParams): Promise<MemberPoolResponse[]> {
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
};
