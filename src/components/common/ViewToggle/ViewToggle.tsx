import { LayoutGrid, List } from 'lucide-react';
import { cn } from '@/utils/cn';

type ViewMode = 'grid' | 'list';

interface ViewToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  gridLabel?: string;
  listLabel?: string;
  className?: string;
}

export function ViewToggle({
  viewMode,
  onViewModeChange,
  gridLabel = '카드',
  listLabel = '리스트',
  className,
}: Readonly<ViewToggleProps>) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <button
        type="button"
        onClick={() => onViewModeChange('list')}
        className={cn(
          'inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors border border-border',
          viewMode === 'list'
            ? 'bg-btn-neutral text-white'
            : 'bg-transparent text-text-primary hover:bg-bg-secondary'
        )}
      >
        <List size={16} />
        <span>{listLabel}</span>
      </button>
      <button
        type="button"
        onClick={() => onViewModeChange('grid')}
        className={cn(
          'inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors border border-border',
          viewMode === 'grid'
            ? 'bg-btn-neutral text-white'
            : 'bg-transparent text-text-primary hover:bg-bg-secondary'
        )}
      >
        <LayoutGrid size={16} />
        <span>{gridLabel}</span>
      </button>
    </div>
  );
}
