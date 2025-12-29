/**
 * Course React Query Hooks
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { courseService } from '@/services/common/courseService';
import type {
  CourseFilterParams,
} from '@/services/common/courseService';
import type { UpdateCourseRequest } from '@/types/common/course.types';

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
