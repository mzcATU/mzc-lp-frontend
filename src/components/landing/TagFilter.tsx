import { X } from 'lucide-react';
import { useTranslation } from '@/store/common/languageStore';

export interface Tag {
  id: string;
  label: string;
  count?: number;  // 해당 태그의 콘텐츠 수 (선택적)
}

interface TagFilterProps {
  tags: Tag[];
  selectedTags: string[];
  onTagSelect: (tagId: string) => void;
  onTagDeselect: (tagId: string) => void;
  onClearAll?: () => void;

  // 스타일 옵션
  style?: 'CHIP' | 'HASHTAG';  // CHIP: 둥근 버튼, HASHTAG: #태그 스타일
  multiSelect?: boolean;       // 다중 선택 가능 여부
  showCount?: boolean;         // 콘텐츠 수 표시 여부
  showAllOption?: boolean;     // "전체" 옵션 표시 여부
}

export function TagFilter({
  tags,
  selectedTags,
  onTagSelect,
  onTagDeselect,
  onClearAll,
  style = 'CHIP',
  multiSelect = true,
  showCount = false,
  showAllOption = true,
}: TagFilterProps) {
  const { t } = useTranslation();

  const handleTagClick = (tagId: string) => {
    if (tagId === 'all') {
      // "전체" 클릭 시 모든 선택 해제
      onClearAll?.();
      return;
    }

    if (selectedTags.includes(tagId)) {
      onTagDeselect(tagId);
    } else {
      if (multiSelect) {
        onTagSelect(tagId);
      } else {
        // 단일 선택: 기존 선택 해제 후 새로 선택
        onClearAll?.();
        onTagSelect(tagId);
      }
    }
  };

  const isAllSelected = selectedTags.length === 0;

  if (style === 'HASHTAG') {
    return (
      <div className="flex flex-wrap items-center gap-2">
        {/* 전체 옵션 */}
        {showAllOption && (
          <button
            onClick={() => handleTagClick('all')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200
              ${isAllSelected
                ? 'bg-[#6778ff] text-white'
                : 'landing-badge-bg landing-text-muted hover:landing-text-primary'
              }`}
          >
            {t.landing.all}
          </button>
        )}

        {/* 태그 목록 */}
        {tags.map((tag) => {
          const isSelected = selectedTags.includes(tag.id);
          return (
            <button
              key={tag.id}
              onClick={() => handleTagClick(tag.id)}
              className={`px-3 py-1.5 rounded-md text-sm transition-all duration-200 flex items-center gap-1
                ${isSelected
                  ? 'bg-[#6778ff]/20 text-[#6778ff] font-medium'
                  : 'landing-badge-bg landing-text-muted hover:text-[#6778ff]'
                }`}
            >
              <span>#{tag.label}</span>
              {showCount && tag.count !== undefined && (
                <span className="text-xs opacity-60">({tag.count})</span>
              )}
              {isSelected && multiSelect && (
                <X className="w-3 h-3 ml-1 hover:opacity-70" />
              )}
            </button>
          );
        })}

        {/* 선택된 태그 초기화 버튼 */}
        {selectedTags.length > 0 && multiSelect && (
          <button
            onClick={onClearAll}
            className="px-2 py-1 text-xs landing-text-muted hover:landing-text-primary transition-colors"
          >
            {t.landing.clearFilter || '초기화'}
          </button>
        )}
      </div>
    );
  }

  // CHIP 스타일 (기본 - B2C 스타일)
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* 전체 옵션 */}
      {showAllOption && (
        <button
          onClick={() => handleTagClick('all')}
          className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300
            ${isAllSelected
              ? 'landing-btn-primary shadow-lg'
              : 'landing-chip-inactive'
            }`}
        >
          {t.landing.all}
        </button>
      )}

      {/* 태그 목록 */}
      {tags.map((tag) => {
        const isSelected = selectedTags.includes(tag.id);
        return (
          <button
            key={tag.id}
            onClick={() => handleTagClick(tag.id)}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300
              ${isSelected
                ? 'landing-btn-primary shadow-lg'
                : 'landing-chip-inactive'
              }`}
          >
            {tag.label}
            {showCount && tag.count !== undefined && (
              <span className="ml-1 opacity-60">({tag.count})</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
