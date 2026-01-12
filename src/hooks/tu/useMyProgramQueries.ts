/**
 * TU(Tenant User) 내 프로그램(Program) React Query Hooks
 *
 * TO의 programService와 snapshotService를 사용하여
 * 현재 사용자가 생성한 프로그램을 관리합니다.
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/common/authStore';
import { programService, type ProgramFilterParams } from '@/services/co/programService';
import { snapshotService } from '@/services/co/snapshotService';
import type {
  UpdateProgramRequest,
  CreateSnapshotItemRequest,
  UpdateSnapshotItemRequest,
  MoveSnapshotItemRequest,
  UpdateSnapshotRequest,
} from '@/types/common';

// ============================================
// Query Keys
// ============================================

export const myProgramKeys = {
  all: ['my-programs'] as const,
  lists: () => [...myProgramKeys.all, 'list'] as const,
  list: (params?: MyProgramFilterParams) => [...myProgramKeys.lists(), params] as const,
  details: () => [...myProgramKeys.all, 'detail'] as const,
  detail: (id: number) => [...myProgramKeys.details(), id] as const,
  snapshot: (snapshotId: number) => [...myProgramKeys.all, 'snapshot', snapshotId] as const,
  snapshotItems: (snapshotId: number) =>
    [...myProgramKeys.all, 'snapshot-items', snapshotId] as const,
};

// ============================================
// Types
// ============================================

export interface MyProgramFilterParams {
  status?: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'CLOSED';
  keyword?: string;
  page?: number;
  size?: number;
  sort?: string;
}

// ============================================
// Query Hooks
// ============================================

/** 내 프로그램 목록 조회 (createdBy 필터) */
export const useMyPrograms = (params?: MyProgramFilterParams) => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: myProgramKeys.list(params),
    queryFn: () =>
      programService.getPrograms({
        ...params,
        createdBy: user?.id,
      } as ProgramFilterParams),
    enabled: isAuthenticated && !!user?.id,
  });
};

/** 내 프로그램 상세 조회 */
export const useMyProgram = (id: number) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: myProgramKeys.detail(id),
    queryFn: () => programService.getProgram(id),
    enabled: isAuthenticated && !!id,
  });
};

/** 스냅샷 상세 조회 */
export const useMyProgramSnapshot = (snapshotId: number) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: myProgramKeys.snapshot(snapshotId),
    queryFn: () => snapshotService.getSnapshot(snapshotId),
    enabled: isAuthenticated && !!snapshotId,
  });
};

/** 스냅샷 아이템 계층 구조 조회 */
export const useSnapshotItems = (snapshotId: number) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: myProgramKeys.snapshotItems(snapshotId),
    queryFn: () => snapshotService.getItems(snapshotId),
    enabled: isAuthenticated && !!snapshotId,
  });
};

// ============================================
// Mutation Hooks - Program
// ============================================

/** 프로그램 수정 */
export const useUpdateMyProgram = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: number; request: UpdateProgramRequest }) =>
      programService.updateProgram(id, request),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: myProgramKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: myProgramKeys.lists() });
    },
  });
};

/** 프로그램 삭제 */
export const useDeleteMyProgram = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => programService.deleteProgram(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: myProgramKeys.lists() });
    },
  });
};

/** 프로그램 제출 (DRAFT/REJECTED → PENDING) */
export const useSubmitMyProgram = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => programService.submitProgram(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: myProgramKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: myProgramKeys.lists() });
    },
  });
};

// ============================================
// Mutation Hooks - Snapshot
// ============================================

/** 스냅샷 기본정보 수정 */
export const useUpdateSnapshot = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: number; request: UpdateSnapshotRequest }) =>
      snapshotService.update(id, request),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: myProgramKeys.snapshot(variables.id) });
    },
  });
};

// ============================================
// Mutation Hooks - Snapshot Items
// ============================================

/** 스냅샷 아이템 추가 */
export const useAddSnapshotItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      snapshotId,
      request,
    }: {
      snapshotId: number;
      request: CreateSnapshotItemRequest;
    }) => snapshotService.addItem(snapshotId, request),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: myProgramKeys.snapshotItems(variables.snapshotId),
      });
      queryClient.invalidateQueries({
        queryKey: myProgramKeys.snapshot(variables.snapshotId),
      });
    },
  });
};

/** 스냅샷 아이템 이름 수정 */
export const useUpdateSnapshotItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      snapshotId,
      itemId,
      request,
    }: {
      snapshotId: number;
      itemId: number;
      request: UpdateSnapshotItemRequest;
    }) => snapshotService.updateItem(snapshotId, itemId, request),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: myProgramKeys.snapshotItems(variables.snapshotId),
      });
    },
  });
};

/** 스냅샷 아이템 이동 */
export const useMoveSnapshotItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      snapshotId,
      itemId,
      request,
    }: {
      snapshotId: number;
      itemId: number;
      request: MoveSnapshotItemRequest;
    }) => snapshotService.moveItem(snapshotId, itemId, request),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: myProgramKeys.snapshotItems(variables.snapshotId),
      });
    },
  });
};

/** 스냅샷 아이템 삭제 */
export const useDeleteSnapshotItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ snapshotId, itemId }: { snapshotId: number; itemId: number }) =>
      snapshotService.deleteItem(snapshotId, itemId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: myProgramKeys.snapshotItems(variables.snapshotId),
      });
      queryClient.invalidateQueries({
        queryKey: myProgramKeys.snapshot(variables.snapshotId),
      });
    },
  });
};
