/**
 * Course API 서비스 (TO, TU 공통)
 */
import axiosInstance from '@/services/common/api/axiosInstance';
import { API_ENDPOINTS } from '@/services/common/api/endpoints';
import type {
  CourseResponse,
  CourseDetailResponse,
  CourseItemResponse,
  CourseItemHierarchyResponse,
  CreateCourseRequest,
  UpdateCourseRequest,
  CreateItemRequest,
  CreateFolderRequest,
  MoveItemRequest,
  UpdateItemNameRequest,
  UpdateLearningObjectRequest,
} from '@/types/common/course.types';

// Spring Page 응답 타입
interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

// 강의 필터 파라미터
export interface CourseFilterParams {
  keyword?: string;
  categoryId?: number;
  page?: number;
  size?: number;
  sort?: string;
}

export const courseService = {
  // ============================================
  // Course CRUD
  // ============================================

  /** 강의 생성 */
  async create(request: CreateCourseRequest): Promise<CourseResponse> {
    const { data } = await axiosInstance.post<{ data: CourseResponse }>(
      API_ENDPOINTS.COURSES.BASE,
      request
    );
    return data.data;
  },

  /** 강의 목록 조회 */
  async getCourses(
    params?: CourseFilterParams
  ): Promise<PageResponse<CourseResponse>> {
    const { data } = await axiosInstance.get<PageResponse<CourseResponse>>(
      API_ENDPOINTS.COURSES.BASE,
      { params }
    );
    return data;
  },

  /** 내 강의 목록 조회 */
  async getMyCourses(
    params?: CourseFilterParams
  ): Promise<PageResponse<CourseResponse>> {
    const { data } = await axiosInstance.get<PageResponse<CourseResponse>>(
      API_ENDPOINTS.COURSES.MY,
      { params }
    );
    return data;
  },

  /** 강의 상세 조회 */
  async getCourse(id: number): Promise<CourseDetailResponse> {
    const { data } = await axiosInstance.get<CourseDetailResponse>(
      API_ENDPOINTS.COURSES.BY_ID(id)
    );
    return data;
  },

  /** 강의 수정 */
  async update(
    id: number,
    request: UpdateCourseRequest
  ): Promise<CourseResponse> {
    const { data } = await axiosInstance.put<CourseResponse>(
      API_ENDPOINTS.COURSES.BY_ID(id),
      request
    );
    return data;
  },

  /** 강의 삭제 */
  async delete(id: number): Promise<void> {
    await axiosInstance.delete(API_ENDPOINTS.COURSES.BY_ID(id));
  },

  // ============================================
  // Course Items (차시)
  // ============================================

  /** 차시 추가 */
  async createItem(
    courseId: number,
    request: CreateItemRequest
  ): Promise<CourseItemResponse> {
    const { data } = await axiosInstance.post<CourseItemResponse>(
      API_ENDPOINTS.COURSES.ITEMS(courseId),
      request
    );
    return data;
  },

  /** 폴더 생성 */
  async createFolder(
    courseId: number,
    request: CreateFolderRequest
  ): Promise<CourseItemResponse> {
    const { data } = await axiosInstance.post<{ data: CourseItemResponse }>(
      API_ENDPOINTS.COURSES.FOLDERS(courseId),
      request
    );
    return data.data;
  },

  /** 계층 구조 조회 */
  async getItemsHierarchy(
    courseId: number
  ): Promise<CourseItemHierarchyResponse[]> {
    const { data } = await axiosInstance.get<CourseItemHierarchyResponse[]>(
      API_ENDPOINTS.COURSES.ITEMS_HIERARCHY(courseId)
    );
    return data;
  },

  /** 순서대로 차시 조회 */
  async getItemsOrdered(courseId: number): Promise<CourseItemResponse[]> {
    const { data } = await axiosInstance.get<CourseItemResponse[]>(
      API_ENDPOINTS.COURSES.ITEMS_ORDERED(courseId)
    );
    return data;
  },

  /** 항목 이동 */
  async moveItem(
    courseId: number,
    request: MoveItemRequest
  ): Promise<CourseItemResponse> {
    const { data } = await axiosInstance.put<CourseItemResponse>(
      API_ENDPOINTS.COURSES.ITEMS_MOVE(courseId),
      request
    );
    return data;
  },

  /** 항목 이름 변경 */
  async updateItemName(
    courseId: number,
    itemId: number,
    request: UpdateItemNameRequest
  ): Promise<CourseItemResponse> {
    const { data } = await axiosInstance.patch<CourseItemResponse>(
      API_ENDPOINTS.COURSES.ITEM_NAME(courseId, itemId),
      request
    );
    return data;
  },

  /** 학습 객체 변경 */
  async updateItemLearningObject(
    courseId: number,
    itemId: number,
    request: UpdateLearningObjectRequest
  ): Promise<CourseItemResponse> {
    const { data } = await axiosInstance.patch<CourseItemResponse>(
      API_ENDPOINTS.COURSES.ITEM_LEARNING_OBJECT(courseId, itemId),
      request
    );
    return data;
  },

  /** 항목 삭제 */
  async deleteItem(courseId: number, itemId: number): Promise<void> {
    await axiosInstance.delete(
      API_ENDPOINTS.COURSES.ITEM_BY_ID(courseId, itemId)
    );
  },
};
