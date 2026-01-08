/**
 * Program 도메인 타입 정의
 * 백엔드 엔티티 구조에 맞춘 타입들
 */

// ============================================
// Enums (Union Types)
// ============================================

/** 프로그램 상태 */
export type ProgramStatus =
  | 'DRAFT' // 작성 중
  | 'PENDING' // 검토 대기
  | 'APPROVED' // 승인됨 (운영 가능)
  | 'REJECTED' // 반려됨
  | 'CLOSED'; // 종료됨

/** 프로그램 레벨 */
export type ProgramLevel =
  | 'BEGINNER' // 입문
  | 'INTERMEDIATE' // 중급
  | 'ADVANCED'; // 고급

/** 프로그램 타입 */
export type ProgramType =
  | 'ONLINE' // 온라인 (비대면)
  | 'OFFLINE' // 오프라인 (대면)
  | 'BLENDED'; // 블렌디드 (혼합)

// ============================================
// Response Types
// ============================================

/** 프로그램 목록 조회 응답 */
export interface ProgramResponse {
  id: number;
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  level: ProgramLevel | null;
  type: ProgramType | null;
  estimatedHours: number | null;
  status: ProgramStatus;
  creatorId: number;
  creatorName: string | null;
  ownerId: number | null;
  ownerName: string | null;
  ownerEmail: string | null;
  snapshotId: number | null;
  createdAt: string;
  updatedAt: string;
}

/** 프로그램 상세 조회 응답 */
export interface ProgramDetailResponse {
  id: number;
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  level: ProgramLevel | null;
  type: ProgramType | null;
  estimatedHours: number | null;
  status: ProgramStatus;
  creatorId: number;
  creatorName: string | null;
  ownerId: number | null;
  ownerName: string | null;
  ownerEmail: string | null;
  snapshotId: number | null;
  snapshotName: string | null;
  // 승인 정보
  approvedBy: number | null;
  approvedByName: string | null;
  approvedAt: string | null;
  approvalComment: string | null;
  // 반려 정보
  rejectionReason: string | null;
  rejectedAt: string | null;
  // 제출 정보
  submittedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/** 검토 대기 프로그램 응답 (OPERATOR용) */
export interface PendingProgramResponse {
  id: number;
  title: string;
  thumbnailUrl: string | null;
  level: ProgramLevel | null;
  type: ProgramType | null;
  creatorId: number;
  creatorName: string | null;
  submittedAt: string;
  snapshotId: number | null;
}

// ============================================
// Request Types
// ============================================

/** 프로그램 생성 요청 */
export interface CreateProgramRequest {
  title: string;
  description?: string;
  thumbnailUrl?: string;
  level?: ProgramLevel;
  type?: ProgramType;
  estimatedHours?: number;
  snapshotId?: number;
}

/** 프로그램 수정 요청 */
export interface UpdateProgramRequest {
  title?: string;
  description?: string;
  thumbnailUrl?: string;
  level?: ProgramLevel;
  type?: ProgramType;
  estimatedHours?: number;
}

/** 프로그램 승인 요청 */
export interface ApproveRequest {
  comment?: string;
}

/** 프로그램 반려 요청 */
export interface RejectRequest {
  reason: string;
}

// ============================================
// Utility Types & Constants
// ============================================

/** ProgramStatus 라벨 맵 */
export const PROGRAM_STATUS_LABELS: Record<ProgramStatus, string> = {
  DRAFT: '작성 중',
  PENDING: '검토 대기',
  APPROVED: '승인됨',
  REJECTED: '반려됨',
  CLOSED: '종료됨',
};

/** ProgramStatus 색상 맵 (UI용) */
export const PROGRAM_STATUS_COLORS: Record<
  ProgramStatus,
  { bg: string; text: string }
> = {
  DRAFT: { bg: 'bg-gray-100', text: 'text-gray-700' },
  PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  APPROVED: { bg: 'bg-green-100', text: 'text-green-700' },
  REJECTED: { bg: 'bg-red-100', text: 'text-red-700' },
  CLOSED: { bg: 'bg-slate-100', text: 'text-slate-700' },
};

/** ProgramLevel 라벨 맵 */
export const PROGRAM_LEVEL_LABELS: Record<ProgramLevel, string> = {
  BEGINNER: '입문',
  INTERMEDIATE: '중급',
  ADVANCED: '고급',
};

/** ProgramType 라벨 맵 */
export const PROGRAM_TYPE_LABELS: Record<ProgramType, string> = {
  ONLINE: '온라인',
  OFFLINE: '오프라인',
  BLENDED: '블렌디드',
};
