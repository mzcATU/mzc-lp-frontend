/**
 * TO(Tenant Operator) 강사 배정(InstructorAssignment) React Query Hooks
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { instructorAssignmentService } from '@/services/co';
import { timeKeys } from './useTimeQueries';
import type {
  AssignInstructorRequest,
  UpdateInstructorRoleRequest,
  ReplaceInstructorRequest,
  CancelAssignmentRequest,
  InstructorAssignmentFilterParams,
} from '@/types/co';

// ============================================
// Query Keys
// ============================================

export const instructorAssignmentKeys = {
  all: ['instructorAssignments'] as const,
  lists: () => [...instructorAssignmentKeys.all, 'list'] as const,
  list: (params?: InstructorAssignmentFilterParams) =>
    [...instructorAssignmentKeys.lists(), params] as const,
  byTime: (timeId: number) => [...instructorAssignmentKeys.all, 'time', timeId] as const,
  timeList: (timeId: number, params?: InstructorAssignmentFilterParams) =>
    [...instructorAssignmentKeys.byTime(timeId), params] as const,
};

// ============================================
// Query Hooks
// ============================================

/** 전체 강사 배정 목록 조회 (TO 전용) */
export const useInstructorAssignments = (params?: InstructorAssignmentFilterParams) => {
  return useQuery({
    queryKey: instructorAssignmentKeys.list(params),
    queryFn: () => instructorAssignmentService.getAssignments(params),
  });
};

/** 차수별 강사 목록 조회 */
export const useTimeInstructors = (
  timeId: number,
  params?: InstructorAssignmentFilterParams
) => {
  return useQuery({
    queryKey: instructorAssignmentKeys.timeList(timeId, params),
    queryFn: () => instructorAssignmentService.getInstructors(timeId, params),
    enabled: !!timeId,
  });
};

// ============================================
// Mutation Hooks
// ============================================

/** 강사 배정 */
export const useAssignInstructor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      timeId,
      request,
    }: {
      timeId: number;
      request: AssignInstructorRequest;
    }) => instructorAssignmentService.assignInstructor(timeId, request),
    onSuccess: (_, variables) => {
      // 차수별 강사 목록 갱신
      queryClient.invalidateQueries({
        queryKey: instructorAssignmentKeys.byTime(variables.timeId),
      });
      // 전체 배정 목록 갱신 (params 관계없이 모든 list 쿼리)
      queryClient.invalidateQueries({
        queryKey: instructorAssignmentKeys.lists(),
      });
      // CourseTimeDetailResponse.instructors 필드 갱신
      queryClient.invalidateQueries({
        queryKey: timeKeys.detail(variables.timeId),
      });
      // 차수 목록도 갱신 (instructors 필드 포함)
      queryClient.invalidateQueries({
        queryKey: timeKeys.lists(),
      });
    },
  });
};

/** 강사 역할 변경 */
export const useUpdateInstructorRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      timeId,
      assignmentId,
      request,
    }: {
      timeId: number;
      assignmentId: number;
      request: UpdateInstructorRoleRequest;
    }) => instructorAssignmentService.updateRole(timeId, assignmentId, request),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: instructorAssignmentKeys.byTime(variables.timeId),
      });
    },
  });
};

/** 강사 교체 */
export const useReplaceInstructor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      timeId,
      assignmentId,
      request,
    }: {
      timeId: number;
      assignmentId: number;
      request: ReplaceInstructorRequest;
    }) => instructorAssignmentService.replaceInstructor(timeId, assignmentId, request),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: instructorAssignmentKeys.byTime(variables.timeId),
      });
      // CourseTimeDetailResponse.instructors 필드 갱신
      queryClient.invalidateQueries({
        queryKey: timeKeys.detail(variables.timeId),
      });
    },
  });
};

/** 배정 취소 */
export const useCancelAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      timeId,
      assignmentId,
      request,
    }: {
      timeId: number;
      assignmentId: number;
      request?: CancelAssignmentRequest;
    }) => instructorAssignmentService.cancelAssignment(timeId, assignmentId, request),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: instructorAssignmentKeys.byTime(variables.timeId),
      });
      // CourseTimeDetailResponse.instructors 필드 갱신
      queryClient.invalidateQueries({
        queryKey: timeKeys.detail(variables.timeId),
      });
    },
  });
};
