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
  UpdateDisplayInfoRequest,
  // CO 워크플로우 타입
  CourseRegistrationStatus,
  CourseRegistrationResponse,
  CourseRegistrationDetailResponse,
  ReadyCourseResponse,
  RegisterCourseRequest,
  UnreadyCourseRequest,
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

// CO 과정 등록 필터 파라미터
export interface CourseRegistrationFilterParams {
  keyword?: string;
  status?: CourseRegistrationStatus;
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
    const { data } = await axiosInstance.post<CourseResponse>(
      API_ENDPOINTS.COURSES.BASE,
      request
    );
    return data;
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

  /** 강의 발행 */
  async publish(id: number): Promise<CourseResponse> {
    const { data } = await axiosInstance.post<CourseResponse>(
      `${API_ENDPOINTS.COURSES.BY_ID(id)}/publish`
    );
    return data;
  },

  /** 강의 발행 취소 */
  async unpublish(id: number): Promise<CourseResponse> {
    const { data } = await axiosInstance.post<CourseResponse>(
      `${API_ENDPOINTS.COURSES.BY_ID(id)}/unpublish`
    );
    return data;
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
    const { data } = await axiosInstance.post<CourseItemResponse>(
      API_ENDPOINTS.COURSES.FOLDERS(courseId),
      request
    );
    return data;
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

  /** 표시 정보 변경 (displayName, description) */
  async updateItemDisplayInfo(
    courseId: number,
    itemId: number,
    request: UpdateDisplayInfoRequest
  ): Promise<CourseItemResponse> {
    const { data } = await axiosInstance.patch<CourseItemResponse>(
      API_ENDPOINTS.COURSES.ITEM_DISPLAY_INFO(courseId, itemId),
      request
    );
    return data;
  },

  // ============================================
  // CO 과정 등록 워크플로우
  // ============================================

  /**
   * 등록된 과정 목록 조회 (CO용)
   * 상태별 필터링 지원 (DRAFT, READY, REGISTERED, REJECTED)
   */
  async getCourseRegistrations(
    params?: CourseRegistrationFilterParams
  ): Promise<PageResponse<CourseRegistrationResponse>> {
    const { data } = await axiosInstance.get<PageResponse<CourseRegistrationResponse>>(
      API_ENDPOINTS.COURSES.BASE,
      { params }
    );
    return data;
  },

  /**
   * 검토 대기(READY) 과정 목록 조회
   */
  async getReadyCourses(
    params?: Omit<CourseRegistrationFilterParams, 'status'>
  ): Promise<PageResponse<ReadyCourseResponse>> {
    const { data } = await axiosInstance.get<PageResponse<ReadyCourseResponse>>(
      API_ENDPOINTS.COURSES.BASE,
      { params: { ...params, status: 'READY' } }
    );
    return data;
  },

  /**
   * 승인된(REGISTERED) 과정 목록 조회
   * 차수 생성 시 선택 가능한 과정 목록
   */
  async getRegisteredCourses(
    params?: Omit<CourseRegistrationFilterParams, 'status'>
  ): Promise<PageResponse<CourseRegistrationResponse>> {
    const { data } = await axiosInstance.get<PageResponse<CourseRegistrationResponse>>(
      API_ENDPOINTS.COURSES.BASE,
      { params: { ...params, status: 'REGISTERED' } }
    );
    return data;
  },

  /**
   * 과정 등록 상세 조회 (CO용)
   */
  async getCourseRegistration(id: number): Promise<CourseRegistrationDetailResponse> {
    const { data } = await axiosInstance.get<CourseRegistrationDetailResponse>(
      API_ENDPOINTS.COURSES.BY_ID(id)
    );
    return data;
  },

  /**
   * 과정 승인 (READY → REGISTERED)
   */
  async register(
    id: number,
    request?: RegisterCourseRequest
  ): Promise<CourseRegistrationResponse> {
    const { data } = await axiosInstance.post<CourseRegistrationResponse>(
      API_ENDPOINTS.COURSES.REGISTER(id),
      request
    );
    return data;
  },

  /**
   * 과정 반려 (READY → REJECTED)
   */
  async unready(
    id: number,
    request: UnreadyCourseRequest
  ): Promise<CourseRegistrationResponse> {
    const { data } = await axiosInstance.post<CourseRegistrationResponse>(
      API_ENDPOINTS.COURSES.UNREADY(id),
      request
    );
    return data;
  },

  // ============================================
  // TU 과정 신청 워크플로우
  // ============================================

  /**
   * 과정 신청 (DRAFT → READY)
   * TU가 과정을 CO에게 검토 요청
   */
  async ready(id: number): Promise<CourseResponse> {
    const { data } = await axiosInstance.post<CourseResponse>(
      API_ENDPOINTS.COURSES.READY(id)
    );
    return data;
  },

  /**
   * 스냅샷 연결
   * 과정에 스냅샷을 연결
   */
  async linkSnapshot(courseId: number, snapshotId: number): Promise<CourseResponse> {
    const { data } = await axiosInstance.post<CourseResponse>(
      `${API_ENDPOINTS.COURSES.BY_ID(courseId)}/snapshots`,
      null,
      { params: { snapshotId } }
    );
    return data;
  },
};
