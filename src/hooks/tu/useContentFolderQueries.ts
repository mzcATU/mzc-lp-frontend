/**
 * Content Folder React Query Hooks
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contentFolderService } from '@/services/tu';
import type {
  CreateContentFolderRequest,
  UpdateContentFolderRequest,
  MoveContentFolderRequest,
} from '@/types/tu';

// Query Keys
export const contentFolderKeys = {
  all: ['contentFolders'] as const,
  tree: () => [...contentFolderKeys.all, 'tree'] as const,
  details: () => [...contentFolderKeys.all, 'detail'] as const,
  detail: (id: number) => [...contentFolderKeys.details(), id] as const,
  children: (id: number) => [...contentFolderKeys.detail(id), 'children'] as const,
};

// 전체 폴더 트리 조회
export const useContentFolderTree = () => {
  return useQuery({
    queryKey: contentFolderKeys.tree(),
    queryFn: () => contentFolderService.getFolderTree(),
  });
};

// 폴더 상세 조회
export const useContentFolder = (id: number) => {
  return useQuery({
    queryKey: contentFolderKeys.detail(id),
    queryFn: () => contentFolderService.getFolder(id),
    enabled: !!id,
  });
};

// 하위 폴더 목록 조회
export const useContentFolderChildren = (id: number) => {
  return useQuery({
    queryKey: contentFolderKeys.children(id),
    queryFn: () => contentFolderService.getChildren(id),
    enabled: !!id,
  });
};

// 폴더 생성
export const useCreateContentFolder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateContentFolderRequest) =>
      contentFolderService.create(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contentFolderKeys.tree() });
    },
  });
};

// 폴더명 수정
export const useUpdateContentFolder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: number; request: UpdateContentFolderRequest }) =>
      contentFolderService.update(id, request),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: contentFolderKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: contentFolderKeys.tree() });
    },
  });
};

// 폴더 이동
export const useMoveContentFolder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: number; request: MoveContentFolderRequest }) =>
      contentFolderService.move(id, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contentFolderKeys.tree() });
    },
  });
};

// 폴더 삭제
export const useDeleteContentFolder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => contentFolderService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contentFolderKeys.tree() });
    },
  });
};
