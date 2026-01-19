import { useState } from 'react';
import { BookOpen, Folder, FileText, ChevronRight, ChevronDown, Pencil, Eye } from 'lucide-react';
import { Button } from '@/components/common';
import type { CourseItemHierarchyResponse } from '@/types/common/course.types';

interface CourseCurriculumSectionProps {
  itemCount: number;
  curriculum: CourseItemHierarchyResponse[];
  onEdit?: () => void;
  onPreviewContent?: (item: CourseItemHierarchyResponse) => void;
}

// 폴더가 아닌 실제 콘텐츠(차시) 수만 카운트
function countContentItems(items: CourseItemHierarchyResponse[]): number {
  return items.reduce((count, item) => {
    if (item.isFolder) {
      // 폴더면 자식들만 카운트
      return count + countContentItems(item.children || []);
    }
    // 폴더가 아니면 1 + 자식들 카운트
    return count + 1 + countContentItems(item.children || []);
  }, 0);
}

// 재귀적으로 트리 아이템 렌더링
function CurriculumTreeItem({
  item,
  depth = 0,
  onPreviewContent,
}: {
  item: CourseItemHierarchyResponse;
  depth?: number;
  onPreviewContent?: (item: CourseItemHierarchyResponse) => void;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const paddingLeft = depth * 24;
  const Icon = item.isFolder ? Folder : FileText;
  const iconColor = item.isFolder ? 'text-amber-500' : 'text-text-secondary';
  // displayName이 있으면 우선 표시, 없으면 itemName 사용
  const displayName = item.displayName || item.itemName;
  const hasChildren = item.children && item.children.length > 0;
  const isToggleable = item.isFolder && hasChildren;

  const handleToggle = () => {
    if (isToggleable) {
      setIsOpen((prev) => !prev);
    }
  };

  return (
    <div>
      <div
        className={`flex items-start gap-2 py-2 px-3 hover:bg-bg-secondary rounded-md transition-colors ${isToggleable ? 'cursor-pointer' : ''}`}
        style={{ paddingLeft: `${paddingLeft + 12}px` }}
        onClick={handleToggle}
      >
        {isToggleable && (
          isOpen ? (
            <ChevronDown size={16} className="text-text-secondary mt-0.5 flex-shrink-0" />
          ) : (
            <ChevronRight size={16} className="text-text-secondary mt-0.5 flex-shrink-0" />
          )
        )}
        <Icon size={16} className={`${iconColor} mt-0.5 flex-shrink-0`} />
        <div className="flex-1 min-w-0">
          <span className="text-text-primary text-sm block">{displayName}</span>
          {item.displayName && item.displayName !== item.itemName && (
            <span className="text-text-tertiary text-xs block truncate">
              원본: {item.itemName}
            </span>
          )}
          {item.description && (
            <span className="text-text-secondary text-xs block mt-0.5">
              {item.description}
            </span>
          )}
        </div>
        {/* 콘텐츠(폴더가 아닌 경우)에 미리보기 버튼 */}
        {!item.isFolder && item.learningObjectId && onPreviewContent && (
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto shrink-0 h-6 px-2"
            onClick={(e) => {
              e.stopPropagation();
              onPreviewContent(item);
            }}
          >
            <Eye size={14} />
          </Button>
        )}
      </div>
      {hasChildren && isOpen && (
        <div>
          {item.children.map((child) => (
            <CurriculumTreeItem
              key={child.itemId}
              item={child}
              depth={depth + 1}
              onPreviewContent={onPreviewContent}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function CourseCurriculumSection({
  itemCount,
  curriculum,
  onEdit,
  onPreviewContent,
}: Readonly<CourseCurriculumSectionProps>) {
  // 커리큘럼 트리에서 실제 콘텐츠 수 계산 (폴더 제외)
  const actualContentCount = countContentItems(curriculum);
  // 계산된 값이 있으면 사용, 없으면 props의 itemCount 사용
  const displayCount = actualContentCount > 0 ? actualContentCount : itemCount;

  return (
    <div className="bg-bg-default border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-text-primary text-lg font-medium flex items-center gap-2">
          <BookOpen size={20} />
          커리큘럼
          <span className="text-text-secondary font-normal">({displayCount}차시)</span>
        </h2>
        {onEdit && (
          <Button variant="ghost" size="sm" onClick={onEdit} className="border border-border">
            <Pencil size={14} />
            수정
          </Button>
        )}
      </div>

      {curriculum.length > 0 ? (
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="max-h-96 overflow-auto">
            {curriculum.map((item) => (
              <CurriculumTreeItem
                key={item.itemId}
                item={item}
                onPreviewContent={onPreviewContent}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-text-secondary">
          <BookOpen size={48} className="mx-auto mb-3 opacity-50" />
          <p>등록된 커리큘럼이 없습니다.</p>
        </div>
      )}
    </div>
  );
}
