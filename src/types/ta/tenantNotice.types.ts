/**
 * Tenant Notice 타입 정의 (TA)
 * 테넌트 관리자/운영자가 TO/TU에게 보내는 공지
 */

export type TenantNoticeType = 'GENERAL' | 'IMPORTANT' | 'URGENT' | 'EVENT';
export type TenantNoticeStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
export type NoticeTargetAudience = 'OPERATOR' | 'USER';

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
