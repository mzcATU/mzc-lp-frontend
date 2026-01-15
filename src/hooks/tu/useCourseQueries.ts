/**
 * Course React Query Hooks
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { courseService } from '@/services/common/courseService';
import type {
  CourseFilterParams,
  CourseRegistrationFilterParams,
} from '@/services/common/courseService';
import type {
  UpdateCourseRequest,
  RegisterCourseRequest,
} from '@/types/common/course.types';

// Query Keys
export const courseKeys = {
  all: ['courses'] as const,
  lists: () => [...courseKeys.all, 'list'] as const,
  list: (params?: CourseFilterParams) => [...courseKeys.lists(), params] as const,
  myLists: () => [...courseKeys.all, 'my'] as const,
  myList: (params?: CourseFilterParams) => [...courseKeys.myLists(), params] as const,
  details: () => [...courseKeys.all, 'detail'] as const,
  detail: (id: number) => [...courseKeys.details(), id] as const,
  itemsHierarchy: (id: number) => [...courseKeys.detail(id), 'itemsHierarchy'] as const,
};

// 강의 목록 조회
export const useCourses = (params?: CourseFilterParams) => {
  return useQuery({
    queryKey: courseKeys.list(params),
    queryFn: () => courseService.getCourses(params),
  });
};

// 내 강의 목록 조회
export const useMyCourses = (params?: CourseFilterParams) => {
  return useQuery({
    queryKey: courseKeys.myList(params),
    queryFn: () => courseService.getMyCourses(params),
  });
};

// 강의 상세 조회
export const useCourse = (id: number) => {
  return useQuery({
    queryKey: courseKeys.detail(id),
    queryFn: () => courseService.getCourse(id),
    enabled: !!id,
  });
};

// 커리큘럼 계층 구조 조회
export const useCourseItemsHierarchy = (courseId: number) => {
  return useQuery({
    queryKey: courseKeys.itemsHierarchy(courseId),
    queryFn: () => courseService.getItemsHierarchy(courseId),
    enabled: !!courseId,
  });
};

// 강의 수정
export const useUpdateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: number; request: UpdateCourseRequest }) =>
      courseService.update(id, request),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: courseKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
      queryClient.invalidateQueries({ queryKey: courseKeys.myLists() });
    },
  });
};

// 강의 삭제
export const useDeleteCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => courseService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
      queryClient.invalidateQueries({ queryKey: courseKeys.myLists() });
    },
  });
};

// ============================================
// CO 과정 등록 워크플로우 (Program 대체)
// ============================================

// CO 과정 등록 Query Keys
export const courseRegistrationKeys = {
  all: ['courseRegistrations'] as const,
  lists: () => [...courseRegistrationKeys.all, 'list'] as const,
  list: (params?: CourseRegistrationFilterParams) =>
    [...courseRegistrationKeys.lists(), params] as const,
  readyLists: () => [...courseRegistrationKeys.all, 'ready'] as const,
  readyList: (params?: Omit<CourseRegistrationFilterParams, 'status'>) =>
    [...courseRegistrationKeys.readyLists(), params] as const,
  registeredLists: () => [...courseRegistrationKeys.all, 'registered'] as const,
  registeredList: (params?: Omit<CourseRegistrationFilterParams, 'status'>) =>
    [...courseRegistrationKeys.registeredLists(), params] as const,
  details: () => [...courseRegistrationKeys.all, 'detail'] as const,
  detail: (id: number) => [...courseRegistrationKeys.details(), id] as const,
};

/**
 * 등록된 과정 목록 조회 (CO용)
 * @deprecated useApprovedPrograms 대체
 */
export const useCourseRegistrations = (params?: CourseRegistrationFilterParams) => {
  return useQuery({
    queryKey: courseRegistrationKeys.list(params),
    queryFn: () => courseService.getCourseRegistrations(params),
  });
};

/**
 * 검토 대기(READY) 과정 목록 조회
 * @deprecated usePendingPrograms 대체
 */
export const useReadyCourses = (
  params?: Omit<CourseRegistrationFilterParams, 'status'>
) => {
  return useQuery({
    queryKey: courseRegistrationKeys.readyList(params),
    queryFn: () => courseService.getReadyCourses(params),
  });
};

/**
 * 승인된(REGISTERED) 과정 목록 조회
 * 차수 생성 시 선택 가능한 과정 목록
 * @deprecated useApprovedPrograms 대체
 */
export const useRegisteredCourses = (
  params?: Omit<CourseRegistrationFilterParams, 'status'>
) => {
  return useQuery({
    queryKey: courseRegistrationKeys.registeredList(params),
    queryFn: () => courseService.getRegisteredCourses(params),
  });
};

/**
 * 과정 등록 상세 조회 (CO용)
 * @deprecated useProgram 대체
 */
export const useCourseRegistration = (id: number) => {
  return useQuery({
    queryKey: courseRegistrationKeys.detail(id),
    queryFn: () => courseService.getCourseRegistration(id),
    enabled: !!id,
  });
};

/**
 * 과정 승인 (READY → REGISTERED)
 * @deprecated useApproveProgram 대체
 */
export const useRegisterCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: number; request?: RegisterCourseRequest }) =>
      courseService.register(id, request),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: courseRegistrationKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: courseRegistrationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: courseRegistrationKeys.readyLists() });
      queryClient.invalidateQueries({ queryKey: courseRegistrationKeys.registeredLists() });
    },
  });
};

/**
 * 과정 작성중으로 되돌리기 (READY → DRAFT)
 * TU가 자신의 과정을 다시 수정할 때 사용
 */
export const useUnreadyCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => courseService.unready(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: courseRegistrationKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: courseRegistrationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: courseRegistrationKeys.readyLists() });
    },
  });
};
