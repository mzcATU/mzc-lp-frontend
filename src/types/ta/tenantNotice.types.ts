/**
 * Tenant Notice 타입 정의 (TA)
 * 테넌트 관리자/운영자가 TO/TU에게 보내는 공지
 */

export type TenantNoticeType = 'GENERAL' | 'IMPORTANT' | 'URGENT' | 'EVENT';
export type TenantNoticeStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
export type NoticeTargetAudience = 'ALL' | 'OPERATOR' | 'USER' | 'DESIGNER' | 'INSTRUCTOR';

export interface TenantNotice {
  id: number;
  tenantId: number;
  title: string;
  content: string;
  type: TenantNoticeType;
  status: TenantNoticeStatus;
  targetAudience: NoticeTargetAudience;
  creatorRole: string;
  isPinned: boolean;
  publishedAt: string | null;
  expiredAt: string | null;
  createdBy: number;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface TenantNoticeListResponse {
  content: TenantNotice[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface TenantNoticeListParams {
  status?: TenantNoticeStatus;
  targetAudience?: NoticeTargetAudience;
  page?: number;
  size?: number;
}

export interface TenantNoticeSearchParams {
  keyword: string;
  page?: number;
  size?: number;
}

export interface CreateTenantNoticeRequest {
  title: string;
  content: string;
  type: TenantNoticeType;
  targetAudience: NoticeTargetAudience;
  isPinned?: boolean;
  expiredAt?: string;
}

export interface UpdateTenantNoticeRequest {
  title?: string;
  content?: string;
  type?: TenantNoticeType;
  targetAudience?: NoticeTargetAudience;
  isPinned?: boolean;
  expiredAt?: string;
}

// ============================================
// 배포 통계 관련 타입
// ============================================

/** 사용자별 배포 정보 */
export interface UserDistributionInfo {
  userId: number;
  userName: string;
  userEmail: string;
  userRole: string;
  isRead: boolean;
  distributedAt: string;
  readAt: string | null;
}

/** 공지사항별 배포 통계 */
export interface TenantNoticeDistributionStats {
  noticeId: number;
  noticeTitle: string;
  noticeType: TenantNoticeType;
  targetAudience: NoticeTargetAudience;
  isPinned: boolean;
  publishedAt: string | null;
  totalUsers: number;    // 대상 사용자 수
  sentCount: number;     // 발송된 수
  readCount: number;     // 열람한 수
}

/** 배포 통계 목록 응답 */
export interface TenantNoticeDistributionStatsResponse {
  content: TenantNoticeDistributionStats[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

/** 배포 통계 요약 */
export interface TenantNoticeDistributionSummary {
  totalDistributions: number;  // 총 배포 건수
  completedCount: number;      // 발행 완료 건수
  totalReadCount: number;      // 총 열람 수
  totalTargetUsers: number;    // 총 대상 사용자 수
  averageReadRate: number;     // 평균 열람율 (%)
}

/** 특정 공지사항의 상세 배포 현황 */
export interface TenantNoticeDistributionDetail {
  noticeId: number;
  noticeTitle: string;
  noticeType: TenantNoticeType;
  targetAudience: NoticeTargetAudience;
  publishedAt: string | null;
  sentCount: number;
  readCount: number;
  userDistributions: UserDistributionInfo[];
}
