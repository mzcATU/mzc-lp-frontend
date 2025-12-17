/**
 * Course 관련 타입 정의
 */

// 콘텐츠 첨부 타입
export interface ContentAttachment {
  id: string;
  type: 'upload' | 'link';
  name: string;
  url: string;
}

// 회차(레슨) 데이터 타입
export interface LessonData {
  id: string;
  order: number;
  title: string;
  description: string;
  contents: ContentAttachment[];
}

// 강의 난이도
export type CourseDifficulty = 'beginner' | 'elementary' | 'intermediate' | 'advanced' | '';

// 강의 상태
export type CourseStatus = 'active' | 'completed' | 'draft';

// 강의 폼 데이터
export interface CourseFormData {
  courseName: string;
  courseDescription: string;
  startDate: string;
  endDate: string;
  category: string;
  tags: string[];
  difficulty: CourseDifficulty;
  lessons: LessonData[];
  isDraft: boolean;
  lastSaved?: string;
}

// 강의 목록 아이템
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
  status?: CourseStatus;
}

// 카테고리 색상 타입
export interface CategoryColor {
  bg: string;
  text: string;
}

// 카테고리 색상 맵
export type CategoryColorsMap = Record<string, CategoryColor>;
