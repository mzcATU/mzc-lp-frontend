/**
 * CMS Content API 서비스
 */
import axiosInstance from '@/services/common/api/axiosInstance';
import { API_ENDPOINTS } from '@/services/common/api/endpoints';
import type {
  ContentResponse,
  ContentListResponse,
  ContentVersionResponse,
  CreateExternalLinkRequest,
  UpdateContentRequest,
  RestoreVersionRequest,
  ContentFilterParams,
} from '@/types/tu';

// Spring Page 응답 타입
interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

// 완료 기준 타입 (백엔드 enum과 매칭)
type CompletionCriteria = 'BUTTON_CLICK' | 'PERCENT_90' | 'PERCENT_100';

// 파일 업로드 옵션
interface UploadFileOptions {
  folderId?: number;
  originalFileName?: string;
  description?: string;
  tags?: string;
  category?: string;
  completionCriteria?: CompletionCriteria;
  thumbnail?: File;
  downloadable?: boolean;
}

export const contentService = {
  // 파일 업로드
  async uploadFile(file: File, options?: UploadFileOptions): Promise<ContentResponse> {
    const formData = new FormData();
    formData.append('file', file);

    if (options?.folderId) {
      formData.append('folderId', String(options.folderId));
    }
    if (options?.originalFileName) {
      formData.append('originalFileName', options.originalFileName);
    }
    if (options?.description) {
      formData.append('description', options.description);
    }
    if (options?.tags) {
      formData.append('tags', options.tags);
    }
    if (options?.category) {
      formData.append('category', options.category);
    }
    if (options?.completionCriteria) {
      formData.append('completionCriteria', options.completionCriteria);
    }
    if (options?.thumbnail) {
      formData.append('thumbnail', options.thumbnail);
    }
    if (options?.downloadable !== undefined) {
      formData.append('downloadable', String(options.downloadable));
    }

    const { data } = await axiosInstance.post<ContentResponse>(
      API_ENDPOINTS.CONTENTS.UPLOAD,
      formData,
      {
        headers: {
          'Content-Type': undefined, // 브라우저가 boundary 포함하여 자동 설정
        },
        timeout: 300000, // 5분 (대용량 파일 업로드용)
      }
    );
    return data;
  },

  // 외부 링크 생성
  async createExternalLink(request: CreateExternalLinkRequest): Promise<ContentResponse> {
    const { data } = await axiosInstance.post<ContentResponse>(
      API_ENDPOINTS.CONTENTS.EXTERNAL_LINK,
      request
    );
    return data;
  },

  // 콘텐츠 목록 조회
  async getContents(params?: ContentFilterParams): Promise<PageResponse<ContentListResponse>> {
    const { data } = await axiosInstance.get<PageResponse<ContentListResponse>>(
      API_ENDPOINTS.CONTENTS.BASE,
      { params }
    );
    return data;
  },

  // 내 콘텐츠 목록 조회 (DESIGNER용)
  async getMyContents(params?: ContentFilterParams): Promise<PageResponse<ContentListResponse>> {
    const { data } = await axiosInstance.get<PageResponse<ContentListResponse>>(
      API_ENDPOINTS.CONTENTS.MY,
      { params }
    );
    return data;
  },

  // 콘텐츠 상세 조회
  async getContent(id: number): Promise<ContentResponse> {
    const { data } = await axiosInstance.get<ContentResponse>(
      API_ENDPOINTS.CONTENTS.BY_ID(id)
    );
    return data;
  },

  // 콘텐츠 메타데이터 수정
  async updateContent(id: number, request: UpdateContentRequest): Promise<ContentResponse> {
    const { data } = await axiosInstance.put<ContentResponse>(
      API_ENDPOINTS.CONTENTS.BY_ID(id),
      request
    );
    return data;
  },

  // 파일 교체
  async replaceFile(id: number, file: File): Promise<ContentResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const { data } = await axiosInstance.put<ContentResponse>(
      API_ENDPOINTS.CONTENTS.FILE(id),
      formData,
      {
        headers: {
          'Content-Type': undefined, // 브라우저가 boundary 포함하여 자동 설정
        },
        timeout: 300000, // 5분 (대용량 파일 업로드용)
      }
    );
    return data;
  },

  // 콘텐츠 삭제
  async deleteContent(id: number): Promise<void> {
    await axiosInstance.delete(API_ENDPOINTS.CONTENTS.BY_ID(id));
  },

  // 콘텐츠 보관 (Archive)
  async archiveContent(id: number): Promise<ContentResponse> {
    const { data } = await axiosInstance.post<ContentResponse>(
      API_ENDPOINTS.CONTENTS.ARCHIVE(id)
    );
    return data;
  },

  // 콘텐츠 복원
  async restoreContent(id: number): Promise<ContentResponse> {
    const { data } = await axiosInstance.post<ContentResponse>(
      API_ENDPOINTS.CONTENTS.RESTORE(id)
    );
    return data;
  },

  // 스트리밍 URL 반환 (관리자용 - DESIGNER, OPERATOR, TENANT_ADMIN)
  getStreamUrl(id: number): string {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api';
    return `${baseUrl}${API_ENDPOINTS.CONTENTS.STREAM(id)}`;
  },

  // 학습자용 스트리밍 URL 반환 (수강 신청한 강의의 콘텐츠)
  getLearnerStreamUrl(contentId: number): string {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api';
    return `${baseUrl}${API_ENDPOINTS.LEARNING.CONTENT_STREAM(contentId)}`;
  },

  // 다운로드 URL 반환 (관리자용)
  getDownloadUrl(id: number): string {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api';
    return `${baseUrl}${API_ENDPOINTS.CONTENTS.DOWNLOAD(id)}`;
  },

  // 학습자용 다운로드 URL 반환
  getLearnerDownloadUrl(contentId: number): string {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api';
    return `${baseUrl}${API_ENDPOINTS.LEARNING.CONTENT_DOWNLOAD(contentId)}`;
  },

  // 파일 다운로드 (Blob 방식 - 인증 토큰 포함)
  async downloadFile(id: number, fileName: string): Promise<void> {
    const response = await axiosInstance.get(
      API_ENDPOINTS.CONTENTS.DOWNLOAD(id),
      { responseType: 'blob' }
    );

    // 응답의 Content-Type을 사용하여 Blob 생성
    const contentType = response.headers['content-type'] || 'application/octet-stream';
    const blob = new Blob([response.data], { type: contentType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },

  // 미리보기 URL 반환
  getPreviewUrl(id: number): string {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api';
    return `${baseUrl}${API_ENDPOINTS.CONTENTS.PREVIEW(id)}`;
  },

  // 미리보기 데이터 가져오기 (Blob)
  async getPreviewData(id: number): Promise<{ blob: Blob; contentType: string }> {
    const response = await axiosInstance.get(
      API_ENDPOINTS.CONTENTS.PREVIEW(id),
      { responseType: 'blob' }
    );
    return {
      blob: response.data,
      contentType: response.headers['content-type'] || 'application/octet-stream',
    };
  },

  // 버전 히스토리 조회
  async getVersions(id: number): Promise<ContentVersionResponse[]> {
    const { data } = await axiosInstance.get<ContentVersionResponse[]>(
      API_ENDPOINTS.CONTENTS.VERSIONS(id)
    );
    return data;
  },

  // 특정 버전 조회
  async getVersion(id: number, versionNumber: number): Promise<ContentVersionResponse> {
    const { data } = await axiosInstance.get<ContentVersionResponse>(
      API_ENDPOINTS.CONTENTS.VERSION_BY_NUMBER(id, versionNumber)
    );
    return data;
  },

  // 버전 복원
  async restoreVersion(
    id: number,
    versionNumber: number,
    request?: RestoreVersionRequest
  ): Promise<ContentResponse> {
    const { data } = await axiosInstance.post<ContentResponse>(
      API_ENDPOINTS.CONTENTS.VERSION_RESTORE(id, versionNumber),
      request
    );
    return data;
  },
};
