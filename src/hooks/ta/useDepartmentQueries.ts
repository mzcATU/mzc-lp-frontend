/**
 * 부서 관리 React Query 훅
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { departmentService } from '@/services/ta/departmentService';
import type {
  CreateDepartmentRequest,
  UpdateDepartmentRequest,
} from '@/types/ta/department.types';

// Query Keys
export const departmentKeys = {
  all: ['departments'] as const,
  lists: () => [...departmentKeys.all, 'list'] as const,
  list: () => [...departmentKeys.lists()] as const,
  tree: () => [...departmentKeys.all, 'tree'] as const,
  active: () => [...departmentKeys.all, 'active'] as const,
  search: (keyword: string) => [...departmentKeys.all, 'search', keyword] as const,
  details: () => [...departmentKeys.all, 'detail'] as const,
  detail: (id: number) => [...departmentKeys.details(), id] as const,
};

// ============================================
// Queries
// ============================================

/** 부서 목록 조회 */
export function useDepartments() {
  return useQuery({
    queryKey: departmentKeys.list(),
    queryFn: () => departmentService.getAll(),
  });
}

/** 부서 트리 조회 (계층 구조) */
export function useDepartmentTree() {
  return useQuery({
    queryKey: departmentKeys.tree(),
    queryFn: () => departmentService.getTree(),
  });
}

/** 활성 부서 조회 */
export function useActiveDepartments() {
  return useQuery({
    queryKey: departmentKeys.active(),
    queryFn: () => departmentService.getActive(),
  });
}

/** 부서 검색 */
export function useDepartmentSearch(keyword: string, enabled = true) {
  return useQuery({
    queryKey: departmentKeys.search(keyword),
    queryFn: () => departmentService.search(keyword),
    enabled: enabled && !!keyword,
  });
}

/** 부서 상세 조회 */
export function useDepartment(id: number, enabled = true) {
  return useQuery({
    queryKey: departmentKeys.detail(id),
    queryFn: () => departmentService.getById(id),
    enabled: enabled && id > 0,
  });
}

// ============================================
// Mutations
// ============================================

/** 부서 생성 */
export function useCreateDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateDepartmentRequest) => departmentService.create(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.all });
    },
  });
}

/** 부서 수정 */
export function useUpdateDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: number; request: UpdateDepartmentRequest }) =>
      departmentService.update(id, request),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.all });
      queryClient.invalidateQueries({ queryKey: departmentKeys.detail(id) });
    },
  });
}

/** 부서 삭제 */
export function useDeleteDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => departmentService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.all });
    },
  });
}
