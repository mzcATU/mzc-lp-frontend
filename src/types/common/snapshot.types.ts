/**
 * Snapshot 도메인 타입 정의
 * 백엔드 엔티티 구조에 맞춘 타입들
 */

// ============================================
// Enums (Union Types)
// ============================================

/** 스냅샷 상태 */
export type SnapshotStatus = 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';

// ============================================
// Response Types
// ============================================

/** 스냅샷 Learning Object 응답 */
export interface SnapshotLearningObjectResponse {
  snapshotLoId: number;
  sourceLoId: number | null;
  contentId: number;
  displayName: string;
  duration: number | null;
  thumbnailUrl: string | null;
  resolution: string | null;
  externalUrl: string | null;
  description: string | null;
  downloadable: boolean | null;
  pageCount: number | null;
  isCustomized: boolean;
}

/** 스냅샷 아이템 응답 */
export interface SnapshotItemResponse {
  itemId: number;
  snapshotId: number;
  itemName: string;
  parentId: number | null;
  depth: number;
  isFolder: boolean;
  itemType: string | null;
  snapshotLearningObject: SnapshotLearningObjectResponse | null;
  children: SnapshotItemResponse[] | null;
  createdAt: string;
  updatedAt: string;
}

/** 스냅샷 목록 조회 응답 */
export interface SnapshotResponse {
  snapshotId: number;
  snapshotName: string;
  description: string | null;
  hashtags: string | null;
  sourceCourseId: number | null;
  sourceCourseName: string | null;
  createdBy: number;
  status: SnapshotStatus;
  version: number;
  tenantId: number;
  createdAt: string;
  updatedAt: string;
}

/** 스냅샷 상세 조회 응답 */
export interface SnapshotDetailResponse {
  snapshotId: number;
  snapshotName: string;
  description: string | null;
  hashtags: string | null;
  sourceCourseId: number | null;
  sourceCourseName: string | null;
  createdBy: number;
  status: SnapshotStatus;
  version: number;
  tenantId: number;
  items: SnapshotItemResponse[];
  itemCount: number;
  totalDuration: number | null;
  createdAt: string;
  updatedAt: string;
}

/** 스냅샷 관계 응답 */
export interface SnapshotRelationResponse {
  relationId: number;
  snapshotId: number;
  fromItemId: number | null;
  fromItemName: string | null;
  toItemId: number;
  toItemName: string;
  isStartPoint: boolean;
  createdAt: string;
}

/** 순서 아이템 (관계 조회용) */
export interface SnapshotOrderedItem {
  itemId: number;
  itemName: string;
  seq: number;
}

/** 스냅샷 관계 목록 응답 */
export interface SnapshotRelationsResponse {
  snapshotId: number;
  orderedItems: SnapshotOrderedItem[];
  relations: SnapshotRelationResponse[];
}

// ============================================
// Request Types
// ============================================

/** 스냅샷 생성 요청 */
export interface CreateSnapshotRequest {
  snapshotName: string;
  description?: string;
  hashtags?: string;
}

/** 스냅샷 수정 요청 */
export interface UpdateSnapshotRequest {
  snapshotName?: string;
  description?: string;
  hashtags?: string;
}

/** 스냅샷 아이템 생성 요청 */
export interface CreateSnapshotItemRequest {
  itemName: string;
  parentId?: number | null;
  learningObjectId?: number | null;
  itemType?: string;
}

/** 스냅샷 아이템 수정 요청 */
export interface UpdateSnapshotItemRequest {
  itemName: string;
}

/** 스냅샷 아이템 이동 요청 */
export interface MoveSnapshotItemRequest {
  newParentId?: number | null;
}

/** 스냅샷 관계 생성 요청 */
export interface CreateSnapshotRelationRequest {
  fromItemId?: number | null;
  toItemId: number;
}

/** 스냅샷 시작점 설정 요청 */
export interface SetStartSnapshotItemRequest {
  itemId: number;
}

// ============================================
// Utility Types & Constants
// ============================================

/** SnapshotStatus 라벨 맵 */
export const SNAPSHOT_STATUS_LABELS: Record<SnapshotStatus, string> = {
  DRAFT: '초안',
  ACTIVE: '활성',
  COMPLETED: '완료',
  ARCHIVED: '보관됨',
};

/** SnapshotStatus 색상 맵 (UI용) */
export const SNAPSHOT_STATUS_COLORS: Record<
  SnapshotStatus,
  { bg: string; text: string }
> = {
  DRAFT: { bg: 'bg-gray-100', text: 'text-gray-700' },
  ACTIVE: { bg: 'bg-green-100', text: 'text-green-700' },
  COMPLETED: { bg: 'bg-blue-100', text: 'text-blue-700' },
  ARCHIVED: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
};
