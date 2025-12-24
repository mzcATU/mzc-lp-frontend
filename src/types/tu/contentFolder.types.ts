/**
 * ContentFolder (콘텐츠 폴더) 관련 타입 정의
 * 백엔드 API와 매핑되는 타입들
 */

// 폴더 응답
export interface ContentFolderResponse {
  id: number;
  folderName: string;
  parentId: number | null;
  depth: number;
  childCount: number;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
}

// 폴더 트리 노드 (children 포함)
export interface ContentFolderTreeNode extends ContentFolderResponse {
  children: ContentFolderTreeNode[];
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
