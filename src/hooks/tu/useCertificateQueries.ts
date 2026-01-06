/**
 * Certificate React Query Hooks
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/common/authStore';
import { certificateService } from '@/services/tu/certificateService';
import type { CertificateFilterParams, CertificateReissueRequest } from '@/types/tu';
import { enrollmentKeys } from './useEnrollmentQueries';

// Query Keys
export const certificateKeys = {
  all: ['certificates'] as const,
  my: () => [...certificateKeys.all, 'my'] as const,
  myList: (params?: CertificateFilterParams) => [...certificateKeys.my(), params] as const,
  detail: (id: number) => [...certificateKeys.all, 'detail', id] as const,
  byEnrollment: (enrollmentId: number) => [...certificateKeys.all, 'enrollment', enrollmentId] as const,
  verify: (certificateNumber: string) => [...certificateKeys.all, 'verify', certificateNumber] as const,
};

/**
 * 내 수료증 목록 조회 훅
 */
export const useMyCertificates = (params?: CertificateFilterParams) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: certificateKeys.myList(params),
    queryFn: () => certificateService.getMyCertificates(params),
    enabled: isAuthenticated,
  });
};

/**
 * 수료증 상세 조회 훅
 */
export const useCertificate = (id: number, options?: { enabled?: boolean }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const externalEnabled = options?.enabled ?? true;

  return useQuery({
    queryKey: certificateKeys.detail(id),
    queryFn: () => certificateService.getCertificate(id),
    enabled: externalEnabled && isAuthenticated && !!id,
  });
};

/**
 * 수강별 수료증 조회 훅
 */
export const useCertificateByEnrollment = (enrollmentId: number, options?: { enabled?: boolean }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const externalEnabled = options?.enabled ?? true;

  return useQuery({
    queryKey: certificateKeys.byEnrollment(enrollmentId),
    queryFn: () => certificateService.getCertificateByEnrollment(enrollmentId),
    enabled: externalEnabled && isAuthenticated && !!enrollmentId,
  });
};

/**
 * 수료증 검증 훅 (공개 API)
 */
export const useVerifyCertificate = (certificateNumber: string, options?: { enabled?: boolean }) => {
  const externalEnabled = options?.enabled ?? true;

  return useQuery({
    queryKey: certificateKeys.verify(certificateNumber),
    queryFn: () => certificateService.verifyCertificate(certificateNumber),
    enabled: externalEnabled && !!certificateNumber,
  });
};

/**
 * 수료증 PDF 다운로드 뮤테이션 훅
 */
export const useDownloadCertificate = () => {
  return useMutation({
    mutationFn: async ({ id, fileName }: { id: number; fileName: string }) => {
      const blob = await certificateService.downloadCertificate(id);
      certificateService.triggerDownload(blob, fileName);
      return blob;
    },
  });
};

/**
 * 수료증 발급 뮤테이션 훅 (수동 발급)
 */
export const useIssueCertificate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (enrollmentId: number) => certificateService.issueCertificate(enrollmentId),
    onSuccess: () => {
      // 수료증 목록 갱신
      queryClient.invalidateQueries({ queryKey: certificateKeys.my() });
      // 수강 목록 갱신 (수료증 발급 상태 반영)
      queryClient.invalidateQueries({ queryKey: enrollmentKeys.my() });
    },
  });
};

/**
 * 수료증 재발급 뮤테이션 훅
 */
export const useReissueCertificate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: number; request: CertificateReissueRequest }) =>
      certificateService.reissueCertificate(id, request),
    onSuccess: (_, { id }) => {
      // 수료증 목록 갱신
      queryClient.invalidateQueries({ queryKey: certificateKeys.my() });
      // 해당 수료증 상세 갱신
      queryClient.invalidateQueries({ queryKey: certificateKeys.detail(id) });
    },
  });
};
