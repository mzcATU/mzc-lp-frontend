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
  ContentType,
  ContentStatus,
} from '@/types/tu';

// Spring Page 응답 타입
interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export const contentService = {
  // 파일 업로드
  async uploadFile(file: File, folderId?: number): Promise<ContentResponse> {
    const formData = new FormData();
    formData.append('file', file);
    if (folderId) {
      formData.append('folderId', String(folderId));
    }

    const { data } = await axiosInstance.post<ContentResponse>(
      API_ENDPOINTS.CONTENTS.UPLOAD,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
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
    const { data } = await axiosInstance.get<{ data: PageResponse<ContentListResponse> }>(
      API_ENDPOINTS.CONTENTS.BASE,
      { params }
    );
    return data.data;
  },

  // 내 콘텐츠 목록 조회 (DESIGNER용)
  async getMyContents(params?: ContentFilterParams): Promise<PageResponse<ContentListResponse>> {
    const { data } = await axiosInstance.get<{ data: PageResponse<ContentListResponse> }>(
      API_ENDPOINTS.CONTENTS.MY,
      { params }
    );
    return data.data;
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
    const { data } = await axiosInstance.patch<ContentResponse>(
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
          'Content-Type': 'multipart/form-data',
        },
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

  // 스트리밍 URL 반환
  getStreamUrl(id: number): string {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api';
    return `${baseUrl}${API_ENDPOINTS.CONTENTS.STREAM(id)}`;
  },

  // 다운로드 URL 반환
  getDownloadUrl(id: number): string {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api';
    return `${baseUrl}${API_ENDPOINTS.CONTENTS.DOWNLOAD(id)}`;
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
