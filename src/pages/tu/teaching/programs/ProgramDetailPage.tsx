import { useParams, useNavigate } from 'react-router-dom';
import {
  Edit2,
  Trash2,
  Send,
  Loader2,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  Archive,
} from 'lucide-react';
import { Button, Badge, BackButton } from '@/components/common';
import {
  useMyProgram,
  useMyProgramSnapshot,
  useSubmitMyProgram,
  useDeleteMyProgram,
} from '@/hooks/tu';
import { useSubdomainPath } from '@/hooks/common/useSubdomainPath';
import type { ProgramStatus } from '@/types/common';
import { PROGRAM_STATUS_LABELS } from '@/types/common';
import { ProgramInfoSection } from './components/ProgramInfoSection';
import { ProgramSnapshotSection } from './components/ProgramSnapshotSection';

interface ProgramDetailPageProps {
  language?: 'ko' | 'en';
}

const t = {
  back: { ko: '목록으로', en: 'Back to List' },
  loading: { ko: '로딩 중...', en: 'Loading...' },
  error: { ko: '과정을 불러오는데 실패했습니다.', en: 'Failed to load program.' },
  notFound: { ko: '과정을 찾을 수 없습니다.', en: 'Program not found.' },
  edit: { ko: '수정', en: 'Edit' },
  submit: { ko: '검토 신청', en: 'Submit for Review' },
  delete: { ko: '삭제', en: 'Delete' },
  confirmSubmit: {
    ko: '이 과정을 검토 신청하시겠습니까?',
    en: 'Submit this program for review?',
  },
  confirmDelete: {
    ko: '이 과정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
    en: 'Delete this program? This action cannot be undone.',
  },
  submitSuccess: {
    ko: '과정이 검토 신청되었습니다.',
    en: 'Program submitted for review.',
  },
  deleteSuccess: { ko: '과정이 삭제되었습니다.', en: 'Program deleted.' },
};

const statusBadgeVariant: Record<
  ProgramStatus,
  'default' | 'secondary' | 'success' | 'warning' | 'destructive'
> = {
  DRAFT: 'secondary',
  PENDING: 'warning',
  APPROVED: 'success',
  REJECTED: 'destructive',
  CLOSED: 'default',
};

const statusIcons: Record<ProgramStatus, React.ReactNode> = {
  DRAFT: <Edit2 size={14} />,
  PENDING: <Clock size={14} />,
  APPROVED: <CheckCircle size={14} />,
  REJECTED: <XCircle size={14} />,
  CLOSED: <Archive size={14} />,
};

// 상태별 허용 액션
const canEdit = (status: ProgramStatus) => status === 'DRAFT' || status === 'REJECTED';
const canSubmit = (status: ProgramStatus) => status === 'DRAFT' || status === 'REJECTED';
const canDelete = (status: ProgramStatus) => status === 'DRAFT' || status === 'REJECTED';

export function ProgramDetailPage({ language = 'ko' }: Readonly<ProgramDetailPageProps>) {
  const { programId } = useParams<{ programId: string }>();
  const navigate = useNavigate();
  const { prefixPath } = useSubdomainPath();
  const id = programId ? parseInt(programId, 10) : 0;

  const getText = (key: keyof typeof t) => (language === 'ko' ? t[key].ko : t[key].en);

  // API hooks
  const { data: program, isLoading, error } = useMyProgram(id);
  const { data: snapshot } = useMyProgramSnapshot(program?.snapshotId || 0);
  const submitMutation = useSubmitMyProgram();
  const deleteMutation = useDeleteMyProgram();

  // 신청 핸들러
  const handleSubmit = async () => {
    if (!confirm(getText('confirmSubmit'))) return;

    try {
      await submitMutation.mutateAsync(id);
      alert(getText('submitSuccess'));
    } catch (err) {
      console.error('Submit failed:', err);
      alert('신청에 실패했습니다.');
    }
  };

  // 삭제 핸들러
  const handleDelete = async () => {
    if (!confirm(getText('confirmDelete'))) return;

    try {
      await deleteMutation.mutateAsync(id);
      alert(getText('deleteSuccess'));
      navigate(prefixPath('/tu/teaching/programs'));
    } catch (err) {
      console.error('Delete failed:', err);
      alert('삭제에 실패했습니다.');
    }
  };

  const isActionPending = submitMutation.isPending || deleteMutation.isPending;

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
          <BackButton
            onClick={() => navigate(prefixPath('/tu/teaching/programs'))}
            label={getText('back')}
            className="mt-4"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto bg-bg-app">
      <div className="p-8">
        {/* 뒤로가기 버튼 */}
        <div className="mb-4">
          <BackButton
            onClick={() => navigate(prefixPath('/tu/teaching/programs'))}
            label={getText('back')}
          />
        </div>

        {/* Header Section - 목록 페이지와 동일한 스타일 */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-text-primary mb-0">{program.title}</h1>
              <Badge
                variant={statusBadgeVariant[program.status]}
                className="flex items-center gap-1"
              >
                {statusIcons[program.status]}
                {PROGRAM_STATUS_LABELS[program.status]}
              </Badge>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {canSubmit(program.status) && (
              <Button size="sm" onClick={handleSubmit} disabled={isActionPending}>
                {submitMutation.isPending ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Send size={16} />
                )}
                {getText('submit')}
              </Button>
            )}

            {canEdit(program.status) && (
              <Button
                variant="ghost"
                size="sm"
                className="border border-border"
                onClick={() => navigate(prefixPath(`/tu/teaching/programs/${id}/edit`))}
              >
                <Edit2 size={16} />
                {getText('edit')}
              </Button>
            )}

            {canDelete(program.status) && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={isActionPending}
              >
                {deleteMutation.isPending ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Trash2 size={16} />
                )}
                {getText('delete')}
              </Button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* 기본 정보 섹션 */}
          <ProgramInfoSection program={program} language={language} />

          {/* 스냅샷 섹션 */}
          <ProgramSnapshotSection snapshot={snapshot || null} language={language} />
        </div>
      </div>
    </div>
  );
}
