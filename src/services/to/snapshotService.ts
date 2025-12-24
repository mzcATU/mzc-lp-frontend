/**
 * Snapshot API 서비스 (TO - Tenant Operator)
 */
import axiosInstance from '@/services/common/api/axiosInstance';
import { API_ENDPOINTS } from '@/services/common/api/endpoints';
import type {
  SnapshotStatus,
  SnapshotResponse,
  SnapshotDetailResponse,
  SnapshotItemResponse,
  SnapshotRelationResponse,
  SnapshotRelationsResponse,
  CreateSnapshotRequest,
  UpdateSnapshotRequest,
  CreateSnapshotItemRequest,
  UpdateSnapshotItemRequest,
  MoveSnapshotItemRequest,
  CreateSnapshotRelationRequest,
  SetStartSnapshotItemRequest,
} from '@/types/to';

// Spring Page 응답 타입
interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

// 스냅샷 필터 파라미터
export interface SnapshotFilterParams {
  status?: SnapshotStatus;
  keyword?: string;
  page?: number;
  size?: number;
  sort?: string;
}

export const snapshotService = {
  // ============================================
  // Snapshot CRUD
  // ============================================

  /** 스냅샷 목록 조회 */
  async getSnapshots(
    params?: SnapshotFilterParams
  ): Promise<PageResponse<SnapshotResponse>> {
    const { data } = await axiosInstance.get<PageResponse<SnapshotResponse>>(
      API_ENDPOINTS.SNAPSHOTS.BASE,
      { params }
    );
    return data;
  },

  /** 스냅샷 상세 조회 */
  async getSnapshot(id: number): Promise<SnapshotDetailResponse> {
    const { data } = await axiosInstance.get<SnapshotDetailResponse>(
      API_ENDPOINTS.SNAPSHOTS.BY_ID(id)
    );
    return data;
  },

  /** 스냅샷 생성 (빈 스냅샷) */
  async create(request: CreateSnapshotRequest): Promise<SnapshotResponse> {
    const { data } = await axiosInstance.post<SnapshotResponse>(
      API_ENDPOINTS.SNAPSHOTS.BASE,
      request
    );
    return data;
  },

  /** 코스에서 스냅샷 생성 */
  async createFromCourse(
    courseId: number,
    request: CreateSnapshotRequest
  ): Promise<SnapshotResponse> {
    const { data } = await axiosInstance.post<SnapshotResponse>(
      API_ENDPOINTS.SNAPSHOTS.FROM_COURSE(courseId),
      request
    );
    return data;
  },

  /** 코스의 스냅샷 목록 조회 */
  async getSnapshotsByCourse(
    courseId: number,
    params?: SnapshotFilterParams
  ): Promise<PageResponse<SnapshotResponse>> {
    const { data } = await axiosInstance.get<PageResponse<SnapshotResponse>>(
      API_ENDPOINTS.SNAPSHOTS.FROM_COURSE(courseId),
      { params }
    );
    return data;
  },

  /** 스냅샷 수정 */
  async update(
    id: number,
    request: UpdateSnapshotRequest
  ): Promise<SnapshotResponse> {
    const { data } = await axiosInstance.put<SnapshotResponse>(
      API_ENDPOINTS.SNAPSHOTS.BY_ID(id),
      request
    );
    return data;
  },

  /** 스냅샷 삭제 */
  async delete(id: number): Promise<void> {
    await axiosInstance.delete(API_ENDPOINTS.SNAPSHOTS.BY_ID(id));
  },

  // ============================================
  // Snapshot 상태 전이
  // ============================================

  /** 스냅샷 발행 (DRAFT → ACTIVE) */
  async publish(id: number): Promise<SnapshotResponse> {
    const { data } = await axiosInstance.post<SnapshotResponse>(
      API_ENDPOINTS.SNAPSHOTS.PUBLISH(id)
    );
    return data;
  },

  /** 스냅샷 완료 (ACTIVE → COMPLETED) */
  async complete(id: number): Promise<SnapshotResponse> {
    const { data } = await axiosInstance.post<SnapshotResponse>(
      API_ENDPOINTS.SNAPSHOTS.COMPLETE(id)
    );
    return data;
  },

  /** 스냅샷 보관 (COMPLETED → ARCHIVED) */
  async archive(id: number): Promise<SnapshotResponse> {
    const { data } = await axiosInstance.post<SnapshotResponse>(
      API_ENDPOINTS.SNAPSHOTS.ARCHIVE(id)
    );
    return data;
  },

  // ============================================
  // Snapshot Items
  // ============================================

  /** 스냅샷 아이템 계층 구조 조회 */
  async getItems(snapshotId: number): Promise<SnapshotItemResponse[]> {
    const { data } = await axiosInstance.get<SnapshotItemResponse[]>(
      API_ENDPOINTS.SNAPSHOTS.ITEMS(snapshotId)
    );
    return data;
  },

  /** 스냅샷 아이템 평면 목록 조회 */
  async getItemsFlat(snapshotId: number): Promise<SnapshotItemResponse[]> {
    const { data } = await axiosInstance.get<SnapshotItemResponse[]>(
      API_ENDPOINTS.SNAPSHOTS.ITEMS_FLAT(snapshotId)
    );
    return data;
  },

  /** 스냅샷 아이템 추가 */
  async addItem(
    snapshotId: number,
    request: CreateSnapshotItemRequest
  ): Promise<SnapshotItemResponse> {
    const { data } = await axiosInstance.post<SnapshotItemResponse>(
      API_ENDPOINTS.SNAPSHOTS.ITEMS(snapshotId),
      request
    );
    return data;
  },

  /** 스냅샷 아이템 이름 수정 */
  async updateItem(
    snapshotId: number,
    itemId: number,
    request: UpdateSnapshotItemRequest
  ): Promise<SnapshotItemResponse> {
    const { data } = await axiosInstance.put<SnapshotItemResponse>(
      API_ENDPOINTS.SNAPSHOTS.ITEM_BY_ID(snapshotId, itemId),
      request
    );
    return data;
  },

  /** 스냅샷 아이템 이동 */
  async moveItem(
    snapshotId: number,
    itemId: number,
    request: MoveSnapshotItemRequest
  ): Promise<SnapshotItemResponse> {
    const { data } = await axiosInstance.put<SnapshotItemResponse>(
      API_ENDPOINTS.SNAPSHOTS.ITEM_MOVE(snapshotId, itemId),
      request
    );
    return data;
  },

  /** 스냅샷 아이템 삭제 */
  async deleteItem(snapshotId: number, itemId: number): Promise<void> {
    await axiosInstance.delete(
      API_ENDPOINTS.SNAPSHOTS.ITEM_BY_ID(snapshotId, itemId)
    );
  },

  // ============================================
  // Snapshot Relations (학습 순서)
  // ============================================

  /** 스냅샷 관계 목록 조회 */
  async getRelations(snapshotId: number): Promise<SnapshotRelationResponse[]> {
    const { data } = await axiosInstance.get<SnapshotRelationResponse[]>(
      API_ENDPOINTS.SNAPSHOTS.RELATIONS(snapshotId)
    );
    return data;
  },

  /** 스냅샷 관계 순서대로 조회 */
  async getRelationsOrdered(
    snapshotId: number
  ): Promise<SnapshotRelationsResponse> {
    const { data } = await axiosInstance.get<SnapshotRelationsResponse>(
      API_ENDPOINTS.SNAPSHOTS.RELATIONS_ORDERED(snapshotId)
    );
    return data;
  },

  /** 스냅샷 관계 생성 */
  async createRelation(
    snapshotId: number,
    request: CreateSnapshotRelationRequest
  ): Promise<SnapshotRelationResponse> {
    const { data } = await axiosInstance.post<SnapshotRelationResponse>(
      API_ENDPOINTS.SNAPSHOTS.RELATIONS(snapshotId),
      request
    );
    return data;
  },

  /** 스냅샷 시작점 설정 */
  async setStartItem(
    snapshotId: number,
    request: SetStartSnapshotItemRequest
  ): Promise<SnapshotRelationResponse> {
    const { data } = await axiosInstance.put<SnapshotRelationResponse>(
      API_ENDPOINTS.SNAPSHOTS.RELATIONS_START(snapshotId),
      request
    );
    return data;
  },

  /** 스냅샷 관계 삭제 */
  async deleteRelation(snapshotId: number, relationId: number): Promise<void> {
    await axiosInstance.delete(
      API_ENDPOINTS.SNAPSHOTS.RELATION_BY_ID(snapshotId, relationId)
    );
  },
};
