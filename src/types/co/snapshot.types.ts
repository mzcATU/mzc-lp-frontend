/**
 * Snapshot 관련 타입 정의 (Tenant Operator)
 *
 * 백엔드 정렬 타입은 common/snapshot.types.ts 에서 관리됩니다.
 * 아래는 re-export 및 UI/폼 전용 타입들입니다.
 */

// ============================================
// Re-export from common (백엔드 정렬 타입)
// ============================================
export type {
  SnapshotStatus,
  SnapshotResponse,
  SnapshotDetailResponse,
  SnapshotItemResponse,
  SnapshotLearningObjectResponse,
  SnapshotRelationResponse,
  SnapshotOrderedItem,
  SnapshotRelationsResponse,
  CreateSnapshotRequest,
  UpdateSnapshotRequest,
  CreateSnapshotItemRequest,
  UpdateSnapshotItemRequest,
  MoveSnapshotItemRequest,
  CreateSnapshotRelationRequest,
  SetStartSnapshotItemRequest,
} from '../common/snapshot.types';

export {
  SNAPSHOT_STATUS_LABELS,
  SNAPSHOT_STATUS_COLORS,
} from '../common/snapshot.types';
