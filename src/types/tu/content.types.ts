/**
 * CMS (Content Management System) 관련 타입 정의
 * 백엔드 API와 매핑되는 타입들
 */

// 콘텐츠 타입
export type ContentType = 'VIDEO' | 'AUDIO' | 'DOCUMENT' | 'IMAGE' | 'EXTERNAL_LINK';

// 콘텐츠 상태
export type ContentStatus = 'ACTIVE' | 'ARCHIVED';

// 버전 변경 타입
export type VersionChangeType = 'FILE_UPLOAD' | 'FILE_REPLACE' | 'METADATA_UPDATE';

// 콘텐츠 응답 (상세)
export interface ContentResponse {
  id: number;
  originalFileName: string;
  storedFileName: string;
  contentType: ContentType;
  status: ContentStatus;
  fileSize: number;
  duration: number | null;
  resolution: string | null;
  pageCount: number | null;
  externalUrl: string | null;
  filePath: string;
  thumbnailPath: string | null;
  createdBy: number;
  currentVersion: number;
  inCourse: boolean;
  createdAt: string;
  updatedAt: string;
}

// 콘텐츠 목록 응답 (간소화)
export interface ContentListResponse {
  id: number;
  originalFileName: string;
  contentType: ContentType;
  status: ContentStatus;
  fileSize: number;
  duration: number | null;
  thumbnailPath: string | null;
  createdBy: number;
  currentVersion: number;
  createdAt: string;
}

// 콘텐츠 버전 응답
export interface ContentVersionResponse {
  id: number;
  contentId: number;
  versionNumber: number;
  changeType: VersionChangeType;
  originalFileName: string;
  contentType: ContentType;
  fileSize: number;
  duration: number | null;
  resolution: string | null;
  changeSummary: string | null;
  createdBy: number;
  createdAt: string;
}

// 외부 링크 생성 요청
export interface CreateExternalLinkRequest {
  url: string;           // 외부 링크 URL (필수)
  name: string;          // 콘텐츠 이름 (필수)
  folderId?: number | null;
}

// 콘텐츠 메타데이터 수정 요청
export interface UpdateContentRequest {
  originalFileName?: string;
}

// 버전 복원 요청
export interface RestoreVersionRequest {
  changeSummary?: string;
}

// 콘텐츠 다운로드 정보
export interface ContentDownloadInfo {
  url: string;
  originalFileName: string;
  contentType: string;
}

// 콘텐츠 필터 파라미터
export interface ContentFilterParams {
  contentType?: ContentType;
  keyword?: string;
  status?: ContentStatus;
  page?: number;
  size?: number;
  sort?: string;
}
