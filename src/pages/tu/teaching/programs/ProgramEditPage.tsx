import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Loader2, AlertCircle, Save } from 'lucide-react';
import { Button, Card, Badge } from '@/components/common';
import {
  useMyProgram,
  useMyProgramSnapshot,
  useUpdateMyProgram,
  useUpdateSnapshot,
  useSubmitMyProgram,
} from '@/hooks/tu';
import { useSubdomainPath } from '@/hooks/common/useSubdomainPath';
import type { ProgramStatus } from '@/types/common';
import { ProgramBasicInfoForm, type ProgramFormData } from './components/ProgramBasicInfoForm';
import { SnapshotEditForm, type SnapshotFormData } from './components/SnapshotEditForm';

interface ProgramEditPageProps {
  language?: 'ko' | 'en';
}

const t = {
  pageTitle: { ko: '프로그램 수정', en: 'Edit Program' },
  pageSubtitle: { ko: '프로그램 정보를 수정하고 검토 신청할 수 있습니다', en: 'Edit program information and submit for review' },
  back: { ko: '취소', en: 'Cancel' },
  loading: { ko: '로딩 중...', en: 'Loading...' },
  error: { ko: '프로그램을 불러오는데 실패했습니다.', en: 'Failed to load program.' },
  notFound: { ko: '프로그램을 찾을 수 없습니다.', en: 'Program not found.' },
  notEditable: {
    ko: '이 프로그램은 수정할 수 없는 상태입니다.',
    en: 'This program cannot be edited.',
  },
  saveAndSubmit: { ko: '저장 후 신청', en: 'Save & Submit' },
  submit: { ko: '신청하기', en: 'Submit' },
  submitting: { ko: '신청 중...', en: 'Submitting...' },
  saving: { ko: '저장 중...', en: 'Saving...' },
  submitSuccess: { ko: '프로그램이 검토 신청되었습니다.', en: 'Program submitted for review.' },
  submitFailed: { ko: '신청에 실패했습니다.', en: 'Failed to submit.' },
  titleRequired: { ko: '프로그램명을 입력해주세요.', en: 'Please enter a program title.' },
  currentStatus: { ko: '현재 상태', en: 'Current Status' },
  statusDraft: { ko: '임시저장', en: 'Draft' },
  statusRejected: { ko: '반려됨', en: 'Rejected' },
  confirmSubmit: {
    ko: '프로그램을 검토 신청하시겠습니까?\n신청 후에는 승인 전까지 수정이 불가능합니다.',
    en: 'Submit this program for review?\nYou cannot edit it until it is approved.'
  },
  saveFirst: { ko: '저장', en: 'Save' },
  saveSuccess: { ko: '저장되었습니다.', en: 'Saved successfully.' },
  saveFailed: { ko: '저장에 실패했습니다.', en: 'Failed to save.' },
  hasChanges: { ko: '수정사항이 있습니다', en: 'You have unsaved changes' },
};

// 수정 가능한 상태
const canEdit = (status: ProgramStatus) => status === 'DRAFT' || status === 'REJECTED';

export function ProgramEditPage({ language = 'ko' }: Readonly<ProgramEditPageProps>) {
  const { programId } = useParams<{ programId: string }>();
  const navigate = useNavigate();
  const { prefixPath } = useSubdomainPath();
  const id = programId ? parseInt(programId, 10) : 0;

  const getText = (key: keyof typeof t) => (language === 'ko' ? t[key].ko : t[key].en);

  // Form state - Program
  const [formData, setFormData] = useState<ProgramFormData>({
    title: '',
    description: '',
    thumbnailUrl: '',
    level: '',
    type: '',
    estimatedHours: null,
  });
  const [hasChanges, setHasChanges] = useState(false);

  // Form state - Snapshot
  const [snapshotFormData, setSnapshotFormData] = useState<SnapshotFormData>({
    snapshotName: '',
    description: '',
    hashtags: '',
  });
  const [hasSnapshotChanges, setHasSnapshotChanges] = useState(false);

  // API hooks
  const { data: program, isLoading, error } = useMyProgram(id);
  const { data: snapshot } = useMyProgramSnapshot(program?.snapshotId || 0);
  const updateProgramMutation = useUpdateMyProgram();
  const updateSnapshotMutation = useUpdateSnapshot();
  const submitProgramMutation = useSubmitMyProgram();

  // 프로그램 데이터로 폼 초기화
  useEffect(() => {
    if (program) {
      setFormData({
        title: program.title || '',
        description: program.description || '',
        thumbnailUrl: program.thumbnailUrl || '',
        level: program.level || '',
        type: program.type || '',
        estimatedHours: program.estimatedHours || null,
      });
      setHasChanges(false);
    }
  }, [program]);

  // 스냅샷 데이터로 폼 초기화
  useEffect(() => {
    if (snapshot) {
      setSnapshotFormData({
        snapshotName: snapshot.snapshotName || '',
        description: snapshot.description || '',
        hashtags: snapshot.hashtags || '',
      });
      setHasSnapshotChanges(false);
    }
  }, [snapshot]);

  // 폼 데이터 변경 핸들러
  const handleFormDataChange = (data: Partial<ProgramFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setHasChanges(true);
  };

  // 스냅샷 폼 데이터 변경 핸들러
  const handleSnapshotFormDataChange = (data: Partial<SnapshotFormData>) => {
    setSnapshotFormData((prev) => ({ ...prev, ...data }));
    setHasSnapshotChanges(true);
  };

  // 저장 핸들러
  const handleSave = async () => {
    if (!formData.title.trim()) {
      alert(getText('titleRequired'));
      return false;
    }

    try {
      // 프로그램 저장
      if (hasChanges) {
        await updateProgramMutation.mutateAsync({
          id,
          request: {
            title: formData.title.trim(),
            description: formData.description.trim() || undefined,
            thumbnailUrl: formData.thumbnailUrl.trim() || undefined,
            level: formData.level || undefined,
            type: formData.type || undefined,
            estimatedHours: formData.estimatedHours || undefined,
          },
        });
        setHasChanges(false);
      }

      // 스냅샷 저장 (수정 가능한 상태이고 변경사항이 있을 때만)
      if (hasSnapshotChanges && snapshot && isSnapshotModifiable) {
        await updateSnapshotMutation.mutateAsync({
          id: snapshot.snapshotId,
          request: {
            snapshotName: snapshotFormData.snapshotName.trim() || undefined,
            description: snapshotFormData.description.trim() || undefined,
            hashtags: snapshotFormData.hashtags.trim() || undefined,
          },
        });
        setHasSnapshotChanges(false);
      }

      return true;
    } catch (err) {
      console.error('Save failed:', err);
      alert(getText('saveFailed'));
      return false;
    }
  };

  // 저장만 하기
  const handleSaveOnly = async () => {
    const success = await handleSave();
    if (success) {
      alert(getText('saveSuccess'));
    }
  };

  // 신청 핸들러
  const handleSubmit = async () => {
    // 유효성 검사
    if (!formData.title.trim()) {
      alert(getText('titleRequired'));
      return;
    }

    // 확인
    if (!window.confirm(getText('confirmSubmit'))) {
      return;
    }

    try {
      // 변경사항이 있으면 먼저 저장
      if (hasAnyChanges) {
        const saveSuccess = await handleSave();
        if (!saveSuccess) return;
      }

      // 신청
      await submitProgramMutation.mutateAsync(id);
      alert(getText('submitSuccess'));
      navigate(prefixPath('/tu/teaching/programs'));
    } catch (err) {
      console.error('Submit failed:', err);
      alert(getText('submitFailed'));
    }
  };

  const isSaving = updateProgramMutation.isPending || updateSnapshotMutation.isPending;
  const isSubmitting = submitProgramMutation.isPending;
  const isProcessing = isSaving || isSubmitting;
  const isSnapshotModifiable = snapshot?.status === 'DRAFT' || snapshot?.status === 'ACTIVE';
  const hasAnyChanges = hasChanges || hasSnapshotChanges;

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-bg-app">
        <Loader2 size={32} className="animate-spin text-text-secondary" />
        <span className="ml-2 text-text-secondary">{getText('loading')}</span>
      </div>
    );
  }

  // 에러 상태
  if (error || !program) {
    return (
      <div className="h-full flex items-center justify-center bg-bg-app">
        <div className="text-center">
          <AlertCircle size={48} className="mx-auto mb-3 text-status-error" />
          <p className="text-text-secondary">
            {error ? getText('error') : getText('notFound')}
          </p>
          <Button
            variant="ghost"
            className="mt-4 border border-border"
            onClick={() => navigate(prefixPath('/tu/teaching/programs'))}
          >
            <ArrowLeft size={16} />
            목록으로
          </Button>
        </div>
      </div>
    );
  }

  // 수정 불가 상태
  if (!canEdit(program.status)) {
    return (
      <div className="h-full flex items-center justify-center bg-bg-app">
        <div className="text-center">
          <AlertCircle size={48} className="mx-auto mb-3 text-status-warning" />
          <p className="text-text-secondary">{getText('notEditable')}</p>
          <Button
            variant="ghost"
            className="mt-4 border border-border"
            onClick={() => navigate(prefixPath(`/tu/teaching/programs/${id}`))}
          >
            <ArrowLeft size={16} />
            상세보기로 이동
          </Button>
        </div>
      </div>
    );
  }

  const statusLabel = program.status === 'DRAFT' ? getText('statusDraft') : getText('statusRejected');
  const statusVariant = program.status === 'DRAFT' ? 'secondary' : 'destructive';

  return (
    <div className="h-full flex flex-col bg-bg-app">
      {/* Header */}
      <div className="border-b border-border bg-bg-default sticky top-0 z-10">
        <div className="p-6 px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="border border-border"
                onClick={() => navigate(prefixPath('/tu/teaching/programs'))}
              >
                <ArrowLeft size={16} />
                {getText('back')}
              </Button>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-text-primary text-xl mb-0">{getText('pageTitle')}</h1>
                  <Badge variant={statusVariant}>{statusLabel}</Badge>
                  {hasAnyChanges && (
                    <span className="text-xs text-status-warning">({getText('hasChanges')})</span>
                  )}
                </div>
                <p className="text-text-secondary text-sm mt-1">{getText('pageSubtitle')}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {hasAnyChanges && (
                <Button
                  variant="outline"
                  onClick={handleSaveOnly}
                  disabled={isProcessing}
                >
                  {isSaving ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}
                  {isSaving ? getText('saving') : getText('saveFirst')}
                </Button>
              )}
              <Button onClick={handleSubmit} disabled={isProcessing}>
                {isSubmitting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Send size={16} />
                )}
                {isSubmitting ? getText('submitting') : hasAnyChanges ? getText('saveAndSubmit') : getText('submit')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 px-8 max-w-3xl space-y-6">
          {/* 안내 카드 */}
          <Card className="bg-bg-subtle border-border">
            <div className="p-4">
              <p className="text-sm text-text-secondary">
                {language === 'ko'
                  ? '아래 정보를 확인하고 필요한 경우 수정한 후 신청해주세요. 신청 후에는 검토 완료 전까지 수정이 불가능합니다.'
                  : 'Review and edit the information below if needed. Once submitted, you cannot edit until the review is complete.'}
              </p>
            </div>
          </Card>

          {/* 기본 정보 폼 */}
          <ProgramBasicInfoForm
            formData={formData}
            onFormDataChange={handleFormDataChange}
            language={language}
          />

          {/* 스냅샷(커리큘럼) 정보 폼 */}
          {snapshot && (
            <SnapshotEditForm
              formData={snapshotFormData}
              onFormDataChange={handleSnapshotFormDataChange}
              status={snapshot.status}
              language={language}
            />
          )}

          {/* 하단 신청 버튼 (모바일 대응) */}
          <div className="pt-4 pb-8">
            <Button
              onClick={handleSubmit}
              disabled={isProcessing}
              className="w-full"
              size="lg"
            >
              {isSubmitting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Send size={16} />
              )}
              {isSubmitting ? getText('submitting') : hasAnyChanges ? getText('saveAndSubmit') : getText('submit')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
