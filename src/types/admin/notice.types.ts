/**
 * Notice 타입 정의 (SA)
 */

export type NoticeType = 'SYSTEM' | 'UPDATE' | 'EVENT' | 'GENERAL';
export type NoticeStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface Notice {
  id: number;
  title: string;
  content: string;
  type: NoticeType;
  status: NoticeStatus;
  isPinned: boolean;
  publishedAt: string | null;
  expiredAt: string | null;
  createdBy: number;
  distributionCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface NoticeListResponse {
  content: Notice[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface NoticeListParams {
  keyword?: string;
  status?: NoticeStatus;
  type?: NoticeType;
  page?: number;
  size?: number;
}

export interface CreateNoticeRequest {
  title: string;
  content: string;
  type: NoticeType;
  isPinned?: boolean;
  expiredAt?: string;
}

export interface UpdateNoticeRequest {
  title?: string;
  content?: string;
  type?: NoticeType;
  isPinned?: boolean;
  expiredAt?: string;
}

export interface DistributeNoticeRequest {
  tenantIds: number[];
}

// ============================================
// 배포 통계 타입
// ============================================

export interface TenantDistributionInfo {
  tenantId: number;
  tenantName: string;
  tenantCode: string;
  isRead: boolean;
  distributedAt: string;
  readAt: string | null;
}

export interface NoticeDistributionStats {
  noticeId: number;
  noticeTitle: string;
  noticeType: NoticeType;
  noticeStatus: NoticeStatus;
  isPinned: boolean;
  totalTenants: number;
  sentCount: number;
  readCount: number;
  publishedAt: string | null;
  createdAt: string;
  tenantDistributions: TenantDistributionInfo[];
}

export interface NoticeDistributionStatsResponse {
  content: NoticeDistributionStats[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface NoticeDistributionSummary {
  totalDistributions: number;
  completedCount: number;
  inProgressCount: number;
  totalTenants: number;
  totalReadCount: number;
  averageReadRate: number;
}
