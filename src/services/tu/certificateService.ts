import axiosInstance from '@/services/common/api/axiosInstance';
import { API_ENDPOINTS } from '@/services/common/api/endpoints';
import type {
  CertificateDetailResponse,
  CertificateVerifyResponse,
  CertificateFilterParams,
  CertificatePageResponse,
  CertificateReissueRequest,
} from '@/types/tu';

/**
 * 수료증 서비스
 */
export const certificateService = {
  /**
   * 내 수료증 목록 조회
   */
  getMyCertificates: async (params?: CertificateFilterParams): Promise<CertificatePageResponse> => {
    const response = await axiosInstance.get<CertificatePageResponse>(
      API_ENDPOINTS.CERTIFICATES.MY,
      { params }
    );
    return response.data;
  },

  /**
   * 수료증 상세 조회
   */
  getCertificate: async (id: number): Promise<CertificateDetailResponse> => {
    const response = await axiosInstance.get<CertificateDetailResponse>(
      API_ENDPOINTS.CERTIFICATES.BY_ID(id)
    );
    return response.data;
  },

  /**
   * 수료증 PDF 다운로드
   * Blob으로 반환하여 파일 다운로드 처리
   */
  downloadCertificate: async (id: number): Promise<Blob> => {
    const response = await axiosInstance.get<Blob>(
      API_ENDPOINTS.CERTIFICATES.DOWNLOAD(id),
      { responseType: 'blob' }
    );
    return response.data;
  },

  /**
   * 수료증 검증 (공개 API)
   */
  verifyCertificate: async (certificateNumber: string): Promise<CertificateVerifyResponse> => {
    const response = await axiosInstance.get<CertificateVerifyResponse>(
      API_ENDPOINTS.CERTIFICATES.VERIFY(certificateNumber)
    );
    return response.data;
  },

  /**
   * 수강별 수료증 조회
   */
  getCertificateByEnrollment: async (enrollmentId: number): Promise<CertificateDetailResponse> => {
    const response = await axiosInstance.get<CertificateDetailResponse>(
      API_ENDPOINTS.CERTIFICATES.BY_ENROLLMENT(enrollmentId)
    );
    return response.data;
  },

  /**
   * 수료증 발급 (수동)
   */
  issueCertificate: async (enrollmentId: number): Promise<CertificateDetailResponse> => {
    const response = await axiosInstance.post<CertificateDetailResponse>(
      API_ENDPOINTS.CERTIFICATES.ISSUE(enrollmentId)
    );
    return response.data;
  },

  /**
   * 수료증 재발급
   */
  reissueCertificate: async (
    id: number,
    request: CertificateReissueRequest
  ): Promise<CertificateDetailResponse> => {
    const response = await axiosInstance.post<CertificateDetailResponse>(
      API_ENDPOINTS.CERTIFICATES.REISSUE(id),
      request
    );
    return response.data;
  },

  /**
   * 수료증 PDF 다운로드 트리거
   * Blob을 파일로 다운로드하는 헬퍼 함수
   */
  triggerDownload: (blob: Blob, fileName: string) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },
};

export default certificateService;
