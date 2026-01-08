/**
 * 커리큘럼 트리 구조 타입 정의 (Tenant User - 강의 생성/편집)
 *
 * 백엔드 CourseItem 계층구조와 매핑됨
 * - 폴더: learningObjectId가 null인 CourseItem
 * - 콘텐츠: learningObjectId가 있는 CourseItem
 */

import type { CourseItemHierarchyResponse } from '@/types/common/course.types';

// ============================================
// Curriculum Tree Types (계층구조 지원)
// ============================================

/** 커리큘럼 항목 타입 */
export type CurriculumItemType = 'folder' | 'content';

/** 커리큘럼 항목 기본 인터페이스 */
interface CurriculumItemBase {
  /** 프론트엔드 임시 ID */
  id: string;
  /** 항목 이름 (폴더명 또는 차시명) */
  name: string;
  /** 항목 타입 */
  type: CurriculumItemType;
  /** 계층 깊이 (0부터 시작) */
  depth: number;
  /** 같은 레벨 내 정렬 순서 */
  order: number;
  /** 확장 상태 (UI용) */
  isExpanded?: boolean;
}

/** 폴더 타입 커리큘럼 항목 */
export interface CurriculumFolderItem extends CurriculumItemBase {
  type: 'folder';
  /** 하위 항목 목록 */
  children: CurriculumItem[];
}

/** 콘텐츠(LO) 타입 커리큘럼 항목 */
export interface CurriculumContentItem extends CurriculumItemBase {
  type: 'content';
  /** 콘텐츠 ID (백엔드에서 LO 자동 생성) */
  contentId: number;
  /** 원본 파일명 */
  originalFileName: string;
  /** 콘텐츠 타입 */
  contentType: string;
  /** 강의 내 표시용 이름 (선택적 오버라이드) */
  displayName?: string;
  /** 강의 내 표시용 설명 (선택적 오버라이드) */
  description?: string;
}

/** 커리큘럼 항목 (폴더 또는 콘텐츠) */
export type CurriculumItem = CurriculumFolderItem | CurriculumContentItem;

/** 커리큘럼 항목 타입 가드 */
export function isCurriculumFolder(item: CurriculumItem): item is CurriculumFolderItem {
  return item.type === 'folder';
}

export function isCurriculumContent(item: CurriculumItem): item is CurriculumContentItem {
  return item.type === 'content';
}

// ============================================
// Curriculum Form Types
// ============================================

/** 커리큘럼 편집용 폼 데이터 */
export interface CurriculumFormData {
  /** 루트 레벨 항목들 */
  items: CurriculumItem[];
}

// ============================================
// Utility Functions
// ============================================

/** 새 폴더 항목 생성 */
export function createFolderItem(
  name: string,
  depth: number = 0,
  order: number = 0
): CurriculumFolderItem {
  return {
    id: `folder-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name,
    type: 'folder',
    depth,
    order,
    isExpanded: true,
    children: [],
  };
}

/** 새 콘텐츠 항목 생성 */
export function createContentItem(
  contentId: number,
  originalFileName: string,
  contentType: string,
  depth: number = 0,
  order: number = 0
): CurriculumContentItem {
  return {
    id: `content-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: originalFileName,
    type: 'content',
    depth,
    order,
    contentId,
    originalFileName,
    contentType,
  };
}

/** 트리에서 항목 찾기 (재귀) */
export function findItemInTree(
  items: CurriculumItem[],
  itemId: string
): CurriculumItem | null {
  for (const item of items) {
    if (item.id === itemId) {
      return item;
    }
    if (isCurriculumFolder(item)) {
      const found = findItemInTree(item.children, itemId);
      if (found) return found;
    }
  }
  return null;
}

/** 트리에서 항목의 부모 찾기 (재귀) */
export function findParentInTree(
  items: CurriculumItem[],
  itemId: string,
  parent: CurriculumFolderItem | null = null
): CurriculumFolderItem | null {
  for (const item of items) {
    if (item.id === itemId) {
      return parent;
    }
    if (isCurriculumFolder(item)) {
      const found = findParentInTree(item.children, itemId, item);
      if (found !== undefined) return found;
    }
  }
  return null;
}

// ============================================
// Conversion Functions (백엔드 ↔ 프론트엔드)
// ============================================

/** 백엔드 계층 응답을 프론트엔드 CurriculumItem으로 변환 */
export function convertHierarchyToCurriculumItems(
  items: CourseItemHierarchyResponse[],
  depth: number = 0
): CurriculumItem[] {
  return items.map((item, index): CurriculumItem => {
    if (item.isFolder) {
      return {
        id: `folder-${item.itemId}`,
        name: item.itemName,
        type: 'folder',
        depth,
        order: index,
        isExpanded: true,
        children: convertHierarchyToCurriculumItems(item.children, depth + 1),
      };
    } else {
      return {
        id: `content-${item.itemId}`,
        name: item.itemName,
        type: 'content',
        depth,
        order: index,
        contentId: item.learningObjectId!,
        originalFileName: item.itemName,
        contentType: '',
        displayName: item.displayName ?? undefined,
        description: item.description ?? undefined,
      };
    }
  });
}
