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

// 백엔드 응답(folderId)을 프론트엔드 형식(id)으로 변환
function transformToTreeNode(folder: ContentFolderResponse): ContentFolderTreeNode {
  return {
    id: folder.folderId,
    folderName: folder.folderName,
    parentId: folder.parentId,
    depth: folder.depth,
    childCount: folder.childCount,
    itemCount: folder.itemCount,
    children: folder.children ? folder.children.map(transformToTreeNode) : [],
    createdAt: folder.createdAt,
    updatedAt: folder.updatedAt,
  };
}

export const contentFolderService = {
  // 폴더 생성
  async create(request: CreateContentFolderRequest): Promise<ContentFolderTreeNode> {
    const { data } = await axiosInstance.post<{ data: ContentFolderResponse }>(
      API_ENDPOINTS.CONTENT_FOLDERS.BASE,
      request
    );
    return transformToTreeNode(data.data);
  },

  // 전체 폴더 트리 조회
  async getFolderTree(): Promise<ContentFolderTreeNode[]> {
    const { data } = await axiosInstance.get<{ data: ContentFolderResponse[] }>(
      API_ENDPOINTS.CONTENT_FOLDERS.TREE
    );
    return (data.data ?? []).map(transformToTreeNode);
  },

  // 폴더 상세 조회
  async getFolder(id: number): Promise<ContentFolderTreeNode> {
    const { data } = await axiosInstance.get<{ data: ContentFolderResponse }>(
      API_ENDPOINTS.CONTENT_FOLDERS.BY_ID(id)
    );
    return transformToTreeNode(data.data);
  },

  // 하위 폴더 목록 조회
  async getChildren(id: number): Promise<ContentFolderTreeNode[]> {
    const { data } = await axiosInstance.get<{ data: ContentFolderResponse[] }>(
      API_ENDPOINTS.CONTENT_FOLDERS.CHILDREN(id)
    );
    return (data.data ?? []).map(transformToTreeNode);
  },

  // 폴더명 수정
  async update(id: number, request: UpdateContentFolderRequest): Promise<ContentFolderTreeNode> {
    const { data } = await axiosInstance.put<{ data: ContentFolderResponse }>(
      API_ENDPOINTS.CONTENT_FOLDERS.BY_ID(id),
      request
    );
    return transformToTreeNode(data.data);
  },

  // 폴더 이동
  async move(id: number, request: MoveContentFolderRequest): Promise<ContentFolderTreeNode> {
    const { data } = await axiosInstance.put<{ data: ContentFolderResponse }>(
      API_ENDPOINTS.CONTENT_FOLDERS.MOVE(id),
      request
    );
    return transformToTreeNode(data.data);
  },

  // 폴더 삭제
  async delete(id: number): Promise<void> {
    await axiosInstance.delete(API_ENDPOINTS.CONTENT_FOLDERS.BY_ID(id));
  },
};
