/**
 * Enrollment React Query Hooks
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/common/authStore';
import { enrollmentService, type EnrollmentFilterParams } from '@/services/tu/enrollmentService';
import { catalogKeys } from './useCatalogQueries';

// Query Keys
export const enrollmentKeys = {
  all: ['enrollments'] as const,
  my: () => [...enrollmentKeys.all, 'my'] as const,
  myList: (params?: EnrollmentFilterParams) => [...enrollmentKeys.my(), params] as const,
  detail: (id: number) => [...enrollmentKeys.all, 'detail', id] as const,
};

/**
 * 내 수강 신청 목록 조회 훅
 */
export const useMyEnrollments = (params?: EnrollmentFilterParams) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: enrollmentKeys.myList(params),
    queryFn: () => enrollmentService.getMyEnrollments(params),
    enabled: isAuthenticated,
  });
};

/**
 * 수강 신청 상세 조회 훅
 */
export const useEnrollment = (id: number, options?: { enabled?: boolean }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const externalEnabled = options?.enabled ?? true;

  return useQuery({
    queryKey: enrollmentKeys.detail(id),
    queryFn: () => enrollmentService.getEnrollment(id),
    enabled: externalEnabled && isAuthenticated && !!id,
  });
};

/**
 * 수강 신청 뮤테이션 훅
 */
export const useEnroll = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseTimeId: number) => enrollmentService.enroll(courseTimeId),
    onSuccess: (_, courseTimeId) => {
      // 내 수강 목록 갱신
      queryClient.invalidateQueries({ queryKey: enrollmentKeys.my() });
      // 해당 차수의 수강 인원 갱신
      queryClient.invalidateQueries({ queryKey: catalogKeys.courseTime(courseTimeId) });
    },
  });
};

/**
 * 수강 신청 취소 뮤테이션 훅
 */
export const useCancelEnrollment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => enrollmentService.cancelEnrollment(id),
    onSuccess: (_, id) => {
      // 내 수강 목록 갱신
      queryClient.invalidateQueries({ queryKey: enrollmentKeys.my() });
      // 해당 신청 상세 갱신
      queryClient.invalidateQueries({ queryKey: enrollmentKeys.detail(id) });
    },
  });
};
