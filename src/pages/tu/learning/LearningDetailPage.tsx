import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSubdomainPath } from '@/hooks/common';
import {
  PlayCircle,
  CheckCircle,
  Clock,
  Calendar,
  AlertCircle,
  XCircle,
  Loader2,
  BookOpen,
  ChevronRight,
  FileText,
  Video,
  Link as LinkIcon,
  Music,
  Image,
  Folder,
} from 'lucide-react';
import {
  Button,
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  BackButton,
} from '@/components/common';
import { useQuery } from '@tanstack/react-query';
import { useEnrollmentForPlayer, useCancelEnrollment } from '@/hooks/tu';
import { useTranslation } from '@/store/common/languageStore';
import { useThemeStore } from '@/store/common/themeStore';
import axiosInstance from '@/services/common/api/axiosInstance';
import { API_ENDPOINTS } from '@/services/common/api/endpoints';
import type { EnrollmentStatus } from '@/services/tu/enrollmentService';
import type { SnapshotItemResponse, SnapshotRelationsResponse } from '@/types/common/snapshot.types';

const statusColors: Record<EnrollmentStatus, 'blue' | 'green' | 'red' | 'gray' | 'orange'> = {
  PENDING: 'orange',
  APPROVED: 'blue',
  REJECTED: 'red',
  CANCELLED: 'gray',
  COMPLETED: 'green',
};

const statusIcons: Record<EnrollmentStatus, React.ReactNode> = {
  PENDING: <AlertCircle className="w-4 h-4" />,
  APPROVED: <PlayCircle className="w-4 h-4" />,
  REJECTED: <XCircle className="w-4 h-4" />,
  CANCELLED: <XCircle className="w-4 h-4" />,
  COMPLETED: <CheckCircle className="w-4 h-4" />,
};

// 커리큘럼 아이템 타입
interface CurriculumDisplayItem {
  itemId: number;
  itemName: string; // 표시용 이름 (displayName 또는 itemName)
  itemType: string | null;
  duration: number | null;
  isFolder: boolean;
  seq: number;
  isCompleted: boolean;
}

// 콘텐츠 타입별 아이콘
const getTypeIcon = (itemType: string | null, isFolder: boolean) => {
  if (isFolder) return <Folder className="w-4 h-4" />;
  if (!itemType) return <Video className="w-4 h-4" />;
  const iconMap: Record<string, React.ReactNode> = {
    VIDEO: <Video className="w-4 h-4" />,
    AUDIO: <Music className="w-4 h-4" />,
    DOCUMENT: <FileText className="w-4 h-4" />,
    IMAGE: <Image className="w-4 h-4" />,
    EXTERNAL_LINK: <LinkIcon className="w-4 h-4" />,
  };
  return iconMap[itemType.toUpperCase()] || <Video className="w-4 h-4" />;
};

interface CurriculumListItemProps {
  item: CurriculumDisplayItem;
  isDark: boolean;
  onClick: () => void;
}

function CurriculumListItem({ item, isDark, onClick }: CurriculumListItemProps) {
  // 폴더인 경우 다르게 표시
  if (item.isFolder) {
    return (
      <div className={`flex items-center gap-3 px-4 py-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
        <Folder className="w-4 h-4" />
        <span className="font-medium text-sm">{item.itemName}</span>
      </div>
    );
  }

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return null;
    const mins = Math.floor(seconds / 60);
    return `${mins}분`;
  };

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-4 p-4 rounded-lg transition-colors cursor-pointer ${
        item.isCompleted
          ? isDark
            ? 'bg-green-500/10 border border-green-500/20 hover:bg-green-500/20'
            : 'bg-green-50 border border-green-200 hover:bg-green-100'
          : isDark
            ? 'bg-white/5 border border-white/10 hover:bg-white/10'
            : 'bg-white border border-gray-200 hover:bg-gray-50'
      }`}
    >
      {/* Type Icon or Completed Check */}
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
          item.isCompleted
            ? 'bg-green-100 text-green-600'
            : isDark ? 'bg-white/10 text-gray-400' : 'bg-gray-100 text-gray-500'
        }`}
      >
        {item.isCompleted ? <CheckCircle className="w-5 h-5" /> : getTypeIcon(item.itemType, item.isFolder)}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className={`font-medium text-sm truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {item.itemName}
        </h4>
        {item.duration && (
          <p className={`text-xs mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {formatDuration(item.duration)}
          </p>
        )}
      </div>

      {/* Arrow */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <ChevronRight className={`w-5 h-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
      </div>
    </div>
  );
}

export function LearningDetailPage() {
  const { enrollmentId } = useParams<{ enrollmentId: string }>();
  const navigate = useNavigate();
  const { prefixPath } = useSubdomainPath();
  const { t } = useTranslation();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  const statusLabels: Record<EnrollmentStatus, string> = {
    PENDING: t.learning.statusPending,
    APPROVED: t.learning.statusApproved,
    REJECTED: t.learning.statusRejected,
    CANCELLED: t.learning.statusCancelled,
    COMPLETED: t.learning.statusCompleted,
  };

  // Enrollment + Program + snapshotId 조회
  const { data: playerData, isLoading, isError } = useEnrollmentForPlayer(Number(enrollmentId));
  const cancelEnrollment = useCancelEnrollment();

  // snapshotId가 있으면 스냅샷 아이템 조회
  const snapshotId = playerData?.snapshotId ?? 0;

  // 스냅샷 아이템 조회
  // axiosInstance가 ApiResponse wrapper를 자동으로 언래핑하므로 .data만 사용
  const { data: snapshotItems, isLoading: itemsLoading } = useQuery({
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
  const { data: relationsData, isLoading: relationsLoading } = useQuery({
    queryKey: ['snapshot', 'relations', 'ordered', snapshotId],
    queryFn: async () => {
      const response = await axiosInstance.get<SnapshotRelationsResponse>(
        API_ENDPOINTS.SNAPSHOTS.RELATIONS_ORDERED(snapshotId)
      );
      return response.data;
    },
    enabled: snapshotId > 0,
  });

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

  // 진도 데이터를 Map으로 변환
  const progressMap = useMemo(() => {
    const map = new Map<number, boolean>();
    itemsProgressData?.forEach((item) => {
      map.set(item.itemId, item.completed);
    });
    return map;
  }, [itemsProgressData]);

  // 순서가 있는 커리큘럼 아이템 목록 생성
  const curriculumItems = useMemo((): CurriculumDisplayItem[] => {
    if (!snapshotItems) return [];

    // 아이템을 평탄화
    const flatItems: CurriculumDisplayItem[] = [];
    let seq = 1;

    const flattenItems = (items: SnapshotItemResponse[]) => {
      items.forEach((item) => {
        // displayName이 있으면 우선 사용, 없으면 itemName(파일명) 사용
        const displayName = item.snapshotLearningObject?.displayName || item.itemName;
        flatItems.push({
          itemId: item.itemId,
          itemName: displayName,
          itemType: item.itemType,
          duration: item.snapshotLearningObject?.duration ?? null,
          isFolder: item.isFolder,
          seq: seq++,
          isCompleted: progressMap.get(item.itemId) ?? false,
        });
        if (item.children && item.children.length > 0) {
          flattenItems(item.children);
        }
      });
    };
    flattenItems(snapshotItems);

    // relationsData가 있으면 순서대로, 없으면 평탄화된 순서대로 반환
    if (relationsData?.orderedItems && relationsData.orderedItems.length > 0) {
      const itemsMap = new Map<number, CurriculumDisplayItem>();
      flatItems.forEach(item => itemsMap.set(item.itemId, item));

      return relationsData.orderedItems
        .map((orderedItem) => {
          const item = itemsMap.get(orderedItem.itemId);
          if (!item) return null;
          return { ...item, seq: orderedItem.seq, isCompleted: progressMap.get(orderedItem.itemId) ?? false };
        })
        .filter((item): item is CurriculumDisplayItem => item !== null);
    }

    return flatItems;
  }, [snapshotItems, relationsData, progressMap]);

  // enrollment 형태로 변환 (기존 코드 호환용)
  const enrollment = playerData ? {
    id: playerData.enrollmentId,
    programTitle: playerData.programTitle,
    courseTimeName: playerData.courseTimeName,
    status: playerData.status as EnrollmentStatus,
    progress: playerData.progressPercent,
    startDate: playerData.classStartDate,
    endDate: playerData.classEndDate,
    enrolledAt: playerData.enrolledAt,
  } : null;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  };

  const handleCancel = async () => {
    if (!enrollment) return;

    try {
      await cancelEnrollment.mutateAsync(enrollment.id);
      setCancelDialogOpen(false);
      navigate(prefixPath('/tu/b2c/mypage/learning'));
    } catch (error) {
      console.error('Failed to cancel enrollment:', error);
    }
  };

  const handleContinueLearning = () => {
    // 플레이어 페이지로 이동 (첫 아이템 선택은 플레이어에서 자동 처리)
    navigate(`/tu/b2c/mypage/learning/${enrollmentId}/player`);
  };

  // Loading State
  if (isLoading) {
    return (
      <div className={`flex items-center justify-center min-h-full ${isDark ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
        <Loader2 className={`w-8 h-8 animate-spin ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
      </div>
    );
  }

  // Error State
  if (isError || !enrollment) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-full ${isDark ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
        <BookOpen className={`w-16 h-16 mb-4 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
        <h3 className={`text-lg font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {t.learning.enrollmentNotFound}
        </h3>
        <Button onClick={() => navigate(prefixPath('/tu/b2c/mypage/learning'))}>
          {t.learning.backToLearning}
        </Button>
      </div>
    );
  }

  // 실제 enrollment 데이터에서 진도율 가져오기 (API 데이터 우선)
  const progressPercent = enrollment.progress ?? 0;

  return (
    <div className={`min-h-full p-6 sm:p-10 ${isDark ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
      <div className="max-w-[1200px] mx-auto">
        {/* Back Button */}
        <BackButton
          onClick={() => navigate(prefixPath('/tu/b2c/mypage/learning'))}
          label={t.learning.backToLearning}
          className={`mb-6 ${isDark ? 'text-gray-400 hover:text-white hover:bg-white/10' : ''}`}
        />

        {/* Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Course Info Card */}
          <Card
            className={`lg:col-span-2 ${
              isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
            }`}
          >
            <CardContent className="p-6">
              {/* Status Badge */}
              <Badge variant={statusColors[enrollment.status]} className="mb-4 flex items-center gap-1 w-fit">
                {statusIcons[enrollment.status]}
                {statusLabels[enrollment.status]}
              </Badge>

              {/* Program Title */}
              <h1 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {enrollment.programTitle}
              </h1>

              {/* Course Time Name */}
              <p className={`text-base mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {enrollment.courseTimeName}
              </p>

              {/* Date Info */}
              <div className={`flex flex-wrap items-center gap-6 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {t.learning.enrollmentPeriod}: {formatDate(enrollment.startDate)} ~ {formatDate(enrollment.endDate)}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {t.learning.enrolledDate}: {formatDate(enrollment.enrolledAt)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Progress Card */}
          <Card className={isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}>
            <CardContent className="p-6">
              <h3 className={`text-sm font-medium mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {t.learning.learningProgress}
              </h3>

              {/* Progress Circle */}
              <div className="flex items-center justify-center mb-4">
                <div
                  className="relative w-32 h-32 rounded-full flex items-center justify-center"
                  style={{
                    background: `conic-gradient(${progressPercent === 100 ? '#22c55e' : '#6778ff'} ${progressPercent * 3.6}deg, ${isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb'} 0deg)`,
                  }}
                >
                  <div
                    className={`w-24 h-24 rounded-full flex items-center justify-center ${
                      isDark ? 'bg-[#1e1e1e]' : 'bg-white'
                    }`}
                  >
                    <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {progressPercent}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className={`text-center text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {progressPercent === 100 ? t.learning.statusCompleted : `${progressPercent}% ${t.learning.completed}`}
              </div>

              {/* Continue Button */}
              {enrollment.status === 'APPROVED' && (
                <Button
                  variant="brand"
                  className="w-full mt-4"
                  onClick={handleContinueLearning}
                >
                  <PlayCircle className="w-4 h-4 mr-2" />
                  {t.learning.continueLearning}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Curriculum Section */}
        <Card className={`mb-8 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}>
          <CardHeader>
            <CardTitle className={isDark ? 'text-white' : 'text-gray-900'}>
              {t.learning.curriculum}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            {(itemsLoading || relationsLoading) ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className={`w-6 h-6 animate-spin ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              </div>
            ) : curriculumItems.length > 0 ? (
              <div className="space-y-3">
                {curriculumItems.map((item) => (
                  <CurriculumListItem
                    key={item.itemId}
                    item={item}
                    isDark={isDark}
                    onClick={() => navigate(`/tu/b2c/mypage/learning/${enrollmentId}/player/${item.itemId}`)}
                  />
                ))}
              </div>
            ) : (
              <div className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {snapshotId === 0 ? '프로그램에 스냅샷이 연결되지 않았습니다.' : '커리큘럼이 없습니다.'}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions Section */}
        {(enrollment.status === 'PENDING' || enrollment.status === 'APPROVED') && (
          <div className="flex justify-end gap-4">
            <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className={
                    isDark
                      ? 'text-red-400 border-red-400/30 hover:bg-red-400/10'
                      : 'text-red-600 border-red-200 hover:bg-red-50'
                  }
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  {t.learning.cancelEnrollment}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className={isDark ? 'bg-[#2a2a2a] border-white/10' : ''}>
                <AlertDialogHeader>
                  <AlertDialogTitle className={isDark ? 'text-white' : ''}>
                    {t.learning.cancelConfirmTitle}
                  </AlertDialogTitle>
                  <AlertDialogDescription className={isDark ? 'text-gray-400' : ''}>
                    {t.learning.cancelConfirmDesc}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className={isDark ? 'bg-white/10 border-white/10 text-white hover:bg-white/20' : ''}>
                    {t.common.cancel}
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleCancel}
                    className="bg-red-600 hover:bg-red-700"
                    disabled={cancelEnrollment.isPending}
                  >
                    {cancelEnrollment.isPending ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : null}
                    {t.learning.cancelEnrollment}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>
    </div>
  );
}
