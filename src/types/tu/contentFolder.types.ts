/**
 * ContentFolder (콘텐츠 폴더) 관련 타입 정의
 * 백엔드 API와 매핑되는 타입들
 */

// 폴더 응답 (백엔드 API 응답과 매핑)
export interface ContentFolderResponse {
  folderId: number;
  folderName: string;
  parentId: number | null;
  depth: number;
  childCount: number;
  itemCount: number;
  children: ContentFolderResponse[] | null;
  createdAt: string;
  updatedAt: string;
}

// 프론트엔드용 폴더 트리 노드 (id로 변환된 버전)
export interface ContentFolderTreeNode {
  id: number;
  folderName: string;
  parentId: number | null;
  depth: number;
  childCount: number;
  itemCount: number;
  children: ContentFolderTreeNode[];
  createdAt: string;
  updatedAt: string;
}

// 폴더 생성 요청
export interface CreateContentFolderRequest {
  folderName: string;
  parentId?: number | null;
}

// 폴더 수정 요청
export interface UpdateContentFolderRequest {
  folderName: string;
}

// 폴더 이동 요청
export interface MoveContentFolderRequest {
  parentId: number | null;
}
