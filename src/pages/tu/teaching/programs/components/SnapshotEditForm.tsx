import { Card, Label, Input, Textarea, Badge } from '@/components/common';
import type { SnapshotStatus } from '@/types/common';

export interface SnapshotFormData {
  snapshotName: string;
  description: string;
  hashtags: string;
}

interface SnapshotEditFormProps {
  formData: SnapshotFormData;
  onFormDataChange: (data: Partial<SnapshotFormData>) => void;
  status: SnapshotStatus;
  language?: 'ko' | 'en';
}

const t = {
  curriculumInfo: { ko: '커리큘럼 정보', en: 'Curriculum Information' },
  snapshotName: { ko: '커리큘럼 이름', en: 'Curriculum Name' },
  snapshotNamePlaceholder: { ko: '커리큘럼 이름을 입력하세요', en: 'Enter curriculum name' },
  description: { ko: '설명', en: 'Description' },
  descriptionPlaceholder: { ko: '커리큘럼에 대한 설명을 입력하세요', en: 'Enter curriculum description' },
  hashtags: { ko: '해시태그', en: 'Hashtags' },
  hashtagsPlaceholder: { ko: '예: #클라우드 #AWS #입문', en: 'e.g., #cloud #AWS #beginner' },
  readOnly: { ko: '(읽기 전용)', en: '(Read-only)' },
  statusDraft: { ko: '준비중', en: 'Draft' },
  statusActive: { ko: '강의중', en: 'Active' },
  statusCompleted: { ko: '종료', en: 'Completed' },
  statusArchived: { ko: '보관됨', en: 'Archived' },
};

const isModifiable = (status: SnapshotStatus) => status === 'DRAFT' || status === 'ACTIVE';

const getStatusLabel = (status: SnapshotStatus, language: 'ko' | 'en') => {
  const labels: Record<SnapshotStatus, { ko: string; en: string }> = {
    DRAFT: t.statusDraft,
    ACTIVE: t.statusActive,
    COMPLETED: t.statusCompleted,
    ARCHIVED: t.statusArchived,
  };
  return language === 'ko' ? labels[status].ko : labels[status].en;
};

const getStatusVariant = (status: SnapshotStatus) => {
  switch (status) {
    case 'DRAFT':
      return 'secondary';
    case 'ACTIVE':
      return 'success';
    case 'COMPLETED':
      return 'default';
    case 'ARCHIVED':
      return 'outline';
    default:
      return 'default';
  }
};

export function SnapshotEditForm({
  formData,
  onFormDataChange,
  status,
  language = 'ko',
}: Readonly<SnapshotEditFormProps>) {
  const getText = (key: keyof typeof t) => (language === 'ko' ? t[key].ko : t[key].en);
  const canEdit = isModifiable(status);

  const handleChange = (field: keyof SnapshotFormData, value: string) => {
    if (canEdit) {
      onFormDataChange({ [field]: value });
    }
  };

  return (
    <Card>
      <div className="p-5">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-medium text-text-primary">{getText('curriculumInfo')}</h2>
          <div className="flex items-center gap-2">
            <Badge variant={getStatusVariant(status)}>{getStatusLabel(status, language)}</Badge>
            {!canEdit && (
              <span className="text-xs text-text-secondary">{getText('readOnly')}</span>
            )}
          </div>
        </div>

        <div className="space-y-5">
          {/* 커리큘럼 이름 */}
          <div>
            <Label className="text-text-primary mb-2">{getText('snapshotName')}</Label>
            <Input
              value={formData.snapshotName}
              onChange={(e) => handleChange('snapshotName', e.target.value)}
              placeholder={getText('snapshotNamePlaceholder')}
              disabled={!canEdit}
              className={!canEdit ? 'bg-bg-secondary cursor-not-allowed' : ''}
            />
          </div>

          {/* 설명 */}
          <div>
            <Label className="text-text-primary mb-2">{getText('description')}</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder={getText('descriptionPlaceholder')}
              rows={3}
              disabled={!canEdit}
              className={!canEdit ? 'bg-bg-secondary cursor-not-allowed' : ''}
            />
          </div>

          {/* 해시태그 */}
          <div>
            <Label className="text-text-primary mb-2">{getText('hashtags')}</Label>
            <Input
              value={formData.hashtags}
              onChange={(e) => handleChange('hashtags', e.target.value)}
              placeholder={getText('hashtagsPlaceholder')}
              disabled={!canEdit}
              className={!canEdit ? 'bg-bg-secondary cursor-not-allowed' : ''}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
