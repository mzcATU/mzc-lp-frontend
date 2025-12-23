/**
 * Learning Object (LO) React Query Hooks
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { learningObjectService } from '@/services/tu';
import type {
  LearningObjectFilterParams,
  CreateLearningObjectRequest,
  UpdateLearningObjectRequest,
  MoveFolderRequest,
} from '@/types/tu';

// Query Keys
export const learningObjectKeys = {
  all: ['learningObjects'] as const,
  lists: () => [...learningObjectKeys.all, 'list'] as const,
  list: (params?: LearningObjectFilterParams) => [...learningObjectKeys.lists(), params] as const,
  details: () => [...learningObjectKeys.all, 'detail'] as const,
  detail: (id: number) => [...learningObjectKeys.details(), id] as const,
  byContent: (contentId: number) => [...learningObjectKeys.all, 'byContent', contentId] as const,
};

// 학습객체 목록 조회
export const useLearningObjects = (params?: LearningObjectFilterParams) => {
  return useQuery({
    queryKey: learningObjectKeys.list(params),
    queryFn: () => learningObjectService.getLearningObjects(params),
  });
};

// 학습객체 상세 조회
export const useLearningObject = (id: number) => {
  return useQuery({
    queryKey: learningObjectKeys.detail(id),
    queryFn: () => learningObjectService.getLearningObject(id),
    enabled: !!id,
  });
};

// Content ID로 학습객체 조회
export const useLearningObjectByContentId = (contentId: number) => {
  return useQuery({
    queryKey: learningObjectKeys.byContent(contentId),
    queryFn: () => learningObjectService.getLearningObjectByContentId(contentId),
    enabled: !!contentId,
  });
};

// 학습객체 생성
export const useCreateLearningObject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateLearningObjectRequest) =>
      learningObjectService.create(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: learningObjectKeys.lists() });
    },
  });
};

// 학습객체 수정
export const useUpdateLearningObject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: number; request: UpdateLearningObjectRequest }) =>
      learningObjectService.update(id, request),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: learningObjectKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: learningObjectKeys.lists() });
    },
  });
};

// 학습객체 폴더 이동
export const useMoveLearningObjectFolder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: number; request: MoveFolderRequest }) =>
      learningObjectService.moveToFolder(id, request),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: learningObjectKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: learningObjectKeys.lists() });
    },
  });
};

// 학습객체 삭제
export const useDeleteLearningObject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => learningObjectService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: learningObjectKeys.lists() });
    },
  });
};
