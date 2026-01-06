/**
 * LearningPlayerPage
 * 학습 플레이어 메인 페이지
 */
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Loader2,
  BookOpen,
  Menu,
  X,
  AlertTriangle,
} from 'lucide-react';
import { Button, Badge } from '@/components/common';
import { useTranslation } from '@/store/common/languageStore';
import { useThemeStore } from '@/store/common/themeStore';
import { useQuery } from '@tanstack/react-query';
import {
  useEnrollmentForPlayer,
  useUpdateProgress,
  useMarkItemComplete,
} from '@/hooks/tu';
import axiosInstance from '@/services/common/api/axiosInstance';
import { API_ENDPOINTS } from '@/services/common/api/endpoints';
import { VideoPlayer, CurriculumSidebar, DocumentViewer, ExternalLinkViewer } from './components';
import {
  COMPLETION_THRESHOLD,
  AUTO_SAVE_INTERVAL,
  type PlayerContentType,
  type ProgressRecordResponse,
} from '@/types/tu';
import type { SnapshotItemResponse, SnapshotRelationsResponse } from '@/types/common/snapshot.types';

// API 응답 타입
interface ApiResponse<T> {
  success: boolean;
  data: T;
}

// itemType을 PlayerContentType으로 매핑
const mapItemTypeToContentType = (itemType: string | null | undefined): PlayerContentType => {
  if (!itemType) return 'VIDEO';
  const typeMap: Record<string, PlayerContentType> = {
    VIDEO: 'VIDEO',
    AUDIO: 'VIDEO',
    DOCUMENT: 'DOCUMENT',
    IMAGE: 'DOCUMENT',
    EXTERNAL_LINK: 'EXTERNAL_LINK',
  };
  return typeMap[itemType.toUpperCase()] || 'VIDEO';
};

// ============================================
// Demo Mode Mock Data
// ============================================
const DEMO_ENROLLMENT = {
  enrollmentId: 0,
  programId: 1,
  programTitle: '[데모] React 기초 강의',
  timeId: 1,
  snapshotId: 999,
  startDate: '2024-01-01',
  endDate: '2024-12-31',
  progressRate: 30,
  status: 'IN_PROGRESS' as const,
  enrolledAt: '2024-01-15T10:00:00Z',
};

// 데모 비디오 URL 목록 (Google 샘플 비디오)
const DEMO_VIDEO_URLS: Record<number, string> = {
  1: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  2: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  3: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  4: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  5: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
};

const DEMO_CURRICULUM_ITEMS = [
  { itemId: 1, itemName: '1. React란 무엇인가?', contentId: 1, contentType: 'VIDEO' as PlayerContentType, duration: 600 },
  { itemId: 2, itemName: '2. JSX 문법 이해하기', contentId: 2, contentType: 'VIDEO' as PlayerContentType, duration: 900 },
  { itemId: 3, itemName: '3. 컴포넌트와 Props', contentId: 3, contentType: 'VIDEO' as PlayerContentType, duration: 1200 },
  { itemId: 4, itemName: '4. State 관리하기', contentId: 4, contentType: 'VIDEO' as PlayerContentType, duration: 1500 },
  { itemId: 5, itemName: '5. useEffect 훅 활용', contentId: 5, contentType: 'VIDEO' as PlayerContentType, duration: 1100 },
];

export function LearningPlayerPage() {
  const { enrollmentId, itemId } = useParams<{ enrollmentId: string; itemId?: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  // 데모 모드 확인 (URL이 /demo 이거나 ?demo=true)
  const isDemoMode = enrollmentId === 'demo' || searchParams.get('demo') === 'true';

  // 상태
  const [currentItemId, setCurrentItemId] = useState<number | null>(itemId ? Number(itemId) : null);
  const [currentContentId, setCurrentContentId] = useState<number | null>(null);
  const [currentContentType, setCurrentContentType] = useState<PlayerContentType>('VIDEO');
  const [playedPercent, setPlayedPercent] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [lastSaveTime, setLastSaveTime] = useState(Date.now());
  const [showDemoBanner, setShowDemoBanner] = useState(true);

  // Refs
  const saveIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Queries & Mutations (데모 모드에서는 비활성화)
  const { data: playerData, isLoading, isError } = useEnrollmentForPlayer(
    isDemoMode ? 0 : Number(enrollmentId),
    { enabled: !isDemoMode }
  );
  const updateProgress = useUpdateProgress();
  const markItemComplete = useMarkItemComplete();

  // 데모 모드 또는 API 데이터 사용
  const enrollment = isDemoMode ? DEMO_ENROLLMENT : playerData ? {
    enrollmentId: playerData.enrollmentId,
    programId: playerData.programId,
    programTitle: playerData.programTitle,
    timeId: playerData.courseTimeId,
    snapshotId: playerData.snapshotId,
    startDate: playerData.classStartDate,
    endDate: playerData.classEndDate,
    progressRate: playerData.progressPercent,
    status: playerData.status,
    enrolledAt: playerData.enrolledAt,
  } : null;

  // Mock 진도 기록 (실제로는 API에서 가져와야 함)
  const [progressRecords, setProgressRecords] = useState<ProgressRecordResponse[]>([]);

  // snapshotId (데모 모드에서는 mock 사용, 실제 모드에서는 playerData에서 가져옴)
  const snapshotId = isDemoMode ? 999 : (enrollment?.snapshotId ?? 0);

  // 스냅샷 아이템 조회 (실제 모드에서만)
  const { data: snapshotItems } = useQuery({
    queryKey: ['snapshot', 'items', snapshotId],
    queryFn: async () => {
      const response = await axiosInstance.get<ApiResponse<SnapshotItemResponse[]>>(
        API_ENDPOINTS.SNAPSHOTS.ITEMS(snapshotId)
      );
      return response.data.data;
    },
    enabled: !isDemoMode && snapshotId > 0,
  });

  // 스냅샷 관계(순서) 조회 (실제 모드에서만)
  const { data: relationsData } = useQuery({
    queryKey: ['snapshot', 'relations', 'ordered', snapshotId],
    queryFn: async () => {
      const response = await axiosInstance.get<ApiResponse<SnapshotRelationsResponse>>(
        API_ENDPOINTS.SNAPSHOTS.RELATIONS_ORDERED(snapshotId)
      );
      return response.data.data;
    },
    enabled: !isDemoMode && snapshotId > 0,
  });

  // 데모 커리큘럼 아이템 (사이드바용)
  const demoCurriculumItems = useMemo(() => DEMO_CURRICULUM_ITEMS, []);

  // 순서가 있는 커리큘럼 아이템 목록 (실제 API 또는 데모)
  interface OrderedCurriculumItem {
    itemId: number;
    itemName: string;
    contentId: number;
    contentType: PlayerContentType;
    seq: number;
  }

  const orderedCurriculumItems = useMemo((): OrderedCurriculumItem[] => {
    // 데모 모드
    if (isDemoMode) {
      return demoCurriculumItems.map((item, index) => ({
        ...item,
        seq: index + 1,
      }));
    }

    // 실제 모드 - API 데이터
    if (!snapshotItems) return [];

    // 아이템을 평탄화하면서 콘텐츠만 추출
    const flatItems: OrderedCurriculumItem[] = [];
    let seq = 1;

    const flattenItems = (items: SnapshotItemResponse[]) => {
      items.forEach((item) => {
        // 폴더가 아니고 contentId가 있는 경우만 추가
        if (!item.isFolder && item.snapshotLearningObject?.contentId) {
          // displayName이 있으면 우선 사용, 없으면 itemName(파일명) 사용
          const displayName = item.snapshotLearningObject.displayName || item.itemName;
          flatItems.push({
            itemId: item.itemId,
            itemName: displayName,
            contentId: item.snapshotLearningObject.contentId,
            contentType: mapItemTypeToContentType(item.itemType),
            seq: seq++,
          });
        }
        if (item.children && item.children.length > 0) {
          flattenItems(item.children);
        }
      });
    };
    flattenItems(snapshotItems);

    // relationsData가 있으면 순서대로, 없으면 평탄화된 순서대로 반환
    if (relationsData?.orderedItems && relationsData.orderedItems.length > 0) {
      const itemsMap = new Map<number, OrderedCurriculumItem>();
      flatItems.forEach(item => itemsMap.set(item.itemId, item));

      return relationsData.orderedItems
        .map((orderedItem) => {
          const item = itemsMap.get(orderedItem.itemId);
          if (!item) return null;
          return { ...item, seq: orderedItem.seq };
        })
        .filter((item): item is OrderedCurriculumItem => item !== null);
    }

    return flatItems;
  }, [isDemoMode, demoCurriculumItems, snapshotItems, relationsData]);

  // 현재 아이템 인덱스 및 이전/다음 아이템 계산
  const { hasPrevious, hasNext, previousItem, nextItem } = useMemo(() => {
    const items = orderedCurriculumItems;
    const index = items.findIndex((item) => item.itemId === currentItemId);
    return {
      currentIndex: index,
      hasPrevious: index > 0,
      hasNext: index >= 0 && index < items.length - 1,
      previousItem: index > 0 ? items[index - 1] : null,
      nextItem: index >= 0 && index < items.length - 1 ? items[index + 1] : null,
    };
  }, [orderedCurriculumItems, currentItemId]);

  // 첫 번째 아이템 자동 선택 (데모/실제 공통)
  useEffect(() => {
    if (!currentContentId && orderedCurriculumItems.length > 0) {
      const targetItemId = itemId ? Number(itemId) : orderedCurriculumItems[0].itemId;
      const targetItem = orderedCurriculumItems.find(item => item.itemId === targetItemId) || orderedCurriculumItems[0];

      setCurrentItemId(targetItem.itemId);
      setCurrentContentId(targetItem.contentId);
      setCurrentContentType(targetItem.contentType);
    }
  }, [currentContentId, orderedCurriculumItems, itemId]);

  // 진도 저장 (임시 비활성화)
  const saveProgress = useCallback(async () => {
    // TODO: 테스트 후 다시 활성화
    console.log('[LearningPlayer] saveProgress disabled for testing');
    return;

    // if (!currentItemId || playedPercent <= 0) return;

    // // 데모 모드에서는 로컬만 업데이트
    // if (isDemoMode) {
    //   setLastSaveTime(Date.now());
    //   return;
    // }

    // if (!enrollmentId) return;

    // try {
    //   await updateProgress.mutateAsync({
    //     enrollmentId: Number(enrollmentId),
    //     request: {
    //       itemId: currentItemId,
    //       progressPercent: Math.round(playedPercent * 100),
    //     },
    //   });
    //   setLastSaveTime(Date.now());
    // } catch (error) {
    //   console.error('Failed to save progress:', error);
    // }
  }, []);

  // 차시 완료 처리 (현재 로컬에서만 처리 - 백엔드 API 추가 후 연동 필요)
  const handleComplete = useCallback(() => {
    if (!currentItemId || isCompleted) return;

    // 로컬 진도 기록 업데이트
    setIsCompleted(true);
    setProgressRecords((prev) => {
      const existing = prev.find((r) => r.itemId === currentItemId);
      if (existing) {
        return prev.map((r) =>
          r.itemId === currentItemId
            ? { ...r, completed: true, progressPercent: 100, completedAt: new Date().toISOString() }
            : r
        );
      }
      return [
        ...prev,
        {
          itemId: currentItemId,
          progressPercent: 100,
          watchedSeconds: 0,
          completed: true,
          completedAt: new Date().toISOString(),
        },
      ];
    });

    console.log('[LearningPlayer] Item marked as complete (local only):', currentItemId);

    // TODO: 백엔드에 markItemComplete API 추가 후 아래 코드 활성화
    // if (!isDemoMode && enrollmentId) {
    //   markItemComplete.mutateAsync({
    //     enrollmentId: Number(enrollmentId),
    //     itemId: currentItemId,
    //   });
    // }
  }, [currentItemId, isCompleted]);

  // 비디오 진도 핸들러 (임시 비활성화)
  const handleVideoProgress = useCallback((state: { played: number }) => {
    // TODO: 테스트 후 다시 활성화
    // setPlayedPercent(state.played);

    // // 80% 완료 감지 - 단, markItemComplete API가 없으므로 로컬만 업데이트
    // if (state.played >= COMPLETION_THRESHOLD && !isCompleted) {
    //   // TODO: 백엔드에 차시 완료 API 추가 후 활성화
    //   // handleComplete();
    //   setIsCompleted(true);
    //   console.log('[LearningPlayer] Item completed (local only)');
    // }
  }, []);

  // 자동 저장 설정
  useEffect(() => {
    saveIntervalRef.current = setInterval(() => {
      if (playedPercent > 0) {
        saveProgress();
      }
    }, AUTO_SAVE_INTERVAL);

    return () => {
      if (saveIntervalRef.current) {
        clearInterval(saveIntervalRef.current);
      }
      // 언마운트 시 저장
      saveProgress();
    };
  }, [playedPercent, saveProgress]);

  // 아이템 선택 핸들러
  const handleItemSelect = useCallback((itemId: number, contentId: number, contentType: PlayerContentType) => {
    // 현재 진도 저장
    saveProgress();

    // 새 아이템으로 이동
    setCurrentItemId(itemId);
    setCurrentContentId(contentId);
    setCurrentContentType(contentType);
    setPlayedPercent(0);
    setIsCompleted(progressRecords.some((r) => r.itemId === itemId && r.completed));

    // URL 업데이트
    const basePath = isDemoMode ? '/tu/b2c/mypage/learning/demo/player' : `/mypage/learning/${enrollmentId}/player`;
    navigate(`${basePath}/${itemId}`, { replace: true });
  }, [enrollmentId, navigate, progressRecords, saveProgress, isDemoMode]);

  // 뒤로가기
  const handleBack = useCallback(() => {
    saveProgress();
    if (isDemoMode) {
      navigate('/tu/b2c/mypage/learning');
    } else {
      navigate(`/tu/b2c/mypage/learning/${enrollmentId}`);
    }
  }, [enrollmentId, navigate, saveProgress, isDemoMode]);

  // 이전 아이템으로 이동
  const handlePrevious = useCallback(() => {
    if (!previousItem) return;
    handleItemSelect(previousItem.itemId, previousItem.contentId, previousItem.contentType);
  }, [previousItem, handleItemSelect]);

  // 다음 아이템으로 이동
  const handleNext = useCallback(() => {
    if (!nextItem) return;
    handleItemSelect(nextItem.itemId, nextItem.contentId, nextItem.contentType);
  }, [nextItem, handleItemSelect]);

  // 로딩 상태 (데모 모드에서는 스킵)
  if (!isDemoMode && isLoading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${isDark ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
        <Loader2 className={`w-8 h-8 animate-spin ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
      </div>
    );
  }

  // 에러 상태 (데모 모드에서는 스킵)
  if (!isDemoMode && (isError || !enrollment)) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-screen ${isDark ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
        <BookOpen className={`w-16 h-16 mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
        <h3 className={`text-lg font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {t.learning.enrollmentNotFound}
        </h3>
        <Button onClick={() => navigate('/tu/b2c/mypage/learning')}>
          {t.learning.backToLearning}
        </Button>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-screen ${isDark ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
      {/* 데모 모드 배너 */}
      {isDemoMode && showDemoBanner && (
        <div className="flex items-center justify-center gap-2 px-4 py-2 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200 relative">
          <AlertTriangle className="w-4 h-4" />
          <span className="text-sm font-medium">
            {t.player.demoModeBanner}
          </span>
          <button
            onClick={() => setShowDemoBanner(false)}
            className="absolute right-3 p-1 rounded hover:bg-amber-200 dark:hover:bg-amber-800/50 transition-colors"
            aria-label="배너 닫기"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 헤더 */}
      <header
        className={`flex items-center px-4 py-3 border-b shrink-0 ${
          isDark ? 'bg-[#1e1e1e] border-white/10' : 'bg-[#f7f9fa] border-gray-200'
        }`}
      >
        <div className="flex items-center gap-4 min-w-0">
          <Button variant="ghost" size="sm" onClick={handleBack} className={`gap-1 shrink-0 px-1 ${isDark ? 'hover:bg-white/10 text-gray-300 hover:text-gray-300' : ''}`}>
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{t.player.backToCourse}</span>
          </Button>
          <div className={`h-6 w-px shrink-0 ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />
          <h1 className={`text-sm sm:text-base font-semibold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {enrollment?.programTitle ?? t.player.defaultTitle}
          </h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {isCompleted && (
            <Badge variant="green" className="gap-1">
              <CheckCircle className="w-3 h-3" />
              {t.player.completed}
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 비디오 영역 */}
        <main className={`flex-1 flex flex-col overflow-hidden ${sidebarOpen ? 'lg:mr-80' : ''}`}>
          {/* 비디오 플레이어 영역 */}
          <div className="shrink-0 bg-black">
              {/* 비디오 플레이어 */}
              {currentContentId && currentContentType === 'VIDEO' && (
                <VideoPlayer
                  contentId={currentContentId}
                  externalUrl={isDemoMode ? DEMO_VIDEO_URLS[currentContentId] : undefined}
                  initialProgress={
                    progressRecords.find((r) => r.itemId === currentItemId)?.progressPercent
                      ? (progressRecords.find((r) => r.itemId === currentItemId)?.progressPercent || 0) / 100
                      : 0
                  }
                  onProgress={handleVideoProgress}
                  isLearnerMode={!isDemoMode}
                />
              )}

              {/* 문서 뷰어 */}
              {currentContentId && currentContentType === 'DOCUMENT' && (
                <DocumentViewer
                  contentId={currentContentId}
                  onComplete={handleComplete}
                />
              )}

              {/* 외부 링크 뷰어 */}
              {currentContentId && currentContentType === 'EXTERNAL_LINK' && (
                <ExternalLinkViewer
                  url={`https://example.com/content/${currentContentId}`}
                  onComplete={handleComplete}
                />
              )}

              {/* 콘텐츠가 없는 경우 */}
              {!currentContentId && (
                <div
                  className={`aspect-video flex flex-col items-center justify-center ${
                    isDark ? 'bg-white/5' : 'bg-gray-100'
                  }`}
                >
                  <BookOpen className={`w-16 h-16 mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                  <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                    {t.player.selectContent}
                  </p>
                </div>
              )}
          </div>

          {/* 콘텐츠 정보 영역 */}
          <div className={`flex-1 px-4 py-3 overflow-y-auto ${isDark ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
              {/* 현재 학습 콘텐츠 제목 */}
              {currentItemId && (
                <div className={`rounded-lg p-3 mb-2 ${isDark ? 'bg-[#2a2a2a] border border-white/10' : 'bg-[#ffffff] border border-gray-200'}`}>
                  <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {orderedCurriculumItems.find(item => item.itemId === currentItemId)?.itemName || '콘텐츠'}
                  </h2>
                  {isCompleted && (
                    <div className="flex items-center gap-2 mt-2 text-green-500">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">학습 완료</span>
                    </div>
                  )}
                </div>
              )}

              {/* 자동 저장 표시 */}
              <div className="flex items-center justify-between">
                <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  {t.player.autoSaved}: {new Date(lastSaveTime).toLocaleTimeString()}
                </span>
              </div>
          </div>

          {/* 하단 네비게이션 */}
          <footer
            className={`flex items-center justify-between px-4 py-3 border-t shrink-0 ${
              isDark ? 'bg-[#1e1e1e] border-white/10' : 'bg-[#f7f9fa] border-gray-200'
            }`}
          >
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevious}
              disabled={!hasPrevious}
              className={`gap-1 sm:gap-2 ${isDark ? 'bg-transparent border-white/15 text-gray-300 hover:bg-white/5 hover:text-gray-200' : ''}`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">{t.player.previous}</span>
            </Button>

            {!isCompleted && (
              <button
                onClick={handleComplete}
                disabled={markItemComplete.isPending}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium text-sm hover:shadow-lg hover:shadow-blue-500/25 transition-all disabled:opacity-50"
              >
                {markItemComplete.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">{t.player.markComplete}</span>
              </button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              disabled={!hasNext}
              className={`gap-1 sm:gap-2 ${isDark ? 'bg-transparent border-white/15 text-gray-300 hover:bg-white/5 hover:text-gray-200' : ''}`}
            >
              <span className="hidden sm:inline">{t.player.next}</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </footer>
        </main>

        {/* 사이드바 */}
        <aside
          className={`fixed lg:relative right-0 top-0 h-full w-80 border-l transition-transform z-50 ${
            sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0 lg:hidden'
          } ${isDark ? 'bg-[#12121a] border-white/10' : 'bg-white border-gray-200'}`}
        >
          <CurriculumSidebar
            snapshotId={snapshotId}
            currentItemId={currentItemId}
            progressRecords={progressRecords}
            onItemSelect={handleItemSelect}
            demoItems={isDemoMode ? demoCurriculumItems : undefined}
          />
        </aside>
      </div>
    </div>
  );
}
