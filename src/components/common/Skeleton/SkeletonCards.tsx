import { cn } from '@/utils/cn';
import { useThemeStore } from '@/store/common/themeStore';

interface SkeletonCardProps {
  className?: string;
}

/**
 * 강의 카드 스켈레톤
 */
export function CourseCardSkeleton({ className }: SkeletonCardProps) {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const baseClass = isDark ? 'bg-white/5' : 'bg-gray-200';

  return (
    <div className={cn(
      'rounded-xl overflow-hidden border',
      isDark ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-200',
      className
    )}>
      {/* 썸네일 */}
      <div className={cn('aspect-video animate-pulse', baseClass)} />

      {/* 콘텐츠 */}
      <div className="p-4 space-y-3">
        {/* 카테고리 */}
        <div className={cn('h-5 w-16 rounded-full animate-pulse', baseClass)} />

        {/* 제목 */}
        <div className="space-y-2">
          <div className={cn('h-4 w-full rounded animate-pulse', baseClass)} />
          <div className={cn('h-4 w-3/4 rounded animate-pulse', baseClass)} />
        </div>

        {/* 강사 */}
        <div className="flex items-center gap-2 pt-2">
          <div className={cn('w-6 h-6 rounded-full animate-pulse', baseClass)} />
          <div className={cn('h-3 w-20 rounded animate-pulse', baseClass)} />
        </div>

        {/* 가격/평점 */}
        <div className="flex items-center justify-between pt-2">
          <div className={cn('h-5 w-16 rounded animate-pulse', baseClass)} />
          <div className={cn('h-4 w-12 rounded animate-pulse', baseClass)} />
        </div>
      </div>
    </div>
  );
}

/**
 * 테이블 행 스켈레톤
 */
export function TableRowSkeleton({ className }: SkeletonCardProps) {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const baseClass = isDark ? 'bg-white/5' : 'bg-gray-200';

  return (
    <div className={cn(
      'flex items-center gap-4 p-4 border-b',
      isDark ? 'border-white/10' : 'border-gray-200',
      className
    )}>
      <div className={cn('w-10 h-10 rounded-lg animate-pulse', baseClass)} />
      <div className="flex-1 space-y-2">
        <div className={cn('h-4 w-1/3 rounded animate-pulse', baseClass)} />
        <div className={cn('h-3 w-1/4 rounded animate-pulse', baseClass)} />
      </div>
      <div className={cn('h-8 w-20 rounded animate-pulse', baseClass)} />
    </div>
  );
}

/**
 * 통계 카드 스켈레톤
 */
export function StatsCardSkeleton({ className }: SkeletonCardProps) {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const baseClass = isDark ? 'bg-white/5' : 'bg-gray-200';

  return (
    <div className={cn(
      'rounded-xl p-5 border',
      isDark ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-200',
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <div className={cn('h-3 w-20 rounded animate-pulse', baseClass)} />
          <div className={cn('h-8 w-24 rounded animate-pulse', baseClass)} />
        </div>
        <div className={cn('w-10 h-10 rounded-lg animate-pulse', baseClass)} />
      </div>
      <div className={cn('h-3 w-32 rounded animate-pulse mt-4', baseClass)} />
    </div>
  );
}

/**
 * 프로필 카드 스켈레톤
 */
export function ProfileCardSkeleton({ className }: SkeletonCardProps) {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const baseClass = isDark ? 'bg-white/5' : 'bg-gray-200';

  return (
    <div className={cn(
      'rounded-xl p-6 border',
      isDark ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-200',
      className
    )}>
      <div className="flex items-center gap-4">
        <div className={cn('w-16 h-16 rounded-full animate-pulse', baseClass)} />
        <div className="space-y-2">
          <div className={cn('h-5 w-32 rounded animate-pulse', baseClass)} />
          <div className={cn('h-4 w-40 rounded animate-pulse', baseClass)} />
        </div>
      </div>
    </div>
  );
}

/**
 * 리스트 아이템 스켈레톤
 */
export function ListItemSkeleton({ className }: SkeletonCardProps) {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const baseClass = isDark ? 'bg-white/5' : 'bg-gray-200';

  return (
    <div className={cn(
      'flex items-center gap-3 p-3 rounded-lg',
      className
    )}>
      <div className={cn('w-8 h-8 rounded animate-pulse', baseClass)} />
      <div className="flex-1 space-y-1.5">
        <div className={cn('h-4 w-2/3 rounded animate-pulse', baseClass)} />
        <div className={cn('h-3 w-1/2 rounded animate-pulse', baseClass)} />
      </div>
    </div>
  );
}

/**
 * 페이지 로딩 스켈레톤 (전체 화면)
 */
export function PageLoadingSkeleton() {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <div className={cn(
      'min-h-screen flex items-center justify-center',
      isDark ? 'bg-[#0a0a0a]' : 'bg-gray-50'
    )}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6778ff] via-[#a855f7] to-[#6bc2f0] flex items-center justify-center animate-pulse">
          <span className="text-white font-bold text-xl">M</span>
        </div>
        <div className={cn(
          'h-1 w-32 rounded-full overflow-hidden',
          isDark ? 'bg-white/10' : 'bg-gray-200'
        )}>
          <div className="h-full w-1/2 bg-gradient-to-r from-[#6778ff] to-[#a855f7] animate-[loading_1s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  );
}
