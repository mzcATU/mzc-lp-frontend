/**
 * LO (Learning Object) 관련 타입 정의
 * 백엔드 API와 매핑되는 타입들
 */

import type { ContentType } from './content.types';

// 학습객체 응답
export interface LearningObjectResponse {
  learningObjectId: number;
  name: string;
  contentId: number;
  contentType: ContentType;
  fileSize: number;
  duration: number | null;
  resolution: string | null;
  folderId: number | null;
  folderName: string | null;
  createdAt: string;
  updatedAt: string;
}

// 학습객체 생성 요청
export interface CreateLearningObjectRequest {
  name: string;
  contentId: number;
  folderId?: number | null;
}

// 학습객체 수정 요청
export interface UpdateLearningObjectRequest {
  name: string;
}

// 학습객체 폴더 이동 요청
export interface MoveFolderRequest {
  folderId: number | null;
}

// 학습객체 필터 파라미터
export interface LearningObjectFilterParams {
  folderId?: number | null;
  keyword?: string;
  page?: number;
  size?: number;
  sort?: string;
}
