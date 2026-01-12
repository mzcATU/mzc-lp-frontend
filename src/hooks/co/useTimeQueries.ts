/**
 * TO(Tenant Operator) 차수(CourseTime) React Query Hooks
 */
import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/common/authStore';
import { timeService } from '@/services/co';
import type {
  CourseTimeFilterParams,
  CreateCourseTimeRequest,
  UpdateCourseTimeRequest,
  CloneCourseTimeRequest,
} from '@/types/co';

// ============================================
// Query Keys
// ============================================

export const timeKeys = {
  all: ['times'] as const,
  lists: () => [...timeKeys.all, 'list'] as const,
  list: (params?: CourseTimeFilterParams) => [...timeKeys.lists(), params] as const,
  infinite: (params?: Omit<CourseTimeFilterParams, 'page'>) => [...timeKeys.all, 'infinite', params] as const,
  details: () => [...timeKeys.all, 'detail'] as const,
  detail: (id: number) => [...timeKeys.details(), id] as const,
  capacity: (id: number) => [...timeKeys.detail(id), 'capacity'] as const,
  price: (id: number) => [...timeKeys.detail(id), 'price'] as const,
};

// ============================================
// Query Hooks
// ============================================

/** 차수 목록 조회 */
export const useTimes = (params?: CourseTimeFilterParams) => {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: timeKeys.list(params),
    queryFn: () => timeService.getTimes(params),
    enabled: !!accessToken,
  });
};

/** 차수 목록 무한 스크롤 조회 */
export const useTimesInfinite = (params?: Omit<CourseTimeFilterParams, 'page'>) => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const pageSize = params?.size ?? 20;

  return useInfiniteQuery({
    queryKey: timeKeys.infinite(params),
    queryFn: ({ pageParam = 0 }) =>
      timeService.getTimes({ ...params, page: pageParam, size: pageSize }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (lastPage.number >= lastPage.totalPages - 1) {
        return undefined;
      }
      return lastPage.number + 1;
    },
    enabled: !!accessToken,
  });
};

/** 차수 상세 조회 */
export const useTime = (id: number) => {
  return useQuery({
    queryKey: timeKeys.detail(id),
    queryFn: () => timeService.getTime(id),
    enabled: !!id,
  });
};

/** 차수 정원 조회 */
export const useTimeCapacity = (id: number) => {
  return useQuery({
    queryKey: timeKeys.capacity(id),
    queryFn: () => timeService.getCapacity(id),
    enabled: !!id,
  });
};

/** 차수 가격 조회 */
export const useTimePrice = (id: number) => {
  return useQuery({
    queryKey: timeKeys.price(id),
    queryFn: () => timeService.getPrice(id),
    enabled: !!id,
  });
};

// ============================================
// Mutation Hooks - CRUD
// ============================================

/** 차수 생성 */
export const useCreateTime = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateCourseTimeRequest) => timeService.createTime(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: timeKeys.lists() });
    },
  });
};

/** 차수 수정 */
export const useUpdateTime = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: number; request: UpdateCourseTimeRequest }) =>
      timeService.updateTime(id, request),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: timeKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: timeKeys.lists() });
    },
  });
};

/** 차수 삭제 */
export const useDeleteTime = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => timeService.deleteTime(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: timeKeys.lists() });
    },
  });
};

/** 차수 복제 */
export const useCloneTime = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: number; request: CloneCourseTimeRequest }) =>
      timeService.cloneTime(id, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: timeKeys.lists() });
    },
  });
};

// ============================================
// Mutation Hooks - 상태 전이
// ============================================

/** 모집 개시 (DRAFT → RECRUITING) */
export const useOpenTime = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => timeService.openTime(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: timeKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: timeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: timeKeys.capacity(id) });
    },
  });
};

/** 수업 시작 (RECRUITING → ONGOING) */
export const useStartTime = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => timeService.startTime(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: timeKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: timeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: timeKeys.capacity(id) });
    },
  });
};

/** 수업 종료 (ONGOING → CLOSED) */
export const useCloseTime = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => timeService.closeTime(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: timeKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: timeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: timeKeys.capacity(id) });
    },
  });
};

/** 보관 처리 (CLOSED → ARCHIVED) */
export const useArchiveTime = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => timeService.archiveTime(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: timeKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: timeKeys.lists() });
    },
  });
};
