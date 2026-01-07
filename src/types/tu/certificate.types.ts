/**
 * 수료증 관련 타입 정의
 * Backend: CertificateResponse, CertificateDetailResponse, CertificateVerifyResponse
 */

/**
 * 수료증 상태
 */
export type CertificateStatus = 'ISSUED' | 'VALID' | 'EXPIRED' | 'REVOKED';

/**
 * 수료증 상태 라벨
 */
export const CERTIFICATE_STATUS_LABELS: Record<CertificateStatus, { ko: string; en: string }> = {
  ISSUED: { ko: '발급됨', en: 'Issued' },
  VALID: { ko: '유효', en: 'Valid' },
  EXPIRED: { ko: '만료됨', en: 'Expired' },
  REVOKED: { ko: '취소됨', en: 'Revoked' },
};

/**
 * 수료증 상태 색상 (Badge variant)
 */
export const CERTIFICATE_STATUS_COLORS: Record<CertificateStatus, string> = {
  ISSUED: 'blue',
  VALID: 'green',
  EXPIRED: 'gray',
  REVOKED: 'red',
};

/**
 * 수료증 기본 응답 (목록용)
 */
export interface CertificateResponse {
  id: number;
  certificateNumber: string;
  programTitle: string;
  courseTimeTitle: string;
  userName: string;
  completedAt: string;
  issuedAt: string;
  status: CertificateStatus;
}

/**
 * 수료증 상세 응답
 */
export interface CertificateDetailResponse {
  id: number;
  certificateNumber: string;
  enrollmentId: number;
  courseTimeId: number;
  programTitle: string;
  courseTimeTitle: string;
  userName: string;
  completedAt: string;
  issuedAt: string;
  expiresAt: string | null;
  revokedAt: string | null;
  status: CertificateStatus;
  reissueCount: number;
  originalCertificateId: number | null;
  reissueReason: string | null;
}

/**
 * 수료증 검증 응답
 */
export interface CertificateVerifyResponse {
  valid: boolean;
  certificateNumber: string;
  userName: string; // 마스킹된 이름 (예: 홍*동)
  programTitle: string;
  courseTimeTitle: string;
  completedAt: string;
  issuedAt: string;
  status: CertificateStatus;
  message: string;
}

/**
 * 수료증 재발급 요청
 */
export interface CertificateReissueRequest {
  reason: string;
}

/**
 * 수료증 필터 파라미터
 */
export interface CertificateFilterParams {
  page?: number;
  size?: number;
  status?: CertificateStatus;
}

/**
 * 수료증 페이지 응답
 */
export interface CertificatePageResponse {
  content: CertificateResponse[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}
