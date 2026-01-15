/**
 * B2BLearningPlayerPage
 * B2B 전용 학습 플레이어 페이지
 * - 16:9 비율 고정 플레이어
 * - 커뮤니티 섹션 포함
 */
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSubdomainPath } from '@/hooks/common/useSubdomainPath';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Loader2,
  BookOpen,
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
import { VideoPlayer, CurriculumSidebar, DocumentViewer, ExternalLinkViewer } from '../learning/components';
import { B2BCommentSection } from './components/B2BCommentSection';
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

export function B2BLearningPlayerPage() {
  const { enrollmentId, itemId } = useParams<{ enrollmentId: string; itemId?: string }>();
  const navigate = useNavigate();
  const { prefixPath } = useSubdomainPath();
  const { t } = useTranslation();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  // 상태
  const [currentItemId, setCurrentItemId] = useState<number | null>(itemId ? Number(itemId) : null);
  const [currentContentId, setCurrentContentId] = useState<number | null>(null);
  const [currentContentType, setCurrentContentType] = useState<PlayerContentType | null>(null);
  const [currentExternalUrl, setCurrentExternalUrl] = useState<string | null>(null);
  const [currentDownloadable, setCurrentDownloadable] = useState<boolean>(true);
  const [playedPercent, setPlayedPercent] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Refs
  const saveIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Queries & Mutations
  const { data: playerData, isLoading, isError } = useEnrollmentForPlayer(Number(enrollmentId));
  const markItemComplete = useMarkItemComplete();

  // API 데이터 사용
  const enrollment = playerData ? {
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

  // snapshotId
  const snapshotId = enrollment?.snapshotId ?? 0;

  // 아이템별 진도 조회
  const { data: itemsProgressData } = useQuery({
    queryKey: ['enrollment', 'items', 'progress', enrollmentId],
    queryFn: async () => {
      const response = await axiosInstance.get<{ itemId: number; progressPercent: number; completed: boolean; completedAt: string | null }[]>(
        API_ENDPOINTS.ENROLLMENTS.ITEMS_PROGRESS(Number(enrollmentId))
      );
      return response.data;
    },
    enabled: !!enrollmentId,
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

  // 스냅샷 아이템 조회
  const { data: snapshotItems } = useQuery({
    queryKey: ['snapshot', 'items', snapshotId],
    queryFn: async () => {
      const response = await axiosInstance.get<SnapshotItemResponse[]>(
        API_ENDPOINTS.SNAPSHOTS.ITEMS(snapshotId)
      );
      return response.data;
    },
    enabled: snapshotId > 0,
  });

  // 스냅샷 관계(순서) 조회
  const { data: relationsData } = useQuery({
    queryKey: ['snapshot', 'relations', 'ordered', snapshotId],
    queryFn: async () => {
      const response = await axiosInstance.get<SnapshotRelationsResponse>(
        API_ENDPOINTS.SNAPSHOTS.RELATIONS_ORDERED(snapshotId)
      );
      return response.data;
    },
    enabled: snapshotId > 0,
  });

  // 강사 목록 조회 (배지 표시용)
  const { data: instructorsData } = useQuery({
    queryKey: ['times', 'instructors', enrollment?.timeId],
    queryFn: async () => {
      const response = await axiosInstance.get<{ id: number; userId: number; name?: string }[]>(
        API_ENDPOINTS.TIMES.INSTRUCTORS(enrollment!.timeId)
      );
      return response.data;
    },
    enabled: !!enrollment?.timeId,
  });

  // 강사 ID 목록
  const instructorIds = useMemo(() => {
    if (!instructorsData) return [];
    return instructorsData.map((i) => i.userId);
  }, [instructorsData]);

  // 순서가 있는 커리큘럼 아이템 목록
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
    if (!snapshotItems) return [];

    const flatItems: OrderedCurriculumItem[] = [];
    let seq = 1;

    const flattenItems = (items: SnapshotItemResponse[]) => {
      items.forEach((item) => {
        if (!item.isFolder && item.snapshotLearningObject?.contentId) {
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
  }, [snapshotItems, relationsData]);

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

  // 첫 번째 아이템 자동 선택 또는 URL의 itemId로 선택
  useEffect(() => {
    if (orderedCurriculumItems.length > 0) {
      const targetItemId = itemId ? Number(itemId) : orderedCurriculumItems[0].itemId;
      const targetItem = orderedCurriculumItems.find(item => item.itemId === targetItemId) || orderedCurriculumItems[0];

      if (currentItemId !== targetItem.itemId || currentContentId !== targetItem.contentId || currentContentType !== targetItem.contentType) {
        setCurrentItemId(targetItem.itemId);
        setCurrentContentId(targetItem.contentId);
        setCurrentContentType(targetItem.contentType);
        setCurrentExternalUrl(targetItem.externalUrl || null);
        setCurrentDownloadable(targetItem.downloadable ?? true);
      }
    }
  }, [orderedCurriculumItems, itemId]);

  // 진도 저장 (임시 비활성화)
  const saveProgress = useCallback(async () => {
    return;
  }, []);

  // 차시 완료 처리
  const handleComplete = useCallback(async () => {
    if (!currentItemId || isCompleted) return;

    if (enrollmentId) {
      try {
        await axiosInstance.post(
          API_ENDPOINTS.ENROLLMENTS.ITEM_COMPLETE(Number(enrollmentId), currentItemId)
        );
      } catch (error) {
        console.error('[B2BLearningPlayer] Failed to mark item complete:', error);
        return;
      }
    }

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
  }, [currentItemId, isCompleted, enrollmentId]);

  // 비디오 진도 핸들러 (임시 비활성화)
  const handleVideoProgress = useCallback((_state: { played: number }) => {
    // TODO: 테스트 후 다시 활성화
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
      saveProgress();
    };
  }, [playedPercent, saveProgress]);

  // 아이템 선택 핸들러
  const handleItemSelect = useCallback((itemId: number, contentId: number, contentType: PlayerContentType, externalUrl?: string | null, downloadable?: boolean | null) => {
    saveProgress();

    setCurrentItemId(itemId);
    setCurrentContentId(contentId);
    setCurrentContentType(contentType);
    setCurrentExternalUrl(externalUrl || null);
    setCurrentDownloadable(downloadable ?? true);
    setPlayedPercent(0);
    setIsCompleted(progressRecords.some((r) => r.itemId === itemId && r.completed));

    // URL 업데이트 (B2B 경로)
    navigate(prefixPath(`/tu/b2b/player/${enrollmentId}/${itemId}`), { replace: true });
  }, [enrollmentId, navigate, progressRecords, saveProgress, prefixPath]);

  // 뒤로가기 (B2B: 코스 상세 페이지로)
  const handleBack = useCallback(() => {
    saveProgress();
    navigate(prefixPath(`/tu/b2b/times/${enrollment?.timeId}`));
  }, [enrollment?.timeId, navigate, saveProgress, prefixPath]);

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

  // 로딩 상태
  if (isLoading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${isDark ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
        <Loader2 className={`w-8 h-8 animate-spin ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
      </div>
    );
  }

  // 에러 상태
  if (isError || !enrollment) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-screen ${isDark ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
        <BookOpen className={`w-16 h-16 mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
        <h3 className={`text-lg font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {t.learning.enrollmentNotFound}
        </h3>
        <Button onClick={() => navigate(prefixPath('/tu/b2b'))}>
          {t.learning.backToLearning}
        </Button>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-screen ${isDark ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
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
        {/* 플레이어 + 커뮤니티 영역 */}
        <main className={`flex-1 flex flex-col min-w-0 transition-all duration-300 overflow-auto ${isDark ? 'bg-[#1e1e1e] dark-scrollbar' : 'bg-gray-50 landing-light'}`}>
          {/* 플레이어 컨테이너 - 16:9 비율 고정 */}
          <div className={`w-full shrink-0 ${isDark ? 'bg-[#0a0a0a]' : 'bg-gray-900'}`}>
            <div className="w-full aspect-video">
              {/* 비디오 플레이어 */}
              {currentContentId && currentContentType === 'VIDEO' && (
                <div key={`video-${currentContentId}`} className="w-full h-full flex items-center justify-center bg-black">
                  <VideoPlayer
                    contentId={currentContentId}
                    initialProgress={
                      progressRecords.find((r) => r.itemId === currentItemId)?.progressPercent
                        ? (progressRecords.find((r) => r.itemId === currentItemId)?.progressPercent || 0) / 100
                        : 0
                    }
                    onProgress={handleVideoProgress}
                    isLearnerMode={true}
                  />
                </div>
              )}

              {/* 문서 뷰어 */}
              {currentContentId && currentContentType === 'DOCUMENT' && (
                <div key={`doc-${currentContentId}`} className="w-full h-full">
                  <DocumentViewer
                    contentId={currentContentId}
                    contentType="DOCUMENT"
                    isLearnerMode={true}
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
                    isLearnerMode={true}
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
          </div>

          {/* 댓글 섹션 (B2B 전용 - 댓글/질문 탭) */}
          {enrollment?.timeId && (
            <B2BCommentSection
              timeId={enrollment.timeId}
              isDark={isDark}
              currentItemName={orderedCurriculumItems.find(item => item.itemId === currentItemId)?.itemName}
              instructorIds={instructorIds}
            />
          )}
        </main>

        {/* 사이드바 - 모바일: 전체화면 오버레이, 데스크탑: 토글 가능 */}
        {sidebarOpen && (
          <>
            {/* 모바일 오버레이 배경 */}
            <div
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            {/* 사이드바 */}
            <aside
              className={`
                fixed inset-0 z-50 md:relative md:z-auto
                md:shrink-0 md:border-l transition-all duration-300
                ${isDark ? 'bg-[#12121a] md:border-white/10' : 'bg-white md:border-gray-200'}
              `}
            >
              {/* 모바일 닫기 헤더 */}
              <div className={`flex items-center justify-between px-4 py-3 border-b md:hidden ${
                isDark ? 'border-white/10' : 'border-gray-200'
              }`}>
                <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  커리큘럼
                </h3>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className={`p-2 rounded-lg ${isDark ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
                >
                  <PanelRightClose className="w-5 h-5" />
                </button>
              </div>
              <div className="w-full md:w-80 h-[calc(100%-56px)] md:h-full overflow-auto">
                <CurriculumSidebar
                  snapshotId={snapshotId}
                  currentItemId={currentItemId}
                  progressRecords={progressRecords}
                  onItemSelect={(itemId, contentId, contentType, externalUrl, downloadable) => {
                    handleItemSelect(itemId, contentId, contentType, externalUrl, downloadable);
                    // 모바일에서 아이템 선택 시 사이드바 닫기
                    if (window.innerWidth < 768) {
                      setSidebarOpen(false);
                    }
                  }}
                />
              </div>
            </aside>
          </>
        )}
        {/* 데스크탑에서 사이드바 닫혔을 때 공간 유지 안함 */}
        {!sidebarOpen && <div className="hidden md:block w-0" />}
      </div>

      {/* 하단 컨트롤 바 */}
      <div className={`shrink-0 px-4 py-3 border-t ${
        isDark ? 'bg-[#1a1a1a] border-white/10' : 'bg-gray-800 border-gray-700'
      }`}>
        <div className="flex items-center justify-between gap-3">
          {/* 현재 콘텐츠 정보 */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <h2 className="text-white font-medium truncate text-sm sm:text-base">
              {orderedCurriculumItems.find(item => item.itemId === currentItemId)?.itemName || ''}
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
