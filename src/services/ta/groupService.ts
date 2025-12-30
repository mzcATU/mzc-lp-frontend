/**
 * User Group API 서비스 (TA - Tenant Admin)
 */
import axiosInstance from '@/services/common/api/axiosInstance';
import { API_ENDPOINTS } from '@/services/common/api/endpoints';
import type {
  UserGroup,
  UserGroupListResponse,
  UserGroupListParams,
  CreateUserGroupRequest,
  UpdateUserGroupRequest,
} from '@/types/admin';

export const groupService = {
  /** 그룹 목록 조회 */
  async getGroups(params?: UserGroupListParams): Promise<UserGroupListResponse> {
    const { data } = await axiosInstance.get<{ data: UserGroupListResponse }>(
      API_ENDPOINTS.GROUPS.BASE,
      { params }
    );
    return data.data;
  },

  /** 활성 그룹 목록 조회 */
  async getActiveGroups(): Promise<UserGroup[]> {
    const { data } = await axiosInstance.get<{ data: UserGroup[] }>(
      API_ENDPOINTS.GROUPS.ACTIVE
    );
    return data.data;
  },

  /** 그룹 상세 조회 */
  async getGroup(id: number): Promise<UserGroup> {
    const { data } = await axiosInstance.get<{ data: UserGroup }>(
      API_ENDPOINTS.GROUPS.BY_ID(id)
    );
    return data.data;
  },

  /** 그룹 생성 */
  async create(request: CreateUserGroupRequest): Promise<UserGroup> {
    const { data } = await axiosInstance.post<{ data: UserGroup }>(
      API_ENDPOINTS.GROUPS.BASE,
      request
    );
    return data.data;
  },

  /** 그룹 수정 */
  async update(id: number, request: UpdateUserGroupRequest): Promise<UserGroup> {
    const { data } = await axiosInstance.put<{ data: UserGroup }>(
      API_ENDPOINTS.GROUPS.BY_ID(id),
      request
    );
    return data.data;
  },

  /** 그룹 삭제 */
  async delete(id: number): Promise<void> {
    await axiosInstance.delete(API_ENDPOINTS.GROUPS.BY_ID(id));
  },

  /** 그룹에 멤버 추가 */
  async addMember(groupId: number, userId: number): Promise<void> {
    await axiosInstance.post(API_ENDPOINTS.GROUPS.MEMBERS(groupId, userId));
  },

  /** 그룹에서 멤버 제거 */
  async removeMember(groupId: number, userId: number): Promise<void> {
    await axiosInstance.delete(API_ENDPOINTS.GROUPS.MEMBERS(groupId, userId));
  },
};
