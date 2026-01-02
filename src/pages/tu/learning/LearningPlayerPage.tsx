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
import {
  useEnrollment,
  useUpdateProgress,
  useMarkItemComplete,
} from '@/hooks/tu';
import { VideoPlayer, CurriculumSidebar, DocumentViewer, ExternalLinkViewer } from './components';
import {
  COMPLETION_THRESHOLD,
  AUTO_SAVE_INTERVAL,
  type PlayerContentType,
  type ProgressRecordResponse,
} from '@/types/tu';

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
  const { data: apiEnrollment, isLoading, isError } = useEnrollment(
    isDemoMode ? 0 : Number(enrollmentId),
    { enabled: !isDemoMode }
  );
  const updateProgress = useUpdateProgress();
  const markItemComplete = useMarkItemComplete();

  // 데모 모드 또는 API 데이터 사용
  const enrollment = isDemoMode ? DEMO_ENROLLMENT : apiEnrollment;

  // Mock 진도 기록 (실제로는 API에서 가져와야 함)
  const [progressRecords, setProgressRecords] = useState<ProgressRecordResponse[]>([]);

  // snapshotId (데모 모드에서는 mock 사용)
  const snapshotId = isDemoMode ? 999 : 1; // enrollment?.snapshotId || 1;

  // 데모 커리큘럼 아이템 (사이드바용)
  const demoCurriculumItems = useMemo(() => DEMO_CURRICULUM_ITEMS, []);

  // 현재 아이템 인덱스 및 이전/다음 아이템 계산
  const { hasPrevious, hasNext, previousItem, nextItem } = useMemo(() => {
    const items = isDemoMode ? demoCurriculumItems : [];
    const index = items.findIndex((item) => item.itemId === currentItemId);
    return {
      currentIndex: index,
      hasPrevious: index > 0,
      hasNext: index >= 0 && index < items.length - 1,
      previousItem: index > 0 ? items[index - 1] : null,
      nextItem: index >= 0 && index < items.length - 1 ? items[index + 1] : null,
    };
  }, [isDemoMode, demoCurriculumItems, currentItemId]);

  // 데모 모드에서 첫 번째 아이템 자동 선택
  useEffect(() => {
    if (isDemoMode && !currentContentId && demoCurriculumItems.length > 0) {
      const targetItemId = itemId ? Number(itemId) : demoCurriculumItems[0].itemId;
      const targetItem = demoCurriculumItems.find(item => item.itemId === targetItemId) || demoCurriculumItems[0];

      setCurrentItemId(targetItem.itemId);
      setCurrentContentId(targetItem.contentId);
      setCurrentContentType(targetItem.contentType);
    }
  }, [isDemoMode, currentContentId, demoCurriculumItems, itemId]);

  // 진도 저장
  const saveProgress = useCallback(async () => {
    if (!currentItemId || playedPercent <= 0) return;

    // 데모 모드에서는 로컬만 업데이트
    if (isDemoMode) {
      setLastSaveTime(Date.now());
      return;
    }

    if (!enrollmentId) return;

    try {
      await updateProgress.mutateAsync({
        enrollmentId: Number(enrollmentId),
        request: {
          itemId: currentItemId,
          progressPercent: Math.round(playedPercent * 100),
        },
      });
      setLastSaveTime(Date.now());
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  }, [currentItemId, enrollmentId, playedPercent, updateProgress, isDemoMode]);

  // 차시 완료 처리
  const handleComplete = useCallback(async () => {
    if (!currentItemId || isCompleted) return;

    // 진도 기록 업데이트 (공통)
    const updateLocalProgress = () => {
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
    };

    // 데모 모드에서는 로컬만 업데이트
    if (isDemoMode) {
      updateLocalProgress();
      return;
    }

    if (!enrollmentId) return;

    try {
      await markItemComplete.mutateAsync({
        enrollmentId: Number(enrollmentId),
        itemId: currentItemId,
      });
      updateLocalProgress();
    } catch (error) {
      console.error('Failed to mark item complete:', error);
    }
  }, [currentItemId, enrollmentId, isCompleted, markItemComplete, isDemoMode]);

  // 비디오 진도 핸들러
  const handleVideoProgress = useCallback((state: { played: number }) => {
    setPlayedPercent(state.played);

    // 80% 완료 감지
    if (state.played >= COMPLETION_THRESHOLD && !isCompleted) {
      handleComplete();
    }
  }, [isCompleted, handleComplete]);

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
      navigate(`/mypage/learning/${enrollmentId}`);
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
                    {demoCurriculumItems.find(item => item.itemId === currentItemId)?.itemName || '콘텐츠'}
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
