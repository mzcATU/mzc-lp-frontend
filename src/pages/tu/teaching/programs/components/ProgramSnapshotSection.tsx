import { useState } from 'react';
import { Card, Label, Badge } from '@/components/common';
import { Layers, Folder, FileText, ChevronRight, ChevronDown, Hash, Clock } from 'lucide-react';
import type { SnapshotDetailResponse, SnapshotItemResponse } from '@/types/common';

interface ProgramSnapshotSectionProps {
  snapshot: SnapshotDetailResponse | null;
  language?: 'ko' | 'en';
}

const t = {
  snapshotInfo: { ko: '스냅샷 정보', en: 'Snapshot Info' },
  noSnapshot: { ko: '연결된 스냅샷이 없습니다.', en: 'No snapshot linked.' },
  snapshotName: { ko: '스냅샷명', en: 'Snapshot Name' },
  description: { ko: '설명', en: 'Description' },
  hashtags: { ko: '해시태그', en: 'Hashtags' },
  status: { ko: '상태', en: 'Status' },
  itemCount: { ko: '아이템 수', en: 'Item Count' },
  totalDuration: { ko: '총 학습시간', en: 'Total Duration' },
  curriculum: { ko: '커리큘럼', en: 'Curriculum' },
  noItems: { ko: '아이템이 없습니다.', en: 'No items.' },
  minutes: { ko: '분', en: 'min' },
  items: { ko: '개', en: 'items' },
};

const snapshotStatusLabels: Record<string, { ko: string; en: string }> = {
  DRAFT: { ko: '초안', en: 'Draft' },
  ACTIVE: { ko: '활성', en: 'Active' },
  COMPLETED: { ko: '완료', en: 'Completed' },
  ARCHIVED: { ko: '보관', en: 'Archived' },
};

interface SnapshotTreeItemProps {
  item: SnapshotItemResponse;
  language: 'ko' | 'en';
}

function SnapshotTreeItem({ item, language }: SnapshotTreeItemProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = item.children && item.children.length > 0;

  const getText = (key: keyof typeof t) => (language === 'ko' ? t[key].ko : t[key].en);

  return (
    <div className="select-none">
      <div
        className="flex items-center gap-2 py-2 px-3 hover:bg-bg-secondary rounded-md cursor-pointer"
        onClick={() => hasChildren && setIsExpanded(!isExpanded)}
      >
        {/* 확장/축소 아이콘 */}
        <span className="w-5 h-5 flex items-center justify-center">
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown size={16} className="text-text-secondary" />
            ) : (
              <ChevronRight size={16} className="text-text-secondary" />
            )
          ) : (
            <span className="w-4" />
          )}
        </span>

        {/* 아이콘 */}
        {item.isFolder ? (
          <Folder size={16} className="text-yellow-500" />
        ) : (
          <FileText size={16} className="text-blue-500" />
        )}

        {/* 이름 */}
        <span className="text-text-primary flex-1">{item.itemName}</span>

        {/* Learning Object 정보 */}
        {item.snapshotLearningObject && (
          <span className="text-text-secondary text-xs flex items-center gap-1">
            <Clock size={12} />
            {item.snapshotLearningObject.duration
              ? `${item.snapshotLearningObject.duration}${getText('minutes')}`
              : '-'}
          </span>
        )}
      </div>

      {/* 자식 아이템 */}
      {hasChildren && isExpanded && (
        <div className="ml-6 border-l border-border pl-2">
          {item.children!.map((child) => (
            <SnapshotTreeItem key={child.itemId} item={child} language={language} />
          ))}
        </div>
      )}
    </div>
  );
}

export function ProgramSnapshotSection({
  snapshot,
  language = 'ko',
}: Readonly<ProgramSnapshotSectionProps>) {
  const getText = (key: keyof typeof t) => (language === 'ko' ? t[key].ko : t[key].en);

  if (!snapshot) {
    return (
      <Card>
        <div className="p-5">
          <h2 className="text-base font-medium text-text-primary mb-4 flex items-center gap-2">
            <Layers size={18} className="text-text-secondary" />
            {getText('snapshotInfo')}
          </h2>
          <p className="text-text-secondary">{getText('noSnapshot')}</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* 스냅샷 기본 정보 */}
      <Card>
        <div className="p-5">
          <h2 className="text-base font-medium text-text-primary mb-4 flex items-center gap-2">
            <Layers size={18} className="text-text-secondary" />
            {getText('snapshotInfo')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-text-secondary text-xs uppercase tracking-wide">
                {getText('snapshotName')}
              </Label>
              <p className="text-text-primary mt-1 font-medium">{snapshot.snapshotName}</p>
            </div>

            <div>
              <Label className="text-text-secondary text-xs uppercase tracking-wide">
                {getText('status')}
              </Label>
              <div className="mt-1">
                <Badge variant="secondary">
                  {snapshotStatusLabels[snapshot.status]?.[language] || snapshot.status}
                </Badge>
              </div>
            </div>

            {snapshot.description && (
              <div className="md:col-span-2">
                <Label className="text-text-secondary text-xs uppercase tracking-wide">
                  {getText('description')}
                </Label>
                <p className="text-text-primary mt-1 whitespace-pre-wrap">
                  {snapshot.description}
                </p>
              </div>
            )}

            {snapshot.hashtags && snapshot.hashtags.length > 0 && (
              <div className="md:col-span-2">
                <Label className="text-text-secondary text-xs uppercase tracking-wide">
                  {getText('hashtags')}
                </Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {snapshot.hashtags.split(',').map((tag) => (
                    <Badge key={tag.trim()} variant="secondary" className="flex items-center gap-1">
                      <Hash size={12} />
                      {tag.trim()}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div>
              <Label className="text-text-secondary text-xs uppercase tracking-wide">
                {getText('itemCount')}
              </Label>
              <p className="text-text-primary mt-1">
                {snapshot.itemCount} {getText('items')}
              </p>
            </div>

            {snapshot.totalDuration !== undefined && (
              <div>
                <Label className="text-text-secondary text-xs uppercase tracking-wide">
                  {getText('totalDuration')}
                </Label>
                <p className="text-text-primary mt-1 flex items-center gap-1">
                  <Clock size={14} className="text-text-secondary" />
                  {snapshot.totalDuration} {getText('minutes')}
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* 커리큘럼 트리 */}
      <Card>
        <div className="p-5">
          <h2 className="text-base font-medium text-text-primary mb-4">
            {getText('curriculum')} ({snapshot.itemCount} {getText('items')})
          </h2>

          {snapshot.items && snapshot.items.length > 0 ? (
            <div className="space-y-1">
              {snapshot.items.map((item) => (
                <SnapshotTreeItem key={item.itemId} item={item} language={language} />
              ))}
            </div>
          ) : (
            <p className="text-text-secondary">{getText('noItems')}</p>
          )}
        </div>
      </Card>
    </div>
  );
}
