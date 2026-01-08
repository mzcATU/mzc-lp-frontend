/**
 * Tenant Category React Query Hooks (TA - Tenant Admin)
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tenantCategoryService } from '@/services/ta';
import type { TenantCategoryRequest } from '@/services/ta/tenantCategoryService';

// Query Keys
export const tenantCategoryKeys = {
  all: ['tenantCategories'] as const,
  list: () => [...tenantCategoryKeys.all, 'list'] as const,
  public: () => [...tenantCategoryKeys.all, 'public'] as const,
};

// ============================================
// Queries
// ============================================

/** 카테고리 목록 조회 */
export const useTenantCategories = () => {
  return useQuery({
    queryKey: tenantCategoryKeys.list(),
    queryFn: () => tenantCategoryService.getCategories(),
  });
};

/** 공개 카테고리 목록 조회 (활성화된 것만) */
export const usePublicTenantCategories = () => {
  return useQuery({
    queryKey: tenantCategoryKeys.public(),
    queryFn: () => tenantCategoryService.getPublicCategories(),
  });
};

// ============================================
// Mutations
// ============================================

/** 카테고리 생성 */
export const useCreateTenantCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: TenantCategoryRequest) =>
      tenantCategoryService.createCategory(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantCategoryKeys.all });
    },
  });
};

/** 카테고리 수정 */
export const useUpdateTenantCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: number; request: TenantCategoryRequest }) =>
      tenantCategoryService.updateCategory(id, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantCategoryKeys.all });
    },
  });
};

/** 카테고리 삭제 */
export const useDeleteTenantCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => tenantCategoryService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantCategoryKeys.all });
    },
  });
};

/** 카테고리 순서 변경 */
export const useReorderTenantCategories = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryIds: number[]) =>
      tenantCategoryService.reorderCategories(categoryIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantCategoryKeys.all });
    },
  });
};
