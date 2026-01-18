import { PlayCircle, Video, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSubdomainPath } from '@/hooks/common';
import type { CurriculumItemResponse } from '@/types/tu/courseTimeCatalog.types';

interface B2BCurriculumSectionProps {
  curriculum: CurriculumItemResponse[];
  enrollmentId?: number;
  onItemClick?: (itemId: number) => void;
  isDark: boolean;
}

function formatDuration(seconds?: number): string {
  if (!seconds) return '-';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}분`;
  const hours = Math.floor(minutes / 60);
  const remainMinutes = minutes % 60;
  return remainMinutes > 0 ? `${hours}시간 ${remainMinutes}분` : `${hours}시간`;
}

function getIcon(isFolder: boolean, isDark: boolean) {
  if (isFolder) {
    return <BookOpen className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />;
  }
  // TODO: itemType에 따라 아이콘 분기 (백엔드 API 확장 시)
  return <Video className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />;
}

function flattenCurriculum(items: CurriculumItemResponse[]): CurriculumItemResponse[] {
  const result: CurriculumItemResponse[] = [];

  items.forEach((item) => {
    result.push(item);
    if (item.children && item.children.length > 0) {
      result.push(...flattenCurriculum(item.children));
    }
  });

  return result;
}

export function B2BCurriculumSection({ curriculum, enrollmentId, onItemClick, isDark }: B2BCurriculumSectionProps) {
  const navigate = useNavigate();
  const { prefixPath } = useSubdomainPath();

  // 트리 구조를 평탄화
  const flatItems = flattenCurriculum(curriculum);
  const totalItems = flatItems.filter(item => !item.isFolder).length;

  // TODO: 실제 진도율 API 연동 시 교체
  const completedCount = 0;
  const progressPercent = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

  const handleStartLearning = () => {
    if (!enrollmentId) {
      console.warn('Enrollment ID is required to start learning');
      return;
    }
    // B2B 학습 플레이어로 이동
    navigate(prefixPath(`/tu/b2b/player/${enrollmentId}`));
  };

  const renderItem = (item: CurriculumItemResponse, depth: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.id}>
        <button
          onClick={() => !item.isFolder && onItemClick?.(item.id)}
          disabled={item.isFolder}
          className={`w-full px-6 py-3 flex items-center gap-3 transition-colors border-b ${
            isDark ? 'border-white/5 hover:bg-white/5' : 'border-gray-100 hover:bg-gray-50'
          } ${item.isFolder ? 'cursor-default' : 'cursor-pointer'}`}
          style={{ paddingLeft: `${24 + depth * 16}px` }}
        >
          <div className="shrink-0">{getIcon(item.isFolder, isDark)}</div>

          <div className="flex-1 min-w-0 text-left">
            <p
              className={`text-sm font-medium truncate ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
            >
              {item.itemName}
            </p>
            {item.duration != null && item.duration > 0 && (
              <p className={`text-xs mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                {formatDuration(item.duration)}
              </p>
            )}
          </div>

          {!item.isFolder && (
            <div
              className={`w-5 h-5 rounded-full border-2 shrink-0 ${
                isDark ? 'border-white/20' : 'border-gray-300'
              }`}
            />
          )}
        </button>

        {hasChildren && item.children!.map((child) => renderItem(child, depth + 1))}
      </div>
    );
  };

  return (
    <div
      className={`rounded-2xl overflow-hidden border ${
        isDark ? 'glass border-white/10' : 'bg-white border-gray-200 shadow-lg'
      }`}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            📚 커리큘럼
          </h3>
          <span
            className={`text-xs px-3 py-1 rounded-full font-semibold ${
              isDark ? 'bg-[#6778ff]/20 text-[#a0b0ff]' : 'bg-purple-100 text-purple-700'
            }`}
          >
            {totalItems}개 강의
          </span>
        </div>

        {/* 전체 진도율 */}
        <div className="mb-5">
          <div className="flex justify-between items-center mb-2">
            <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              전체 진도율
            </span>
            <span className={`text-sm font-bold ${isDark ? 'text-[#6778ff]' : 'text-purple-600'}`}>
              {progressPercent}%
            </span>
          </div>
          <div
            className={`w-full h-2.5 rounded-full overflow-hidden ${
              isDark ? 'bg-white/10' : 'bg-gray-200'
            }`}
          >
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className={`text-xs text-center mt-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            {completedCount > 0 ? `${completedCount}/${totalItems}개 완료` : '학습을 시작해보세요!'}
          </p>
        </div>

        {/* 학습 시작 버튼 */}
        <button
          onClick={handleStartLearning}
          className="w-full py-3.5 rounded-xl font-bold text-white flex items-center justify-center gap-2 bg-gradient-to-r from-[#667eea] to-[#764ba2] hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
        >
          <PlayCircle className="w-5 h-5" />
          학습 시작하기
        </button>
      </div>

      {/* 커리큘럼 목록 */}
      <div className="max-h-[500px] overflow-y-auto">
        {curriculum.map((item) => renderItem(item, 0))}
      </div>

      {totalItems === 0 && (
        <div className="p-8 text-center">
          <BookOpen className={`w-12 h-12 mx-auto mb-3 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
          <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            아직 등록된 강의가 없습니다
          </p>
        </div>
      )}
    </div>
  );
}
