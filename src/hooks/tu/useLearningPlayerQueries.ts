/**
 * Learning Player React Query Hooks
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/common/authStore';
import { enrollmentService } from '@/services/tu/enrollmentService';
import type { UpdateProgressRequest } from '@/types/tu';
import { enrollmentKeys } from './useEnrollmentQueries';

// Query Keys
export const learningPlayerKeys = {
  all: ['learningPlayer'] as const,
  curriculum: (enrollmentId: number) => [...learningPlayerKeys.all, 'curriculum', enrollmentId] as const,
};

/**
 * 수강 상세 + 커리큘럼 조회 훅 (학습 플레이어용)
 */
export const useEnrollmentWithCurriculum = (enrollmentId: number) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: learningPlayerKeys.curriculum(enrollmentId),
    queryFn: () => enrollmentService.getEnrollmentWithCurriculum(enrollmentId),
    enabled: isAuthenticated && !!enrollmentId,
    staleTime: 1000 * 60 * 5, // 5분간 캐시
  });
};

/**
 * 학습 진도 업데이트 뮤테이션 훅
 */
export const useUpdateProgress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ enrollmentId, request }: { enrollmentId: number; request: UpdateProgressRequest }) =>
      enrollmentService.updateProgress(enrollmentId, request),
    onSuccess: (_, { enrollmentId }) => {
      // 커리큘럼 캐시 갱신
      queryClient.invalidateQueries({ queryKey: learningPlayerKeys.curriculum(enrollmentId) });
      // 수강 상세 캐시 갱신
      queryClient.invalidateQueries({ queryKey: enrollmentKeys.detail(enrollmentId) });
    },
  });
};

/**
 * 차시 완료 뮤테이션 훅
 */
export const useMarkItemComplete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ enrollmentId, itemId }: { enrollmentId: number; itemId: number }) =>
      enrollmentService.markItemComplete(enrollmentId, itemId),
    onSuccess: (_, { enrollmentId }) => {
      // 커리큘럼 캐시 갱신
      queryClient.invalidateQueries({ queryKey: learningPlayerKeys.curriculum(enrollmentId) });
      // 수강 상세 캐시 갱신
      queryClient.invalidateQueries({ queryKey: enrollmentKeys.detail(enrollmentId) });
      // 내 수강 목록도 갱신 (진도율 반영)
      queryClient.invalidateQueries({ queryKey: enrollmentKeys.my() });
    },
  });
};
