/**
 * LearningPlayerPage
 * 학습 플레이어 메인 페이지
 */
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useSubdomainPath } from '@/hooks/common/useSubdomainPath';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Loader2,
  BookOpen,
  X,
  AlertTriangle,
  PanelRightClose,
  PanelRightOpen,
} from 'lucide-react';
import { Button, Badge } from '@/components/common';
import { useTranslation } from '@/store/common/languageStore';
import { useThemeStore } from '@/store/common/themeStore';
import { useQuery } from '@tanstack/react-query';
import {
  useEnrollmentForPlayer,
  useMarkItemComplete,
} from '@/hooks/tu';
import axiosInstance from '@/services/common/api/axiosInstance';
import { API_ENDPOINTS } from '@/services/common/api/endpoints';
import { VideoPlayer, CurriculumSidebar, DocumentViewer, ExternalLinkViewer } from './components';
import {
  AUTO_SAVE_INTERVAL,
  type PlayerContentType,
  type ProgressRecordResponse,
} from '@/types/tu';
import type { SnapshotItemResponse, SnapshotRelationsResponse } from '@/types/common/snapshot.types';

// itemType을 PlayerContentType으로 매핑
const mapItemTypeToContentType = (itemType: string | null | undefined): PlayerContentType => {
  if (!itemType) return 'VIDEO';
  const typeMap: Record<string, PlayerContentType> = {
    VIDEO: 'VIDEO',
    AUDIO: 'VIDEO',
    DOCUMENT: 'DOCUMENT',
    IMAGE: 'IMAGE',
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
  const { prefixPath } = useSubdomainPath();
  const { t } = useTranslation();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  // 데모 모드 확인 (URL이 /demo 이거나 ?demo=true)
  const isDemoMode = enrollmentId === 'demo' || searchParams.get('demo') === 'true';

  // 상태
  const [currentItemId, setCurrentItemId] = useState<number | null>(itemId ? Number(itemId) : null);
  const [currentContentId, setCurrentContentId] = useState<number | null>(null);
  const [currentContentType, setCurrentContentType] = useState<PlayerContentType | null>(null);
  const [currentExternalUrl, setCurrentExternalUrl] = useState<string | null>(null);
  const [currentDownloadable, setCurrentDownloadable] = useState<boolean>(true);
  const [playedPercent, setPlayedPercent] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showDemoBanner, setShowDemoBanner] = useState(true);

  // Refs
  const saveIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Queries & Mutations (데모 모드에서는 비활성화)
  const { data: playerData, isLoading, isError } = useEnrollmentForPlayer(
    isDemoMode ? 0 : Number(enrollmentId),
    { enabled: !isDemoMode }
  );
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

  // 진도 기록 상태
  const [progressRecords, setProgressRecords] = useState<ProgressRecordResponse[]>([]);

  // snapshotId (데모 모드에서는 mock 사용, 실제 모드에서는 playerData에서 가져옴)
  const snapshotId = isDemoMode ? 999 : (enrollment?.snapshotId ?? 0);

  // 아이템별 진도 조회 (실제 모드에서만)
  const { data: itemsProgressData } = useQuery({
    queryKey: ['enrollment', 'items', 'progress', enrollmentId],
    queryFn: async () => {
      const response = await axiosInstance.get<{ itemId: number; progressPercent: number; completed: boolean; completedAt: string | null }[]>(
        API_ENDPOINTS.ENROLLMENTS.ITEMS_PROGRESS(Number(enrollmentId))
      );
      return response.data;
    },
    enabled: !isDemoMode && !!enrollmentId,
  });

  // API에서 가져온 진도 데이터를 progressRecords에 반영
  useEffect(() => {
    if (itemsProgressData && itemsProgressData.length > 0) {
      const records: ProgressRecordResponse[] = itemsProgressData.map((item) => ({
        itemId: item.itemId,
        progressPercent: item.progressPercent,
        watchedSeconds: 0,
        completed: item.completed,
        completedAt: item.completedAt,
      }));
      setProgressRecords(records);
    }
  }, [itemsProgressData]);

  // 스냅샷 아이템 조회 (실제 모드에서만)
  // axiosInstance가 ApiResponse wrapper를 자동으로 언래핑하므로 .data만 사용
  const { data: snapshotItems } = useQuery({
    queryKey: ['snapshot', 'items', snapshotId],
    queryFn: async () => {
      const response = await axiosInstance.get<SnapshotItemResponse[]>(
        API_ENDPOINTS.SNAPSHOTS.ITEMS(snapshotId)
      );
      return response.data;
    },
    enabled: !isDemoMode && snapshotId > 0,
  });

  // 스냅샷 관계(순서) 조회 (실제 모드에서만)
  const { data: relationsData } = useQuery({
    queryKey: ['snapshot', 'relations', 'ordered', snapshotId],
    queryFn: async () => {
      const response = await axiosInstance.get<SnapshotRelationsResponse>(
        API_ENDPOINTS.SNAPSHOTS.RELATIONS_ORDERED(snapshotId)
      );
      return response.data;
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
    externalUrl?: string | null;
    downloadable?: boolean | null;
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
            externalUrl: item.snapshotLearningObject.externalUrl,
            downloadable: item.snapshotLearningObject.downloadable,
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

  // 첫 번째 아이템 자동 선택 또는 URL의 itemId로 선택 (데모/실제 공통)
  useEffect(() => {
    if (orderedCurriculumItems.length > 0) {
      const targetItemId = itemId ? Number(itemId) : orderedCurriculumItems[0].itemId;
      const targetItem = orderedCurriculumItems.find(item => item.itemId === targetItemId) || orderedCurriculumItems[0];

      // 현재 선택된 아이템과 다르면 업데이트
      if (currentItemId !== targetItem.itemId || currentContentId !== targetItem.contentId || currentContentType !== targetItem.contentType) {
        setCurrentItemId(targetItem.itemId);
        setCurrentContentId(targetItem.contentId);
        setCurrentContentType(targetItem.contentType);
        setCurrentExternalUrl(targetItem.externalUrl || null);
        setCurrentDownloadable(targetItem.downloadable ?? true);
      }
    }
  }, [orderedCurriculumItems, itemId]);

  // 현재 아이템의 완료 상태 동기화
  useEffect(() => {
    if (currentItemId && progressRecords.length > 0) {
      const itemProgress = progressRecords.find((r) => r.itemId === currentItemId);
      setIsCompleted(itemProgress?.completed ?? false);
    }
  }, [currentItemId, progressRecords]);

  // 진도 저장 (임시 비활성화)
  const saveProgress = useCallback(async () => {
    // TODO: 테스트 후 다시 활성화
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

  // 차시 완료 처리
  const handleComplete = useCallback(async () => {
    if (!currentItemId || isCompleted) return;

    // 백엔드 API 호출 (데모 모드가 아닐 때만)
    if (!isDemoMode && enrollmentId) {
      try {
        await axiosInstance.post(
          API_ENDPOINTS.ENROLLMENTS.ITEM_COMPLETE(Number(enrollmentId), currentItemId)
        );
      } catch (error) {
        console.error('[LearningPlayer] Failed to mark item complete:', error);
        return; // API 실패 시 로컬 상태 업데이트 안 함
      }
    }

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
  }, [currentItemId, isCompleted, isDemoMode, enrollmentId]);

  // 비디오 진도 핸들러 (임시 비활성화)
  const handleVideoProgress = useCallback((_state: { played: number }) => {
    // TODO: 테스트 후 다시 활성화
    // setPlayedPercent(_state.played);
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
  const handleItemSelect = useCallback((itemId: number, contentId: number, contentType: PlayerContentType, externalUrl?: string | null, downloadable?: boolean | null) => {
    // 현재 진도 저장
    saveProgress();

    // 새 아이템으로 이동
    setCurrentItemId(itemId);
    setCurrentContentId(contentId);
    setCurrentContentType(contentType);
    setCurrentExternalUrl(externalUrl || null);
    setCurrentDownloadable(downloadable ?? true);
    setPlayedPercent(0);
    setIsCompleted(progressRecords.some((r) => r.itemId === itemId && r.completed));

    // URL 업데이트
    const basePath = isDemoMode ? '/tu/b2c/mypage/learning/demo/player' : `/tu/b2c/mypage/learning/${enrollmentId}/player`;
    navigate(prefixPath(`${basePath}/${itemId}`), { replace: true });
  }, [enrollmentId, navigate, progressRecords, saveProgress, isDemoMode]);

  // 뒤로가기
  const handleBack = useCallback(() => {
    saveProgress();
    if (isDemoMode) {
      navigate(prefixPath('/tu/b2c/mypage/learning'));
    } else {
      navigate(prefixPath(`/tu/b2c/mypage/learning/${enrollmentId}`));
    }
  }, [enrollmentId, navigate, saveProgress, isDemoMode, prefixPath]);

  // 이전 아이템으로 이동
  const handlePrevious = useCallback(() => {
    if (!previousItem) return;
    handleItemSelect(previousItem.itemId, previousItem.contentId, previousItem.contentType, previousItem.externalUrl, previousItem.downloadable);
  }, [previousItem, handleItemSelect]);

  // 다음 아이템으로 이동
  const handleNext = useCallback(() => {
    if (!nextItem) return;
    handleItemSelect(nextItem.itemId, nextItem.contentId, nextItem.contentType, nextItem.externalUrl, nextItem.downloadable);
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
        <Button onClick={() => navigate(prefixPath('/tu/b2c/mypage/learning'))}>
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

        <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-auto">
          {isCompleted && (
            <Badge variant="green" className="gap-1">
              <CheckCircle className="w-3 h-3" />
              {t.player.completed}
            </Badge>
          )}
          {/* 사이드바 토글 버튼 - 항상 표시 */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`gap-1 ${isDark ? 'hover:bg-white/10 text-gray-300' : ''}`}
            title={sidebarOpen ? '커리큘럼 닫기' : '커리큘럼 열기'}
          >
            {sidebarOpen ? (
              <PanelRightClose className="w-5 h-5" />
            ) : (
              <PanelRightOpen className="w-5 h-5" />
            )}
          </Button>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* 플레이어 영역 */}
        <main className="flex-1 flex flex-col min-w-0 transition-all duration-300">
          {/* 플레이어 컨테이너 */}
          <div className={`flex-1 min-h-0 ${isDark ? 'bg-[#0a0a0a]' : 'bg-gray-900'}`}>
            {/* 비디오 플레이어 */}
            {currentContentId && currentContentType === 'VIDEO' && (
              <div key={`video-${currentContentId}`} className="w-full h-full flex items-center justify-center bg-black">
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
              </div>
            )}

            {/* 문서 뷰어 */}
            {currentContentId && currentContentType === 'DOCUMENT' && (
              <div key={`doc-${currentContentId}`} className="w-full h-full">
                <DocumentViewer
                  contentId={currentContentId}
                  contentType="DOCUMENT"
                  isLearnerMode={!isDemoMode}
                  downloadable={currentDownloadable}
                />
              </div>
            )}

            {/* 이미지 뷰어 */}
            {currentContentId && currentContentType === 'IMAGE' && (
              <div key={`img-${currentContentId}`} className="w-full h-full">
                <DocumentViewer
                  contentId={currentContentId}
                  contentType="IMAGE"
                  isLearnerMode={!isDemoMode}
                  downloadable={currentDownloadable}
                />
              </div>
            )}

            {/* 외부 링크 뷰어 */}
            {currentContentType === 'EXTERNAL_LINK' && currentExternalUrl && (
              <div className="w-full h-full">
                <ExternalLinkViewer
                  url={currentExternalUrl}
                />
              </div>
            )}

            {/* 콘텐츠가 없는 경우 */}
            {!currentContentId && (
              <div className="w-full h-full flex flex-col items-center justify-center bg-black">
                <BookOpen className="w-16 h-16 mb-4 text-gray-600" />
                <p className="text-gray-400">
                  {t.player.selectContent}
                </p>
              </div>
            )}
          </div>
        </main>

        {/* 사이드바 - 토글 가능 */}
        <aside
          className={`shrink-0 border-l transition-all duration-300 overflow-hidden ${
            sidebarOpen ? 'w-80' : 'w-0'
          } ${isDark ? 'bg-[#12121a] border-white/10' : 'bg-white border-gray-200'}`}
        >
          <div className="w-80 h-full">
            <CurriculumSidebar
              snapshotId={snapshotId}
              currentItemId={currentItemId}
              progressRecords={progressRecords}
              onItemSelect={handleItemSelect}
              demoItems={isDemoMode ? demoCurriculumItems : undefined}
            />
          </div>
        </aside>
      </div>

      {/* 하단 컨트롤 바 - 전체 너비 */}
      <div className={`shrink-0 px-4 py-3 border-t ${
        isDark ? 'bg-[#1a1a1a] border-white/10' : 'bg-gray-800 border-gray-700'
      }`}>
        <div className="flex items-center justify-between gap-3">
          {/* 현재 콘텐츠 정보 */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <h2 className="text-white font-medium truncate text-sm sm:text-base">
              {orderedCurriculumItems.find(item => item.itemId === currentItemId)?.itemName || '콘텐츠'}
            </h2>
            {isCompleted && (
              <Badge variant="green" className="gap-1 shrink-0">
                <CheckCircle className="w-3 h-3" />
                완료
              </Badge>
            )}
          </div>

          {/* 네비게이션 버튼 */}
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrevious}
              disabled={!hasPrevious}
              className="gap-1 text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">{t.player.previous}</span>
            </Button>

            {!isCompleted && (
              <button
                onClick={handleComplete}
                disabled={markItemComplete.isPending}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium text-sm hover:shadow-lg hover:shadow-blue-500/25 transition-all disabled:opacity-50"
              >
                {markItemComplete.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle className="w-4 h-4" />
                )}
                <span>{t.player.markComplete}</span>
              </button>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={handleNext}
              disabled={!hasNext}
              className="gap-1 text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-30"
            >
              <span className="hidden sm:inline">{t.player.next}</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
