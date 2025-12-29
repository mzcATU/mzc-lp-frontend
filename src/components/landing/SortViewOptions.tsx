import { Grid, List, ChevronDown } from 'lucide-react';
import { cn } from '@/utils';

export type SortOption = 'latest' | 'popular' | 'name';
export type ViewMode = 'grid' | 'list';

interface SortViewOptionsProps {
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  className?: string;
  /** 정렬 옵션 표시 여부 (기본: true) */
  showSort?: boolean;
  /** 뷰 모드 옵션 표시 여부 (기본: true) */
  showViewMode?: boolean;
}

const sortLabels: Record<SortOption, string> = {
  latest: '최신순',
  popular: '인기순',
  name: '이름순',
};

/**
 * 정렬 및 뷰 모드 선택 컴포넌트
 * - B2B 소셜러닝에서 콘텐츠 목록 상단에 사용
 */
export function SortViewOptions({
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  className,
  showSort = true,
  showViewMode = true,
}: SortViewOptionsProps) {
  return (
    <div className={cn('flex items-center gap-4', className)}>
      {/* 정렬 드롭다운 */}
      {showSort && (
        <div className="relative group">
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg landing-card-bg border border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors"
          >
            <span className="text-sm landing-text-primary">{sortLabels[sortBy]}</span>
            <ChevronDown className="w-4 h-4 landing-text-muted" />
          </button>

          {/* 드롭다운 메뉴 */}
          <div className="absolute top-full left-0 mt-1 w-32 py-1 rounded-lg landing-card-bg border border-neutral-200 dark:border-neutral-700 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
            {(Object.keys(sortLabels) as SortOption[]).map((option) => (
              <button
                key={option}
                onClick={() => onSortChange(option)}
                className={cn(
                  'w-full px-4 py-2 text-left text-sm transition-colors',
                  sortBy === option
                    ? 'landing-text-secondary font-medium bg-neutral-100 dark:bg-neutral-800'
                    : 'landing-text-primary hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
                )}
              >
                {sortLabels[option]}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 뷰 모드 토글 */}
      {showViewMode && (
        <div className="flex items-center rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden">
          <button
            onClick={() => onViewModeChange('grid')}
            className={cn(
              'p-2 transition-colors',
              viewMode === 'grid'
                ? 'bg-neutral-100 dark:bg-neutral-800 landing-text-secondary'
                : 'landing-text-muted hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
            )}
            aria-label="그리드 보기"
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={cn(
              'p-2 transition-colors',
              viewMode === 'list'
                ? 'bg-neutral-100 dark:bg-neutral-800 landing-text-secondary'
                : 'landing-text-muted hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
            )}
            aria-label="리스트 보기"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
