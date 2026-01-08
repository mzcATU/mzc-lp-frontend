/**
 * CurriculumSidebar 컴포넌트
 * 학습 플레이어 사이드바 - 커리큘럼 목록 표시
 */
import { useMemo } from 'react';
import {
  CheckCircle,
  PlayCircle,
  Video,
  FileText,
  Link as LinkIcon,
  Image,
  Music,
  Folder,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { useTranslation } from '@/store/common/languageStore';
import { useThemeStore } from '@/store/common/themeStore';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/services/common/api/axiosInstance';
import { API_ENDPOINTS } from '@/services/common/api/endpoints';
import type { SnapshotItemResponse, SnapshotRelationsResponse } from '@/types/common/snapshot.types';
import type { ProgressRecordResponse, PlayerContentType } from '@/types/tu';

// 데모 아이템 타입
interface DemoItem {
  itemId: number;
  itemName: string;
  contentId: number;
  contentType: PlayerContentType;
  duration: number;
}

interface CurriculumSidebarProps {
  snapshotId: number;
  currentItemId: number | null;
  progressRecords: ProgressRecordResponse[];
  onItemSelect: (itemId: number, contentId: number, contentType: PlayerContentType, externalUrl?: string | null, downloadable?: boolean | null) => void;
  demoItems?: DemoItem[];
}

// 콘텐츠 타입별 아이콘
const contentTypeIcons: Record<string, React.ReactNode> = {
  VIDEO: <Video className="w-4 h-4" />,
  AUDIO: <Music className="w-4 h-4" />,
  DOCUMENT: <FileText className="w-4 h-4" />,
  IMAGE: <Image className="w-4 h-4" />,
  EXTERNAL_LINK: <LinkIcon className="w-4 h-4" />,
};

// itemType을 PlayerContentType으로 매핑
const mapItemTypeToContentType = (itemType: string | null | undefined): PlayerContentType => {
  if (!itemType) return 'VIDEO';
  const typeMap: Record<string, PlayerContentType> = {
    VIDEO: 'VIDEO',
    AUDIO: 'VIDEO', // 오디오도 비디오 플레이어로 재생
    DOCUMENT: 'DOCUMENT',
    IMAGE: 'IMAGE',
    EXTERNAL_LINK: 'EXTERNAL_LINK',
  };
  return typeMap[itemType.toUpperCase()] || 'VIDEO';
};
// 스냅샷 아이템 조회 훅
function useSnapshotItems(snapshotId: number, enabled: boolean = true) {
  return useQuery({
    queryKey: ['snapshot', 'items', snapshotId],
    queryFn: async () => {
      const response = await axiosInstance.get<SnapshotItemResponse[]>(
        API_ENDPOINTS.SNAPSHOTS.ITEMS(snapshotId)
      );
      return response.data;
    },
    enabled: enabled && !!snapshotId && snapshotId !== 999, // 999는 데모 모드
  });
}

// 스냅샷 관계(순서) 조회 훅
function useSnapshotRelationsOrdered(snapshotId: number, enabled: boolean = true) {
  return useQuery({
    queryKey: ['snapshot', 'relations', 'ordered', snapshotId],
    queryFn: async () => {
      const response = await axiosInstance.get<SnapshotRelationsResponse>(
        API_ENDPOINTS.SNAPSHOTS.RELATIONS_ORDERED(snapshotId)
      );
      return response.data;
    },
    enabled: enabled && !!snapshotId && snapshotId !== 999, // 999는 데모 모드
  });
}

interface CurriculumItemProps {
  item: SnapshotItemResponse;
  seq: number;
  isActive: boolean;
  isCompleted: boolean;
  progress: number;
  onSelect: () => void;
  isDark: boolean;
}

function CurriculumItem({ item, seq, isActive, isCompleted, progress, onSelect, isDark }: CurriculumItemProps) {
  const duration = item.snapshotLearningObject?.duration;
  const description = item.snapshotLearningObject?.description;
  const pageCount = item.snapshotLearningObject?.pageCount;
  const isFolder = item.isFolder;
  // displayName이 있으면 우선 사용, 없으면 itemName(파일명) 사용
  const displayName = item.snapshotLearningObject?.displayName || item.itemName;
  // itemType으로 콘텐츠 타입 결정
  const itemType = item.itemType?.toUpperCase();

  if (isFolder) {
    return (
      <div className={`flex items-center gap-3 px-3 py-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
        <Folder className="w-4 h-4" />
        <span className="font-medium text-sm">{item.itemName}</span>
      </div>
    );
  }

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // 배경색 클래스
  const bgClass = isActive
    ? isDark ? 'bg-white/10 ring-2 ring-blue-500' : 'bg-gray-100 ring-2 ring-blue-500'
    : isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50';

  // 아이콘 배경색 클래스
  const iconBgClass = isCompleted
    ? 'bg-green-100 text-green-600'
    : isActive
    ? 'bg-blue-500 text-white'
    : isDark ? 'bg-white/10 text-gray-400' : 'bg-gray-100 text-gray-500';

  return (
    <button
      onClick={onSelect}
      className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all text-left ${bgClass}`}
    >
      {/* 순서 번호 또는 완료/재생 아이콘 */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${iconBgClass}`}>
        {isCompleted ? (
          <CheckCircle className="w-4 h-4" />
        ) : isActive ? (
          <PlayCircle className="w-4 h-4" />
        ) : (
          <span className="text-xs font-medium">{seq}</span>
        )}
      </div>

      {/* 콘텐츠 정보 */}
      <div className="flex-1 min-w-0">
        <div
          className={`text-sm font-medium truncate ${
            isActive
              ? isDark ? 'text-white' : 'text-gray-900'
              : isDark ? 'text-gray-300' : 'text-gray-600'
          }`}
        >
          {displayName}
        </div>
        {description && (
          <div
            className={`text-xs mt-0.5 truncate ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            {description}
          </div>
        )}
        {/* 콘텐츠 메타 정보: 영상 길이 또는 페이지 수 */}
        {(duration || pageCount) && (
          <div className={`flex items-center gap-2 mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            {itemType && contentTypeIcons[itemType]}
            {duration && (
              <span className="text-xs">
                {formatDuration(duration)}
              </span>
            )}
            {pageCount && (
              <span className="text-xs">
                {pageCount}p
              </span>
            )}
            {progress > 0 && progress < 100 && (
              <span className="text-xs">
                ({progress}%)
              </span>
            )}
          </div>
        )}
      </div>

      {/* 화살표 */}
      <ChevronRight
        className={`w-4 h-4 flex-shrink-0 ${
          isActive
            ? isDark ? 'text-white' : 'text-gray-900'
            : isDark ? 'text-gray-600' : 'text-gray-400'
        }`}
      />
    </button>
  );
}

export function CurriculumSidebar({
  snapshotId,
  currentItemId,
  progressRecords,
  onItemSelect,
  demoItems,
}: CurriculumSidebarProps) {
  const { t } = useTranslation();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const isDemoMode = !!demoItems;

  const { data: items, isLoading: itemsLoading } = useSnapshotItems(snapshotId, !isDemoMode);
  const { data: relationsData, isLoading: relationsLoading } = useSnapshotRelationsOrdered(snapshotId, !isDemoMode);

  // 진도 기록을 Map으로 변환
  const progressMap = useMemo(() => {
    const map = new Map<number, ProgressRecordResponse>();
    progressRecords.forEach((record) => {
      map.set(record.itemId, record);
    });
    return map;
  }, [progressRecords]);

  // 순서가 있는 아이템 목록 생성 (API 또는 데모)
  const orderedItems = useMemo(() => {
    // 데모 모드
    if (isDemoMode && demoItems) {
      return demoItems.map((demo, index) => ({
        seq: index + 1,
        itemId: demo.itemId,
        item: {
          itemId: demo.itemId,
          itemName: demo.itemName,
          isFolder: false,
          snapshotLearningObject: {
            contentId: demo.contentId,
            duration: demo.duration,
          },
        } as unknown as SnapshotItemResponse,
        contentId: demo.contentId,
        contentType: demo.contentType,
      }));
    }

    // API 모드
    if (!items) return [];

    const itemsMap = new Map<number, SnapshotItemResponse>();
    const flatItems: { seq: number; itemId: number; item: SnapshotItemResponse }[] = [];
    let seq = 1;

    // 재귀적으로 아이템 평탄화 (폴더 포함)
    const flattenItems = (itemList: SnapshotItemResponse[]) => {
      itemList.forEach((item) => {
        itemsMap.set(item.itemId, item);
        // 폴더이거나 콘텐츠가 있는 아이템 추가
        if (item.isFolder || item.snapshotLearningObject?.contentId) {
          flatItems.push({
            seq: item.isFolder ? 0 : seq++, // 폴더는 seq 0
            itemId: item.itemId,
            item: item,
          });
        }
        if (item.children && item.children.length > 0) {
          flattenItems(item.children);
        }
      });
    };
    flattenItems(items);

    // relationsData가 있으면 순서대로, 없으면 평탄화된 순서대로 반환
    if (relationsData?.orderedItems && relationsData.orderedItems.length > 0) {
      return relationsData.orderedItems.map((orderedItem) => ({
        ...orderedItem,
        item: itemsMap.get(orderedItem.itemId),
        contentId: undefined as number | undefined,
        contentType: undefined as PlayerContentType | undefined,
      })).filter((item) => item.item);
    }

    // relations가 없으면 평탄화된 아이템 반환
    return flatItems.map((flatItem) => ({
      ...flatItem,
      contentId: undefined as number | undefined,
      contentType: undefined as PlayerContentType | undefined,
    }));
  }, [items, relationsData, isDemoMode, demoItems]);

  const isLoading = !isDemoMode && (itemsLoading || relationsLoading);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className={`w-6 h-6 animate-spin ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
      </div>
    );
  }

  const completedCount = progressRecords.filter((r) => r.completed).length;
  const totalCount = orderedItems.length;

  return (
    <div className={`h-full flex flex-col ${isDark ? 'bg-[#12121a]' : 'bg-white'}`}>
      {/* 헤더 */}
      <div className={`p-4 border-b ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
        <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {t.player.curriculum}
        </h3>
        <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          {completedCount} / {totalCount} {t.learning.completed}
        </p>
      </div>

      {/* 아이템 목록 */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {orderedItems.map(({ item, seq, itemId, contentId: demoContentId, contentType: demoContentType }) => {
            if (!item) return null;

            const progressRecord = progressMap.get(itemId);
            const isCompleted = progressRecord?.completed ?? false;
            const progress = progressRecord?.progressPercent ?? 0;
            const contentId = demoContentId ?? item.snapshotLearningObject?.contentId ?? 0;
            // 데모 모드에서는 demoContentType 사용, 실제 모드에서는 itemType을 매핑
            const contentType = demoContentType ?? mapItemTypeToContentType(item.itemType);
            const externalUrl = item.snapshotLearningObject?.externalUrl;
            const downloadable = item.snapshotLearningObject?.downloadable;

            return (
              <CurriculumItem
                key={itemId}
                item={item}
                seq={seq}
                isActive={currentItemId === itemId}
                isCompleted={isCompleted}
                progress={progress}
                isDark={isDark}
                onSelect={() => {
                  if (contentId > 0) {
                    onItemSelect(itemId, contentId, contentType, externalUrl, downloadable);
                  }
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
