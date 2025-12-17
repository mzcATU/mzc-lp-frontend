/**
 * Content (Learning Object) 관련 타입 정의
 */

// LO(Learning Object) 유형
export type LOType = 'video' | 'document' | 'external-link';

// 진도율 완료 기준
export type CompletionCriteria = 'button-click' | '90-percent' | '100-percent';

// 접근 제어 타입
export type AccessControl = 'public' | 'private' | 'specific-tenants';

// 콘텐츠 카테고리
export interface ContentCategory {
  id: string;
  name: string;
}

// LO 데이터 (콘텐츠 등록 폼)
export interface LOData {
  // Step 1: 콘텐츠 정의 및 메타데이터
  title: string;
  description: string;
  loType: LOType | null;
  category?: string;
  tags: string[];
  thumbnailImage?: File;

  // Step 2: 파일 처리
  uploadedFile?: File;
  externalUrl?: string;

  // Step 3: 정책 설정 및 저장
  allowDownload: boolean;
  applyWatermark: boolean;
  completionCriteria: CompletionCriteria;
  accessControl: AccessControl;
  selectedTenants: string[];
}

// 콘텐츠 목록 아이템 타입
export type ContentType = 'assignment' | 'notice' | 'reference';

export interface Content {
  id: string;
  title: string;
  type: ContentType;
  registrationDate: string;
  fileName: string;
  fileSize: string;
  fileType: string;
}

// 테넌트 정보 (B2B 접근 제어용)
export interface Tenant {
  id: string;
  name: string;
}

// LO 유형 카드 정보
export interface LOTypeCard {
  type: LOType;
  icon: React.ElementType;
  title: string;
  description: string;
}
