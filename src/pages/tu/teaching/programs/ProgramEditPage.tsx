import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/common';
import {
  useMyProgram,
  useSnapshotItems,
  useUpdateMyProgram,
  useUpdateSnapshot,
} from '@/hooks/tu';
import type { ProgramStatus } from '@/types/common';
import { ProgramBasicInfoForm, type ProgramFormData } from './components/ProgramBasicInfoForm';
import { SnapshotItemTree } from './components/SnapshotItemTree';

interface ProgramEditPageProps {
  language?: 'ko' | 'en';
}

const t = {
  back: { ko: '취소', en: 'Cancel' },
  loading: { ko: '로딩 중...', en: 'Loading...' },
  error: { ko: '프로그램을 불러오는데 실패했습니다.', en: 'Failed to load program.' },
  notFound: { ko: '프로그램을 찾을 수 없습니다.', en: 'Program not found.' },
  notEditable: {
    ko: '이 프로그램은 수정할 수 없는 상태입니다.',
    en: 'This program cannot be edited.',
  },
  save: { ko: '저장', en: 'Save' },
  saving: { ko: '저장 중...', en: 'Saving...' },
  saveSuccess: { ko: '저장되었습니다.', en: 'Saved successfully.' },
  saveFailed: { ko: '저장에 실패했습니다.', en: 'Failed to save.' },
  titleRequired: { ko: '프로그램명을 입력해주세요.', en: 'Please enter a program title.' },
  editProgram: { ko: '프로그램 수정', en: 'Edit Program' },
};

// 수정 가능한 상태
const canEdit = (status: ProgramStatus) => status === 'DRAFT' || status === 'REJECTED';

export function ProgramEditPage({ language = 'ko' }: Readonly<ProgramEditPageProps>) {
  const { programId } = useParams<{ programId: string }>();
  const navigate = useNavigate();
  const id = programId ? parseInt(programId, 10) : 0;

  const getText = (key: keyof typeof t) => (language === 'ko' ? t[key].ko : t[key].en);

  // Form state
  const [formData, setFormData] = useState<ProgramFormData>({
    title: '',
    description: '',
    thumbnailUrl: '',
    level: '',
    type: '',
    estimatedHours: null,
  });

  // API hooks
  const { data: program, isLoading, error, refetch: refetchProgram } = useMyProgram(id);
  const {
    data: snapshotItems,
    refetch: refetchItems,
  } = useSnapshotItems(program?.snapshotId || 0);

  const updateProgramMutation = useUpdateMyProgram();
  const updateSnapshotMutation = useUpdateSnapshot();

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
    }
  }, [program]);

  // 폼 데이터 변경 핸들러
  const handleFormDataChange = (data: Partial<ProgramFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  // 저장 핸들러
  const handleSave = async () => {
    // 유효성 검사
    if (!formData.title.trim()) {
      alert(getText('titleRequired'));
      return;
    }

    try {
      // 프로그램 기본 정보 저장
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

      // 스냅샷 기본 정보도 업데이트 (이름 동기화)
      if (program?.snapshotId) {
        await updateSnapshotMutation.mutateAsync({
          id: program.snapshotId,
          request: {
            snapshotName: formData.title.trim(),
            description: formData.description.trim() || undefined,
          },
        });
      }

      alert(getText('saveSuccess'));
      refetchProgram();
    } catch (err) {
      console.error('Save failed:', err);
      alert(getText('saveFailed'));
    }
  };

  // 스냅샷 아이템 변경 시 리프레시
  const handleItemsChange = () => {
    refetchItems();
  };

  const isSaving = updateProgramMutation.isPending || updateSnapshotMutation.isPending;

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
            onClick={() => navigate('/tu/teaching/programs')}
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
            onClick={() => navigate(`/tu/teaching/programs/${id}`)}
          >
            <ArrowLeft size={16} />
            상세보기로 이동
          </Button>
        </div>
      </div>
    );
  }

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
                onClick={() => navigate(`/tu/teaching/programs/${id}`)}
              >
                <ArrowLeft size={16} />
                {getText('back')}
              </Button>
              <div>
                <h1 className="text-text-primary text-xl mb-0">{getText('editProgram')}</h1>
                <p className="text-text-secondary text-sm mt-1">{program.title}</p>
              </div>
            </div>

            {/* Save Button */}
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              {isSaving ? getText('saving') : getText('save')}
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 px-8 max-w-5xl space-y-6">
          {/* 기본 정보 폼 */}
          <ProgramBasicInfoForm
            formData={formData}
            onFormDataChange={handleFormDataChange}
            language={language}
          />

          {/* 스냅샷 아이템 트리 */}
          {program.snapshotId && (
            <SnapshotItemTree
              snapshotId={program.snapshotId}
              items={snapshotItems || []}
              onItemsChange={handleItemsChange}
              language={language}
            />
          )}
        </div>
      </div>
    </div>
  );
}
