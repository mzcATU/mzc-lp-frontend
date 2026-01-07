/**
 * TA 테넌트 카테고리 관리 API 서비스
 */
import axiosInstance from '@/services/common/api/axiosInstance';
import { API_ENDPOINTS } from '@/services/common/api/endpoints';

// ============================================
// 타입 정의
// ============================================

export interface TenantCategoryResponse {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  displayOrder: number;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TenantCategoryRequest {
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  enabled?: boolean;
}

// ============================================
// API 서비스
// ============================================

export const tenantCategoryService = {
  /** 카테고리 목록 조회 */
  async getCategories(): Promise<TenantCategoryResponse[]> {
    const { data } = await axiosInstance.get<TenantCategoryResponse[]>(
      API_ENDPOINTS.TENANT_CATEGORIES.BASE
    );
    return data;
  },

  /** 활성화된 카테고리만 조회 (공개) */
  async getPublicCategories(): Promise<TenantCategoryResponse[]> {
    const { data } = await axiosInstance.get<TenantCategoryResponse[]>(
      API_ENDPOINTS.TENANT_CATEGORIES.PUBLIC
    );
    return data;
  },

  /** 카테고리 생성 */
  async createCategory(request: TenantCategoryRequest): Promise<TenantCategoryResponse> {
    const { data } = await axiosInstance.post<TenantCategoryResponse>(
      API_ENDPOINTS.TENANT_CATEGORIES.BASE,
      request
    );
    return data;
  },

  /** 카테고리 수정 */
  async updateCategory(id: number, request: TenantCategoryRequest): Promise<TenantCategoryResponse> {
    const { data } = await axiosInstance.put<TenantCategoryResponse>(
      API_ENDPOINTS.TENANT_CATEGORIES.BY_ID(id),
      request
    );
    return data;
  },

  /** 카테고리 삭제 */
  async deleteCategory(id: number): Promise<void> {
    await axiosInstance.delete(API_ENDPOINTS.TENANT_CATEGORIES.BY_ID(id));
  },

  /** 카테고리 순서 변경 */
  async reorderCategories(categoryIds: number[]): Promise<TenantCategoryResponse[]> {
    const { data } = await axiosInstance.put<TenantCategoryResponse[]>(
      API_ENDPOINTS.TENANT_CATEGORIES.REORDER,
      categoryIds
    );
    return data;
  },
};
