/**
 * CourseTime 공지사항 React Query 훅
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { courseTimeAnnouncementService } from '@/services/tu/courseTimeAnnouncementService';
import type {
  CreateAnnouncementRequest,
  UpdateAnnouncementRequest,
} from '@/services/tu/courseTimeAnnouncementService';

// Query Keys
export const courseTimeAnnouncementKeys = {
  all: ['courseTimeAnnouncements'] as const,
  list: (timeId: number) => [...courseTimeAnnouncementKeys.all, 'list', timeId] as const,
  detail: (timeId: number, announcementId: number) =>
    [...courseTimeAnnouncementKeys.all, 'detail', timeId, announcementId] as const,
};

/**
 * 차수별 공지사항 목록 조회 훅
 */
export function useCourseTimeAnnouncements(timeId: number, enabled = true) {
  return useQuery({
    queryKey: courseTimeAnnouncementKeys.list(timeId),
    queryFn: () => courseTimeAnnouncementService.getAnnouncements(timeId),
    enabled: enabled && timeId > 0,
    staleTime: 1000 * 60 * 5, // 5분
  });
}

/**
 * 공지사항 상세 조회 훅
 */
export function useCourseTimeAnnouncementDetail(
  timeId: number,
  announcementId: number,
  enabled = true
) {
  return useQuery({
    queryKey: courseTimeAnnouncementKeys.detail(timeId, announcementId),
    queryFn: () => courseTimeAnnouncementService.getAnnouncementById(timeId, announcementId),
    enabled: enabled && timeId > 0 && announcementId > 0,
    staleTime: 1000 * 60 * 5, // 5분
  });
}

/**
 * 공지사항 생성 훅 (강사/관리자 전용)
 */
export function useCreateCourseTimeAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ timeId, request }: { timeId: number; request: CreateAnnouncementRequest }) =>
      courseTimeAnnouncementService.createAnnouncement(timeId, request),
    onSuccess: (_, variables) => {
      // 해당 차수의 공지사항 목록 무효화
      queryClient.invalidateQueries({
        queryKey: courseTimeAnnouncementKeys.list(variables.timeId),
      });
    },
  });
}

/**
 * 공지사항 수정 훅 (강사/관리자 전용)
 */
export function useUpdateCourseTimeAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      timeId,
      announcementId,
      request,
    }: {
      timeId: number;
      announcementId: number;
      request: UpdateAnnouncementRequest;
    }) => courseTimeAnnouncementService.updateAnnouncement(timeId, announcementId, request),
    onSuccess: (_, variables) => {
      // 해당 공지사항 상세 및 목록 무효화
      queryClient.invalidateQueries({
        queryKey: courseTimeAnnouncementKeys.detail(variables.timeId, variables.announcementId),
      });
      queryClient.invalidateQueries({
        queryKey: courseTimeAnnouncementKeys.list(variables.timeId),
      });
    },
  });
}

/**
 * 공지사항 삭제 훅 (강사/관리자 전용)
 */
export function useDeleteCourseTimeAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ timeId, announcementId }: { timeId: number; announcementId: number }) =>
      courseTimeAnnouncementService.deleteAnnouncement(timeId, announcementId),
    onSuccess: (_, variables) => {
      // 해당 차수의 공지사항 목록 무효화
      queryClient.invalidateQueries({
        queryKey: courseTimeAnnouncementKeys.list(variables.timeId),
      });
    },
  });
}
