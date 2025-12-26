/**
 * Catalog React Query Hooks
 */
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/common/authStore';
import { catalogService, type CatalogFilterParams } from '@/services/tu/catalogService';

// Query Keys
export const catalogKeys = {
  all: ['catalog'] as const,
  programs: () => [...catalogKeys.all, 'programs'] as const,
  programList: (params?: CatalogFilterParams) => [...catalogKeys.programs(), params] as const,
  programDetail: (id: number) => [...catalogKeys.programs(), 'detail', id] as const,
  courseTimes: (programId: number) => [...catalogKeys.all, 'courseTimes', programId] as const,
  courseTime: (id: number) => [...catalogKeys.all, 'courseTime', id] as const,
};

/**
 * 카탈로그 프로그램 목록 조회 훅
 */
export const useCatalogPrograms = (params?: CatalogFilterParams) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: catalogKeys.programList(params),
    queryFn: () => catalogService.getPrograms(params),
    enabled: isAuthenticated,
  });
};

/**
 * 프로그램 상세 조회 훅
 */
export const useCatalogProgram = (id: number) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: catalogKeys.programDetail(id),
    queryFn: () => catalogService.getProgram(id),
    enabled: isAuthenticated && !!id,
  });
};

/**
 * 프로그램의 차수 목록 조회 훅
 */
export const useCatalogCourseTimes = (programId: number) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: catalogKeys.courseTimes(programId),
    queryFn: () => catalogService.getCourseTimes(programId),
    enabled: isAuthenticated && !!programId,
  });
};

/**
 * 차수 상세 조회 훅
 */
export const useCatalogCourseTime = (id: number) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: catalogKeys.courseTime(id),
    queryFn: () => catalogService.getCourseTime(id),
    enabled: isAuthenticated && !!id,
  });
};
