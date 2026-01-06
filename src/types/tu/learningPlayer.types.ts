/**
 * Learning Player 타입 정의
 */

/**
 * 플레이어 콘텐츠 타입
 */
export type PlayerContentType = 'VIDEO' | 'AUDIO' | 'DOCUMENT' | 'IMAGE' | 'EXTERNAL_LINK';

/**
 * 진도 업데이트 요청
 */
export interface UpdateProgressRequest {
  itemId: number;
  progressPercent: number;
  watchedSeconds?: number;
}

/**
 * 아이템 완료 요청
 */
export interface MarkItemCompleteRequest {
  itemId: number;
}

/**
 * 진도 기록 응답
 */
export interface ProgressRecordResponse {
  itemId: number;
  progressPercent: number;
  watchedSeconds: number;
  completed: boolean;
  completedAt: string | null;
}

/**
 * 수강 상세 + 커리큘럼 응답
 */
export interface EnrollmentWithCurriculumResponse {
  enrollmentId: number;
  userId: number;
  courseTimeId: number;
  programId: number;
  programTitle: string;
  courseTimeName: string;
  snapshotId: number;
  status: string;
  enrolledAt: string;
  completedAt: string | null;
  overallProgress: number;
  startDate: string;
  endDate: string;
  progressRecords: ProgressRecordResponse[];
}

/**
 * 플레이어 상태
 */
export interface PlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playedPercent: number;
  loadedPercent: number;
  volume: number;
  muted: boolean;
  playbackRate: number;
}

/**
 * 플레이어 상태 초기값
 */
export const initialPlayerState: PlayerState = {
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  playedPercent: 0,
  loadedPercent: 0,
  volume: 1,
  muted: false,
  playbackRate: 1,
};

/**
 * VideoPlayer 컴포넌트 Props
 */
export interface VideoPlayerProps {
  contentId: number;
  externalUrl?: string | null;
  initialProgress?: number;
  onProgress?: (state: { played: number; playedSeconds: number; loaded: number; loadedSeconds: number }) => void;
  onDuration?: (duration: number) => void;
  onEnded?: () => void;
  onReady?: () => void;
  onError?: (error: Error) => void;
  autoPlay?: boolean;
  /** 학습자 모드 - true일 경우 학습자용 스트리밍 API 사용 */
  isLearnerMode?: boolean;
}

/**
 * CurriculumSidebar 컴포넌트 Props
 */
export interface CurriculumSidebarProps {
  snapshotId: number;
  currentItemId: number | null;
  progressRecords: ProgressRecordResponse[];
  onItemSelect: (itemId: number, contentId: number, contentType: PlayerContentType) => void;
}

/**
 * 완료 기준 상수
 */
export const COMPLETION_THRESHOLD = 0.8; // 80%

/**
 * 자동 저장 간격 (ms)
 */
export const AUTO_SAVE_INTERVAL = 30000; // 30초

/**
 * 플레이어용 Enrollment 데이터
 * - Enrollment + CourseTime + Program 조합
 */
export interface EnrollmentPlayerData {
  enrollmentId: number;
  userId: number;
  courseTimeId: number;
  courseTimeName: string;
  programId: number;
  programTitle: string;
  snapshotId: number;
  status: string;
  progressPercent: number;
  enrolledAt: string;
  completedAt: string | null;
  classStartDate: string;
  classEndDate: string;
}
