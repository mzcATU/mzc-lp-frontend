/**
 * Course 관련 타입 정의 (Tenant Operator)
 *
 * 백엔드 정렬 타입은 common/course.types.ts 에서 관리됩니다.
 * 아래는 UI/폼 전용 타입들입니다.
 */

// ============================================
// Re-export from common (백엔드 정렬 타입)
// ============================================
export type {
  CourseLevel,
  CourseType,
  CourseResponse,
  CourseDetailResponse,
  CourseItemResponse,
  CreateCourseRequest,
  UpdateCourseRequest,
} from '../common/course.types';

import type { CourseLevel, CourseType } from '../common/course.types';
import type { CurriculumItem } from '../tu/curriculum.types';

export {
  COURSE_LEVEL_LABELS,
  COURSE_TYPE_LABELS,
} from '../common/course.types';

// ============================================
// UI/Form Types (프론트엔드 전용)
// ============================================

/** 콘텐츠 첨부 타입 */
export interface ContentAttachment {
  id: string;
  type: 'upload' | 'link' | 'existing';
  name: string;
  url: string;
  contentId?: number;
  contentType?: string;
  status?: 'pending' | 'uploading' | 'completed' | 'error';
  uploadProgress?: number;
  /** 강의 내 표시용 이름 (CourseItem.displayName) */
  displayName?: string;
  /** 강의 내 표시용 설명 (CourseItem.description) */
  description?: string;
}

/**
 * 회차(레슨) 데이터 타입
 * @deprecated types/tu/curriculum.types.ts의 CurriculumItem 사용 권장
 */
export interface LessonData {
  id: string;
  order: number;
  title: string;
  description: string;
  contents: ContentAttachment[];
}

// ============================================
// Curriculum Tree Types - Re-export from tu
// ============================================
// 새 타입은 types/tu/curriculum.types.ts에서 관리됩니다.
export type {
  CurriculumItemType,
  CurriculumFolderItem,
  CurriculumContentItem,
  CurriculumItem,
  CurriculumFormData,
} from '../tu/curriculum.types';

export {
  isCurriculumFolder,
  isCurriculumContent,
  createFolderItem,
  createContentItem,
  findItemInTree,
  findParentInTree,
} from '../tu/curriculum.types';

/**
 * 강의 난이도 (UI 전용)
 * @deprecated common/course.types.ts의 CourseLevel 사용 권장
 */
export type CourseDifficulty = 'beginner' | 'elementary' | 'intermediate' | 'advanced' | '';

/**
 * 강의 표시 상태 (UI 전용)
 * @deprecated Course.status 필드에 사용되던 UI 전용 타입. 향후 제거 예정.
 */
export type CourseDisplayStatus = 'active' | 'completed' | 'draft';

/** 다국어 버전 타입 */
export interface LanguageVersion {
  code: string;
  name: string;
  courseName: string;
  courseDescription: string;
}

/** 다국어 설정 타입 */
export interface MultiLanguageSettings {
  enabled: boolean;
  languages: LanguageVersion[];
}

/**
 * 강의 폼 데이터 (UI 전용)
 * 백엔드 CreateCourseRequest와 필드명 일치
 */
export interface CourseFormData {
  title: string;
  description: string;
  /** 썸네일 이미지 URL */
  thumbnailUrl?: string;
  categoryId: number | null;
  tags: string[];
  level: CourseLevel | '';
  type: CourseType | '';
  /** @deprecated curriculumItems 사용 권장 */
  lessons: LessonData[];
  /** 커리큘럼 트리 구조 (폴더/콘텐츠 계층) */
  curriculumItems: CurriculumItem[];
  isDraft: boolean;
  lastSaved?: string;
  multiLanguage: MultiLanguageSettings;
}

/**
 * 강의 목록 아이템 (UI 전용)
 * @deprecated CourseResponse 사용 권장
 */
export interface Course {
  id: string;
  title: string;
  instructor: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  thumbnail: string;
  category: string;
  deadline?: string;
  lastAccessed?: string;
  students?: number;
  status?: CourseDisplayStatus;
}

// ============================================
// UI Utility Types
// ============================================

/** 카테고리 색상 타입 */
export interface CategoryColor {
  bg: string;
  text: string;
}

/** 카테고리 색상 맵 */
export type CategoryColorsMap = Record<string, CategoryColor>;
