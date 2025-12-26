/**
 * Content (CMS) React Query Hooks
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/common/authStore';
import { contentService } from '@/services/tu';
import type {
  ContentFilterParams,
  CreateExternalLinkRequest,
  UpdateContentRequest,
  RestoreVersionRequest,
} from '@/types/tu';

// Query Keys
export const contentKeys = {
  all: ['contents'] as const,
  lists: () => [...contentKeys.all, 'list'] as const,
  list: (params?: ContentFilterParams) => [...contentKeys.lists(), params] as const,
  myLists: () => [...contentKeys.all, 'my'] as const,
  myList: (params?: ContentFilterParams) => [...contentKeys.myLists(), params] as const,
  details: () => [...contentKeys.all, 'detail'] as const,
  detail: (id: number) => [...contentKeys.details(), id] as const,
  versions: (id: number) => [...contentKeys.detail(id), 'versions'] as const,
  version: (id: number, versionNumber: number) =>
    [...contentKeys.versions(id), versionNumber] as const,
  preview: (id: number) => [...contentKeys.detail(id), 'preview'] as const,
};

// 콘텐츠 목록 조회
export const useContents = (params?: ContentFilterParams) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: contentKeys.list(params),
    queryFn: () => contentService.getContents(params),
    enabled: isAuthenticated,
  });
};

// 내 콘텐츠 목록 조회
export const useMyContents = (params?: ContentFilterParams) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: contentKeys.myList(params),
    queryFn: () => contentService.getMyContents(params),
    enabled: isAuthenticated,
  });
};

// 콘텐츠 상세 조회
export const useContent = (id: number) => {
  return useQuery({
    queryKey: contentKeys.detail(id),
    queryFn: () => contentService.getContent(id),
    enabled: !!id,
  });
};

// 버전 히스토리 조회
export const useContentVersions = (id: number) => {
  return useQuery({
    queryKey: contentKeys.versions(id),
    queryFn: () => contentService.getVersions(id),
    enabled: !!id,
  });
};

// 특정 버전 조회
export const useContentVersion = (id: number, versionNumber: number) => {
  return useQuery({
    queryKey: contentKeys.version(id, versionNumber),
    queryFn: () => contentService.getVersion(id, versionNumber),
    enabled: !!id && !!versionNumber,
  });
};

// 파일 업로드
export const useUploadContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ file, folderId, originalFileName }: { file: File; folderId?: number; originalFileName?: string }) =>
      contentService.uploadFile(file, folderId, originalFileName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: contentKeys.myLists() });
    },
  });
};

// 외부 링크 생성
export const useCreateExternalLink = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateExternalLinkRequest) =>
      contentService.createExternalLink(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: contentKeys.myLists() });
    },
  });
};

// 콘텐츠 수정
export const useUpdateContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: number; request: UpdateContentRequest }) =>
      contentService.updateContent(id, request),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: contentKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: contentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: contentKeys.myLists() });
    },
  });
};

// 파일 교체
export const useReplaceFile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, file }: { id: number; file: File }) =>
      contentService.replaceFile(id, file),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: contentKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: contentKeys.versions(variables.id) });
      queryClient.invalidateQueries({ queryKey: contentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: contentKeys.myLists() });
    },
  });
};

// 콘텐츠 삭제
export const useDeleteContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => contentService.deleteContent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: contentKeys.myLists() });
    },
  });
};

// 콘텐츠 보관
export const useArchiveContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => contentService.archiveContent(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: contentKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: contentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: contentKeys.myLists() });
    },
  });
};

// 콘텐츠 복원
export const useRestoreContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => contentService.restoreContent(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: contentKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: contentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: contentKeys.myLists() });
    },
  });
};

// 버전 복원
export const useRestoreVersion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      versionNumber,
      request,
    }: {
      id: number;
      versionNumber: number;
      request?: RestoreVersionRequest;
    }) => contentService.restoreVersion(id, versionNumber, request),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: contentKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: contentKeys.versions(variables.id) });
      queryClient.invalidateQueries({ queryKey: contentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: contentKeys.myLists() });
    },
  });
};

// 콘텐츠 미리보기 데이터 조회
export const useContentPreview = (id: number | null) => {
  return useQuery({
    queryKey: contentKeys.preview(id!),
    queryFn: () => contentService.getPreviewData(id!),
    enabled: !!id,
  });
};
