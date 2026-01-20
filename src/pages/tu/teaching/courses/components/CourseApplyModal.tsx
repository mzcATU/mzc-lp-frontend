/**
 * 과정 등록 확인 모달
 * - 전체 정보 요약 표시
 * - 필수 항목 누락 시 경고
 * - 재확인 AlertDialog 포함
 */
import { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  Tag,
  Folder,
  File,
  ChevronRight,
  ChevronDown,
  Award,
  MessageSquare,
  Send,
  Loader2,
} from 'lucide-react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Alert,
  AlertDescription,
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/common';
import type { CourseDetailResponse, CourseItemHierarchyResponse } from '@/types/common/course.types';
import type { CategoryResponse } from '@/types/common';

// 난이도 레이블
const LEVEL_LABELS: Record<string, string> = {
  BEGINNER: '초급',
  INTERMEDIATE: '중급',
  ADVANCED: '고급',
};

/** 커리큘럼 아이템 수 계산 */
function countCurriculumItems(items: CourseItemHierarchyResponse[]): { folders: number; contents: number } {
  let folders = 0;
  let contents = 0;
  for (const item of items) {
    if (item.isFolder) {
      folders++;
      const childCounts = countCurriculumItems(item.children);
      folders += childCounts.folders;
      contents += childCounts.contents;
    } else {
      contents++;
    }
  }
  return { folders, contents };
}

/** 트리 아이템 렌더링 컴포넌트 */
function CurriculumTreeItem({
  item,
  depth = 0,
  expandedIds,
  onToggle,
}: {
  item: CourseItemHierarchyResponse;
  depth?: number;
  expandedIds: Set<number>;
  onToggle: (id: number) => void;
}) {
  const isExpanded = expandedIds.has(item.itemId);

  return (
    <div>
      <div
        className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-bg-secondary"
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        {item.isFolder ? (
          <button
            type="button"
            onClick={() => onToggle(item.itemId)}
            className="p-0.5 hover:bg-bg-secondary rounded"
          >
            {isExpanded ? (
              <ChevronDown size={14} className="text-text-secondary" />
            ) : (
              <ChevronRight size={14} className="text-text-secondary" />
            )}
          </button>
        ) : (
          <span className="w-5" />
        )}
        {item.isFolder ? (
          <Folder size={16} className="text-yellow-500 shrink-0" />
        ) : (
          <File size={16} className="text-blue-500 shrink-0" />
        )}
        <span className="text-text-primary text-sm truncate">
          {item.displayName || item.itemName}
        </span>
      </div>
      {item.isFolder && isExpanded && item.children.length > 0 && (
        <div>
          {item.children.map((child) => (
            <CurriculumTreeItem
              key={child.itemId}
              item={child}
              depth={depth + 1}
              expandedIds={expandedIds}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface CourseApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: CourseDetailResponse;
  curriculum: CourseItemHierarchyResponse[];
  categories: CategoryResponse[];
  onApply: () => Promise<void>;
  isApplying: boolean;
}

export function CourseApplyModal({
  isOpen,
  onClose,
  course,
  curriculum,
  categories,
  onApply,
  isApplying,
}: Readonly<CourseApplyModalProps>) {
  // 재확인 AlertDialog 상태
  const [showConfirm, setShowConfirm] = useState(false);

  // 폴더 확장 상태 관리 (기본: 모두 확장)
  const [expandedIds, setExpandedIds] = useState<Set<number>>(() => {
    const ids = new Set<number>();
    const collectFolderIds = (items: CourseItemHierarchyResponse[]) => {
      for (const item of items) {
        if (item.isFolder) {
          ids.add(item.itemId);
          collectFolderIds(item.children);
        }
      }
    };
    collectFolderIds(curriculum);
    return ids;
  });

  const handleToggleExpand = (id: number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // 커리큘럼 아이템 수
  const itemCounts = countCurriculumItems(curriculum);

  // 경고 메시지 계산
  const warnings: string[] = [];
  if (!course.title) warnings.push('강의명이 입력되지 않았습니다.');
  if (!course.categoryId) warnings.push('카테고리가 선택되지 않았습니다.');
  if (curriculum.length === 0) warnings.push('커리큘럼이 비어있습니다.');

  // 카테고리 이름
  const categoryName = course.categoryId
    ? categories.find((cat) => cat.id === course.categoryId)?.name
    : null;

  // 난이도 레이블
  const levelLabel = course.level ? LEVEL_LABELS[course.level] : null;

  // 등록하기 버튼 클릭
  const handleApplyClick = () => {
    setShowConfirm(true);
  };

  // 최종 확인 후 등록
  const handleConfirmApply = async () => {
    setShowConfirm(false);
    await onApply();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Send size={20} className="text-action-primary" />
              과정 등록 확인
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-auto space-y-4 py-4">
            {/* 경고 메시지 또는 완료 메시지 */}
            {warnings.length > 0 ? (
              <Alert variant="destructive" className="bg-red-50 border-red-200">
                <AlertTriangle size={16} />
                <AlertDescription>
                  <strong>등록 전 확인이 필요합니다</strong>
                  <ul className="mt-2 mb-0 pl-4 list-disc">
                    {warnings.map((warning, index) => (
                      <li key={index}>{warning}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            ) : (
              <Alert variant="default" className="bg-green-50 border-green-200">
                <CheckCircle2 size={16} className="text-green-600" />
                <AlertDescription>
                  <strong className="text-green-700">등록 준비가 완료되었습니다</strong>
                  <p className="mt-1 mb-0 text-green-600">
                    모든 필수 정보가 입력되었습니다. 등록을 진행해주세요.
                  </p>
                </AlertDescription>
              </Alert>
            )}

            {/* 기본 정보 섹션 */}
            <div className="border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen size={18} className="text-action-primary" />
                <h3 className="text-text-primary font-medium">기본 정보</h3>
              </div>

              <div className="space-y-3">
                {/* 강의명 */}
                <div className="flex items-start gap-3 p-3 bg-bg-secondary rounded-lg">
                  <BookOpen size={16} className="mt-0.5 shrink-0 text-purple-600" />
                  <div className="flex-1 min-w-0">
                    <p className="text-text-secondary text-xs mb-1">강의명</p>
                    <p className="text-text-primary font-medium m-0 text-sm">
                      {course.title || <span className="text-text-tertiary italic">미입력</span>}
                    </p>
                  </div>
                </div>

                {/* 강의 소개 */}
                {course.description && (
                  <div className="flex items-start gap-3 p-3 bg-bg-secondary rounded-lg">
                    <MessageSquare size={16} className="mt-0.5 shrink-0 text-purple-700" />
                    <div className="flex-1 min-w-0">
                      <p className="text-text-secondary text-xs mb-1">강의 소개</p>
                      <p className="text-text-primary text-sm m-0 whitespace-pre-wrap leading-relaxed line-clamp-3">
                        {course.description}
                      </p>
                    </div>
                  </div>
                )}

                {/* 2열 그리드: 카테고리, 난이도 */}
                <div className="grid grid-cols-2 gap-3">
                  {/* 카테고리 */}
                  <div className="flex items-start gap-3 p-3 bg-bg-secondary rounded-lg">
                    <Folder size={16} className="mt-0.5 shrink-0 text-orange-500" />
                    <div className="flex-1 min-w-0">
                      <p className="text-text-secondary text-xs mb-1">카테고리</p>
                      <p className="text-text-primary font-medium m-0 text-sm truncate">
                        {categoryName || <span className="text-text-tertiary italic">미선택</span>}
                      </p>
                    </div>
                  </div>

                  {/* 난이도 */}
                  <div className="flex items-start gap-3 p-3 bg-bg-secondary rounded-lg">
                    <Award size={16} className="mt-0.5 shrink-0 text-green-600" />
                    <div className="flex-1 min-w-0">
                      <p className="text-text-secondary text-xs mb-1">난이도</p>
                      <p className="text-text-primary font-medium m-0 text-sm truncate">
                        {levelLabel || <span className="text-text-tertiary italic">미선택</span>}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 태그 */}
                {course.tags && course.tags.length > 0 && (
                  <div className="flex items-start gap-3 p-3 bg-bg-secondary rounded-lg">
                    <Tag size={16} className="mt-0.5 shrink-0 text-pink-500" />
                    <div className="flex-1 min-w-0">
                      <p className="text-text-secondary text-xs mb-1">태그</p>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {course.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-0.5 bg-bg-default text-text-primary text-xs rounded-md"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 커리큘럼 섹션 */}
            <div className="border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <Folder size={18} className="text-action-primary" />
                <h3 className="text-text-primary font-medium">커리큘럼</h3>
                {curriculum.length > 0 && (
                  <span className="text-text-secondary text-sm">
                    (차시: {itemCounts.folders}, 콘텐츠: {itemCounts.contents})
                  </span>
                )}
              </div>

              {curriculum.length > 0 ? (
                <div className="border border-border rounded-lg p-2 max-h-48 overflow-auto">
                  {curriculum.map((item) => (
                    <CurriculumTreeItem
                      key={item.itemId}
                      item={item}
                      expandedIds={expandedIds}
                      onToggle={handleToggleExpand}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-text-secondary">
                  커리큘럼이 비어있습니다.
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="border-t border-border pt-4">
            <Button variant="outline" onClick={onClose}>
              취소
            </Button>
            <Button
              onClick={handleApplyClick}
              disabled={warnings.length > 0 || isApplying}
            >
              {isApplying ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  등록 중...
                </>
              ) : (
                <>
                  <Send size={16} />
                  등록하기
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 재확인 AlertDialog */}
      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>과정을 등록하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                등록된 과정은 운영자가 차수를 개설할 수 있습니다.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmApply}>
              등록하기
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
