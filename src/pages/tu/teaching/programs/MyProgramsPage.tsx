import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  Filter,
  Loader2,
  AlertCircle,
  Edit2,
  Send,
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
  Archive,
  LayoutGrid,
  List,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button, Badge, Card } from '@/components/common';
import { useMyPrograms, useDeleteMyProgram } from '@/hooks/tu';
import type { ProgramStatus, ProgramResponse } from '@/types/common';
import {
  PROGRAM_STATUS_LABELS,
  PROGRAM_LEVEL_LABELS,
  PROGRAM_TYPE_LABELS,
} from '@/types/common';

interface MyProgramsPageProps {
  language?: 'ko' | 'en';
}

const DEFAULT_THUMBNAIL =
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop';

const t = {
  title: { ko: '개설 신청 현황', en: 'Submission Status' },
  subtitle: {
    ko: '디자인한 강의의 프로그램 개설 신청 및 승인 상태를 확인하세요',
    en: 'Check the submission and approval status of your designed courses',
  },
  all: { ko: '전체', en: 'All' },
  draft: { ko: '임시저장', en: 'Draft' },
  pending: { ko: '검토중', en: 'Pending' },
  approved: { ko: '승인됨', en: 'Approved' },
  rejected: { ko: '반려됨', en: 'Rejected' },
  closed: { ko: '종료', en: 'Closed' },
  sortBy: { ko: '정렬', en: 'Sort By' },
  recent: { ko: '최신순', en: 'Recent' },
  titleSort: { ko: '제목순', en: 'Title' },
  noPrograms: { ko: '신청한 프로그램이 없습니다', en: 'No programs found' },
  noProgramsDesc: {
    ko: "'강의 디자인'에서 강의를 완성한 후 프로그램 개설을 신청하면 여기에 표시됩니다",
    en: 'Complete your course in Course Design and submit for program creation to see it here',
  },
  goToCourses: { ko: '강의 디자인으로 이동', en: 'Go to Course Design' },
  loading: { ko: '프로그램 목록을 불러오는 중...', en: 'Loading programs...' },
  error: { ko: '프로그램 목록을 불러오는데 실패했습니다', en: 'Failed to load programs' },
  retry: { ko: '다시 시도', en: 'Retry' },
  view: { ko: '상세보기', en: 'View' },
  edit: { ko: '수정', en: 'Edit' },
  submit: { ko: '신청 준비', en: 'Prepare Submit' },
  delete: { ko: '삭제', en: 'Delete' },
  notSet: { ko: '미설정', en: 'Not set' },
  hours: { ko: '시간', en: 'hours' },
  confirmSubmit: {
    ko: '이 프로그램을 검토 신청하시겠습니까?',
    en: 'Submit this program for review?',
  },
  confirmDelete: {
    ko: '이 프로그램을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
    en: 'Delete this program? This action cannot be undone.',
  },
  submitSuccess: {
    ko: '프로그램이 검토 신청되었습니다.',
    en: 'Program submitted for review.',
  },
  deleteSuccess: { ko: '프로그램이 삭제되었습니다.', en: 'Program deleted.' },
  flowGuideTitle: { ko: '강의 개설 절차', en: 'Course Creation Process' },
  flowStep1: { ko: "'강의 디자인'에서 강의 콘텐츠를 구성하세요", en: 'Design your course content in Course Design' },
  flowStep2: { ko: '완성된 강의로 프로그램 개설을 신청하세요', en: 'Submit your completed course for program creation' },
  flowStep3: { ko: "관리자 승인 후 '강의 운영'에서 수강생을 관리할 수 있습니다", en: 'After approval, manage students in Course Operations' },
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

export function MyProgramsPage({ language = 'ko' }: Readonly<MyProgramsPageProps>) {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState<'all' | ProgramStatus>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'title'>('recent');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const getText = (key: keyof typeof t) => (language === 'ko' ? t[key].ko : t[key].en);

  // API hooks
  const {
    data: programsData,
    isLoading,
    error,
    refetch,
  } = useMyPrograms(filterStatus === 'all' ? undefined : { status: filterStatus });

  const deleteMutation = useDeleteMyProgram();

  // 삭제 핸들러
  const handleDelete = async (program: ProgramResponse) => {
    if (!confirm(getText('confirmDelete'))) return;

    try {
      await deleteMutation.mutateAsync(program.id);
      alert(getText('deleteSuccess'));
    } catch (err) {
      console.error('Delete failed:', err);
      alert('삭제에 실패했습니다.');
    }
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="p-8 bg-bg-app_default min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={32} className="animate-spin text-text-secondary mx-auto mb-4" />
          <p className="text-text-secondary">{getText('loading')}</p>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="p-8 bg-bg-app_default min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="text-status-error mx-auto mb-4" />
          <p className="text-text-secondary mb-4">{getText('error')}</p>
          <Button onClick={() => refetch()}>{getText('retry')}</Button>
        </div>
      </div>
    );
  }

  const programs = programsData?.content || [];

  // 정렬
  const sortedPrograms = [...programs].sort((a, b) => {
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    // recent: updatedAt 기준 내림차순
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  return (
    <div className="p-8 bg-bg-app_default min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-text-primary mb-2">{getText('title')}</h1>
        <p className="text-text-secondary m-0">{getText('subtitle')}</p>
      </div>

      {/* Filters & Sort */}
      <div className="mb-6 flex gap-4 items-center flex-wrap">
        <div className="flex gap-2 items-center">
          <Filter size={18} className="text-text-secondary" />
          <div className="flex gap-1 bg-bg-secondary p-1 rounded-lg">
            {(['all', 'DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'CLOSED'] as const).map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={cn(
                    'px-4 py-1.5 rounded-md text-sm transition-colors',
                    filterStatus === status
                      ? 'bg-btn-neutral text-white font-medium'
                      : 'bg-transparent text-text-secondary hover:bg-bg-secondary'
                  )}
                >
                  {status === 'all'
                    ? getText('all')
                    : PROGRAM_STATUS_LABELS[status as ProgramStatus]}
                </button>
              )
            )}
          </div>
        </div>

        <div className="flex gap-2 items-center ml-auto">
          <span className="text-sm text-text-secondary">{getText('sortBy')}:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'recent' | 'title')}
            className="px-3 py-2 bg-bg-secondary text-text-primary border border-border rounded-md text-sm cursor-pointer"
          >
            <option value="recent">{getText('recent')}</option>
            <option value="title">{getText('titleSort')}</option>
          </select>

          {/* View Toggle */}
          <div className="flex gap-1 bg-bg-secondary p-1 rounded-lg ml-2">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'p-2 rounded-md transition-colors',
                viewMode === 'grid'
                  ? 'bg-btn-neutral text-white'
                  : 'bg-transparent text-text-secondary hover:bg-bg-secondary'
              )}
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'p-2 rounded-md transition-colors',
                viewMode === 'list'
                  ? 'bg-btn-neutral text-white'
                  : 'bg-transparent text-text-secondary hover:bg-bg-secondary'
              )}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Program List/Grid */}
      {sortedPrograms.length > 0 ? (
        viewMode === 'list' ? (
          /* List View */
          <div className="flex flex-col gap-3">
            {sortedPrograms.map((program) => (
              <Card
                key={program.id}
                className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate(`/tu/teaching/programs/${program.id}`)}
              >
                <div className="flex items-center gap-4">
                  {/* Thumbnail */}
                  <div className="w-24 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-bg-secondary">
                    <img
                      src={program.thumbnailUrl || DEFAULT_THUMBNAIL}
                      alt={program.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-text-primary font-medium truncate">
                        {program.title}
                      </h3>
                      <Badge
                        variant={statusBadgeVariant[program.status]}
                        className="flex items-center gap-1 flex-shrink-0"
                      >
                        {statusIcons[program.status]}
                        {PROGRAM_STATUS_LABELS[program.status]}
                      </Badge>
                    </div>
                    <p className="text-text-secondary text-sm truncate h-5">
                      {program.description || '\u00A0'}
                    </p>
                    <div className="flex gap-2 mt-1 text-xs text-text-secondary">
                      {program.level && (
                        <span>{PROGRAM_LEVEL_LABELS[program.level]}</span>
                      )}
                      {program.type && (
                        <span>• {PROGRAM_TYPE_LABELS[program.type]}</span>
                      )}
                      {program.estimatedHours && (
                        <span>• {program.estimatedHours} {getText('hours')}</span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                    {canEdit(program.status) && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="border border-border"
                        onClick={() => navigate(`/tu/teaching/programs/${program.id}/edit`)}
                      >
                        <Edit2 size={14} />
                        {getText('edit')}
                      </Button>
                    )}

                    {canSubmit(program.status) && (
                      <Button
                        size="sm"
                        onClick={() => navigate(`/tu/teaching/programs/${program.id}/edit`)}
                      >
                        <Send size={14} />
                        {getText('submit')}
                      </Button>
                    )}

                    {canDelete(program.status) && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(program)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 size={14} />
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedPrograms.map((program) => (
              <Card
                key={program.id}
                className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow flex flex-col"
                onClick={() => navigate(`/tu/teaching/programs/${program.id}`)}
              >
                {/* Thumbnail */}
                <div className="aspect-video relative overflow-hidden bg-bg-secondary">
                  <img
                    src={program.thumbnailUrl || DEFAULT_THUMBNAIL}
                    alt={program.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge
                      variant={statusBadgeVariant[program.status]}
                      className="flex items-center gap-1"
                    >
                      {statusIcons[program.status]}
                      {PROGRAM_STATUS_LABELS[program.status]}
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="text-text-primary font-medium mb-2 line-clamp-2 min-h-[3rem]">
                    {program.title}
                  </h3>

                  <p className="text-text-secondary text-sm mb-3 line-clamp-2 min-h-[2.5rem]">
                    {program.description || '\u00A0'}
                  </p>

                  {/* Meta Info */}
                  <div className="flex flex-wrap gap-2 text-xs text-text-secondary mb-4 min-h-[1.75rem]">
                    {program.level && (
                      <span className="px-2 py-1 bg-bg-secondary rounded">
                        {PROGRAM_LEVEL_LABELS[program.level]}
                      </span>
                    )}
                    {program.type && (
                      <span className="px-2 py-1 bg-bg-secondary rounded">
                        {PROGRAM_TYPE_LABELS[program.type]}
                      </span>
                    )}
                    {program.estimatedHours && (
                      <span className="px-2 py-1 bg-bg-secondary rounded">
                        {program.estimatedHours} {getText('hours')}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-auto" onClick={(e) => e.stopPropagation()}>
                    {canEdit(program.status) && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="flex-1 border border-border"
                        onClick={() => navigate(`/tu/teaching/programs/${program.id}/edit`)}
                      >
                        <Edit2 size={14} />
                        {getText('edit')}
                      </Button>
                    )}

                    {canSubmit(program.status) && (
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => navigate(`/tu/teaching/programs/${program.id}/edit`)}
                      >
                        <Send size={14} />
                        {getText('submit')}
                      </Button>
                    )}

                    {canDelete(program.status) && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(program)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 size={14} />
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )
      ) : (
        /* Empty State */
        <div className="text-center py-16 px-5 bg-bg-secondary rounded-xl border border-border">
          <Package size={64} className="text-text-secondary mb-4 opacity-30 mx-auto" />
          <h3 className="text-text-primary mb-2">{getText('noPrograms')}</h3>
          <p className="text-text-secondary mb-8">{getText('noProgramsDesc')}</p>

          {/* 플로우 안내 */}
          <div className="max-w-md mx-auto mb-8 text-left bg-bg-primary rounded-lg p-5 border border-border">
            <p className="text-sm font-medium text-text-primary mb-3">{getText('flowGuideTitle')}</p>
            <ol className="text-sm text-text-secondary space-y-2">
              <li className="flex gap-2">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-btn-brand text-white text-xs flex items-center justify-center">1</span>
                <span>{getText('flowStep1')}</span>
              </li>
              <li className="flex gap-2">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-btn-brand text-white text-xs flex items-center justify-center">2</span>
                <span>{getText('flowStep2')}</span>
              </li>
              <li className="flex gap-2">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-btn-brand text-white text-xs flex items-center justify-center">3</span>
                <span>{getText('flowStep3')}</span>
              </li>
            </ol>
          </div>

          <Button onClick={() => navigate('/tu/teaching/courses')}>
            {getText('goToCourses')}
          </Button>
        </div>
      )}
    </div>
  );
}
