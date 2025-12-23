/**
 * Content Folder API 서비스
 */
import axiosInstance from '@/services/common/api/axiosInstance';
import { API_ENDPOINTS } from '@/services/common/api/endpoints';
import type {
  ContentFolderResponse,
  ContentFolderTreeNode,
  CreateContentFolderRequest,
  UpdateContentFolderRequest,
  MoveContentFolderRequest,
} from '@/types/tu';

export const contentFolderService = {
  // 폴더 생성
  async create(request: CreateContentFolderRequest): Promise<ContentFolderResponse> {
    const { data } = await axiosInstance.post<ContentFolderResponse>(
      API_ENDPOINTS.CONTENT_FOLDERS.BASE,
      request
    );
    return data;
  },

  // 전체 폴더 트리 조회
  async getFolderTree(): Promise<ContentFolderTreeNode[]> {
    const { data } = await axiosInstance.get<ContentFolderTreeNode[]>(
      API_ENDPOINTS.CONTENT_FOLDERS.TREE
    );
    return data;
  },

  // 폴더 상세 조회
  async getFolder(id: number): Promise<ContentFolderResponse> {
    const { data } = await axiosInstance.get<ContentFolderResponse>(
      API_ENDPOINTS.CONTENT_FOLDERS.BY_ID(id)
    );
    return data;
  },

  // 하위 폴더 목록 조회
  async getChildren(id: number): Promise<ContentFolderResponse[]> {
    const { data } = await axiosInstance.get<ContentFolderResponse[]>(
      API_ENDPOINTS.CONTENT_FOLDERS.CHILDREN(id)
    );
    return data;
  },

  // 폴더명 수정
  async update(id: number, request: UpdateContentFolderRequest): Promise<ContentFolderResponse> {
    const { data } = await axiosInstance.put<ContentFolderResponse>(
      API_ENDPOINTS.CONTENT_FOLDERS.BY_ID(id),
      request
    );
    return data;
  },

  // 폴더 이동
  async move(id: number, request: MoveContentFolderRequest): Promise<ContentFolderResponse> {
    const { data } = await axiosInstance.put<ContentFolderResponse>(
      API_ENDPOINTS.CONTENT_FOLDERS.MOVE(id),
      request
    );
    return data;
  },

  // 폴더 삭제
  async delete(id: number): Promise<void> {
    await axiosInstance.delete(API_ENDPOINTS.CONTENT_FOLDERS.BY_ID(id));
  },
};
