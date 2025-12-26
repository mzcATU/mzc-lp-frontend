/**
 * Category API 서비스 (TO)
 */
import axiosInstance from '@/services/common/api/axiosInstance';
import { API_ENDPOINTS } from '@/services/common/api/endpoints';
import type {
  CategoryResponse,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '@/types/common/category.types';

export const categoryService = {
  /** 카테고리 생성 */
  async create(request: CreateCategoryRequest): Promise<CategoryResponse> {
    const { data } = await axiosInstance.post<CategoryResponse>(
      API_ENDPOINTS.CATEGORIES.BASE,
      request
    );
    return data;
  },

  /** 카테고리 목록 조회 */
  async getCategories(): Promise<CategoryResponse[]> {
    const { data } = await axiosInstance.get<{ data: CategoryResponse[] }>(
      API_ENDPOINTS.CATEGORIES.BASE
    );
    return data.data;
  },

  /** 카테고리 상세 조회 */
  async getCategory(id: number): Promise<CategoryResponse> {
    const { data } = await axiosInstance.get<CategoryResponse>(
      API_ENDPOINTS.CATEGORIES.BY_ID(id)
    );
    return data;
  },

  /** 카테고리 수정 */
  async update(
    id: number,
    request: UpdateCategoryRequest
  ): Promise<CategoryResponse> {
    const { data } = await axiosInstance.put<CategoryResponse>(
      API_ENDPOINTS.CATEGORIES.BY_ID(id),
      request
    );
    return data;
  },

  /** 카테고리 삭제 */
  async delete(id: number): Promise<void> {
    await axiosInstance.delete(API_ENDPOINTS.CATEGORIES.BY_ID(id));
  },
};
