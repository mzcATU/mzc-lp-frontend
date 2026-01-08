/**
 * LO (Learning Object) API 서비스
 */
import axiosInstance from '@/services/common/api/axiosInstance';
import { API_ENDPOINTS } from '@/services/common/api/endpoints';
import type {
  LearningObjectResponse,
  CreateLearningObjectRequest,
  UpdateLearningObjectRequest,
  MoveFolderRequest,
  LearningObjectFilterParams,
} from '@/types/tu';

// Spring Page 응답 타입
interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export const learningObjectService = {
  // 학습객체 생성
  async create(request: CreateLearningObjectRequest): Promise<LearningObjectResponse> {
    const { data } = await axiosInstance.post<LearningObjectResponse>(
      API_ENDPOINTS.LEARNING_OBJECTS.BASE,
      request
    );
    return data;
  },

  // 학습객체 목록 조회
  async getLearningObjects(
    params?: LearningObjectFilterParams
  ): Promise<PageResponse<LearningObjectResponse>> {
    const { data } = await axiosInstance.get<PageResponse<LearningObjectResponse>>(
      API_ENDPOINTS.LEARNING_OBJECTS.BASE,
      { params }
    );
    return data;
  },

  // 학습객체 상세 조회
  async getLearningObject(id: number): Promise<LearningObjectResponse> {
    const { data } = await axiosInstance.get<LearningObjectResponse>(
      API_ENDPOINTS.LEARNING_OBJECTS.BY_ID(id)
    );
    return data;
  },

  // Content ID로 학습객체 조회
  async getLearningObjectByContentId(contentId: number): Promise<LearningObjectResponse> {
    const { data } = await axiosInstance.get<LearningObjectResponse>(
      API_ENDPOINTS.LEARNING_OBJECTS.BY_CONTENT_ID(contentId)
    );
    return data;
  },

  // 학습객체 수정
  async update(id: number, request: UpdateLearningObjectRequest): Promise<LearningObjectResponse> {
    const { data } = await axiosInstance.put<LearningObjectResponse>(
      API_ENDPOINTS.LEARNING_OBJECTS.BY_ID(id),
      request
    );
    return data;
  },

  // 학습객체 폴더 이동
  async moveToFolder(id: number, request: MoveFolderRequest): Promise<LearningObjectResponse> {
    const { data } = await axiosInstance.put<LearningObjectResponse>(
      API_ENDPOINTS.LEARNING_OBJECTS.FOLDER(id),
      request
    );
    return data;
  },

  // 학습객체 삭제
  async delete(id: number): Promise<void> {
    await axiosInstance.delete(API_ENDPOINTS.LEARNING_OBJECTS.BY_ID(id));
  },
};
