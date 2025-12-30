import { BookOpen, Folder, FileText } from 'lucide-react';
import type { CourseItemHierarchyResponse } from '@/types/common/course.types';

interface CourseCurriculumSectionProps {
  itemCount: number;
  curriculum: CourseItemHierarchyResponse[];
}

// 재귀적으로 트리 아이템 렌더링
function CurriculumTreeItem({
  item,
  depth = 0,
}: {
  item: CourseItemHierarchyResponse;
  depth?: number;
}) {
  const paddingLeft = depth * 24;
  const Icon = item.isFolder ? Folder : FileText;
  const iconColor = item.isFolder ? 'text-amber-500' : 'text-text-secondary';
  // displayName이 있으면 우선 표시, 없으면 itemName 사용
  const displayName = item.displayName || item.itemName;

  return (
    <div>
      <div
        className="flex items-start gap-2 py-2 px-3 hover:bg-bg-secondary rounded-md transition-colors"
        style={{ paddingLeft: `${paddingLeft + 12}px` }}
      >
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
      </div>
      {item.children && item.children.length > 0 && (
        <div>
          {item.children.map((child) => (
            <CurriculumTreeItem key={child.itemId} item={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function CourseCurriculumSection({
  itemCount,
  curriculum,
}: Readonly<CourseCurriculumSectionProps>) {
  return (
    <div className="bg-bg-default border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-text-primary text-lg font-medium flex items-center gap-2">
          <BookOpen size={20} />
          커리큘럼
          <span className="text-text-secondary font-normal">({itemCount}차시)</span>
        </h2>
      </div>

      {curriculum.length > 0 ? (
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="max-h-96 overflow-auto">
            {curriculum.map((item) => (
              <CurriculumTreeItem key={item.itemId} item={item} />
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
