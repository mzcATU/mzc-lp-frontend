import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  BookOpen,
  Clock,
  ChevronDown,
  Loader2,
  PlayCircle,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { designTokens } from '@/styles/admin-design-tokens';
import {
  Button,
  Badge,
  Input,
  Card,
  CardContent,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/common';
import { useMyEnrollments } from '@/hooks/tu';
import { useTranslation } from '@/store/common/languageStore';
import type { Enrollment, EnrollmentStatus, EnrollmentFilterParams } from '@/services/tu/enrollmentService';

type StatusFilter = EnrollmentStatus | 'all';

const statusColors: Record<EnrollmentStatus, 'blue' | 'green' | 'red' | 'gray' | 'orange'> = {
  PENDING: 'orange',
  APPROVED: 'blue',
  REJECTED: 'red',
  CANCELLED: 'gray',
  COMPLETED: 'green',
};

const statusIcons: Record<EnrollmentStatus, React.ReactNode> = {
  PENDING: <AlertCircle className="w-4 h-4" />,
  APPROVED: <PlayCircle className="w-4 h-4" />,
  REJECTED: <XCircle className="w-4 h-4" />,
  CANCELLED: <XCircle className="w-4 h-4" />,
  COMPLETED: <CheckCircle className="w-4 h-4" />,
};

function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: designTokens.bg.secondary }}>
      <div
        className="h-full rounded-full transition-all"
        style={{
          width: `${progress}%`,
          backgroundColor: progress === 100 ? designTokens.status.success_text : designTokens.button.brand_default,
        }}
      />
    </div>
  );
}

function EnrollmentCard({ enrollment, onClick, t }: { enrollment: Enrollment; onClick: () => void; t: ReturnType<typeof useTranslation>['t'] }) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  };

  const statusLabels: Record<EnrollmentStatus, string> = {
    PENDING: t.learning.statusPending,
    APPROVED: t.learning.statusApproved,
    REJECTED: t.learning.statusRejected,
    CANCELLED: t.learning.statusCancelled,
    COMPLETED: t.learning.statusCompleted,
  };

  return (
    <Card
      className="cursor-pointer transition-all hover:shadow-md"
      onClick={onClick}
      style={{ backgroundColor: designTokens.bg.default }}
    >
      <CardContent className="p-5">
        {/* Header: Status Badge */}
        <div className="flex items-center justify-between mb-3">
          <Badge variant={statusColors[enrollment.status]} className="text-xs flex items-center gap-1">
            {statusIcons[enrollment.status]}
            {statusLabels[enrollment.status]}
          </Badge>
        </div>

        {/* Program Title */}
        <h3
          className="font-semibold text-base mb-2 line-clamp-2"
          style={{ color: designTokens.text.primary }}
        >
          {enrollment.programTitle}
        </h3>

        {/* Course Time Name */}
        <p
          className="text-sm mb-3"
          style={{ color: designTokens.text.secondary }}
        >
          {enrollment.courseTimeName}
        </p>

        {/* Progress Bar (only for APPROVED status) */}
        {enrollment.status === 'APPROVED' && enrollment.progress !== undefined && (
          <div className="mb-3">
            <div className="flex items-center justify-between text-xs mb-1" style={{ color: designTokens.text.secondary }}>
              <span>{t.learning.progress}</span>
              <span style={{ color: designTokens.text.primary, fontWeight: 500 }}>{enrollment.progress}%</span>
            </div>
            <ProgressBar progress={enrollment.progress} />
          </div>
        )}

        {/* Date Info */}
        <div className="flex items-center gap-2 text-xs" style={{ color: designTokens.text.secondary }}>
          <Clock className="w-3.5 h-3.5" />
          <span>{formatDate(enrollment.startDate)} ~ {formatDate(enrollment.endDate)}</span>
        </div>

        {/* Continue Learning Button (only for APPROVED) */}
        {enrollment.status === 'APPROVED' && (
          <Button
            className="w-full mt-4"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            <PlayCircle className="w-4 h-4 mr-2" />
            {t.learning.continueLearning}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export function MyLearningPage() {
  const { t } = useTranslation();

  const statusLabels: Record<EnrollmentStatus, string> = {
    PENDING: t.learning.statusPending,
    APPROVED: t.learning.statusApproved,
    REJECTED: t.learning.statusRejected,
    CANCELLED: t.learning.statusCancelled,
    COMPLETED: t.learning.statusCompleted,
  };
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(0);

  // API 파라미터
  const params: EnrollmentFilterParams = {
    page,
    size: 12,
    status: statusFilter !== 'all' ? statusFilter : undefined,
  };

  const { data, isLoading, isError } = useMyEnrollments(params);

  // 검색 필터링 (클라이언트 사이드)
  const filteredContent = data?.content.filter((enrollment) =>
    enrollment.programTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    enrollment.courseTimeName.toLowerCase().includes(searchQuery.toLowerCase())
  ) ?? [];

  const handleEnrollmentClick = (enrollmentId: number) => {
    navigate(`/tu/learning/${enrollmentId}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
  };

  return (
    <div
      style={{
        padding: '40px',
        backgroundColor: designTokens.bg.app_default,
        minHeight: '100%',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div className="mb-8">
          <h1
            style={{
              color: designTokens.text.primary,
              fontSize: '28px',
              fontWeight: 600,
              marginBottom: '8px',
            }}
          >
            {t.learning.title}
          </h1>
          <p style={{ color: designTokens.text.secondary, fontSize: '14px' }}>
            {t.learning.description}
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 min-w-[280px] max-w-md">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                style={{ color: designTokens.text.placeholder }}
              />
              <Input
                type="text"
                placeholder={t.learning.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </form>

          {/* Filter Toggle */}
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <Filter className="w-4 h-4" />
            {t.learning.filter}
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </Button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div
            className="p-4 rounded-lg mb-6"
            style={{ backgroundColor: designTokens.bg.default, border: `1px solid ${designTokens.bg.border}` }}
          >
            <div className="flex flex-wrap items-center gap-4">
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: designTokens.text.secondary }}
                >
                  {t.learning.enrollmentStatus}
                </label>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={statusFilter === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      setStatusFilter('all');
                      setPage(0);
                    }}
                  >
                    {t.landing.all}
                  </Button>
                  {(['APPROVED', 'PENDING', 'COMPLETED', 'CANCELLED', 'REJECTED'] as EnrollmentStatus[]).map((status) => (
                    <Button
                      key={status}
                      variant={statusFilter === status ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        setStatusFilter(status);
                        setPage(0);
                      }}
                    >
                      {statusLabels[status]}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Count */}
        {data && (
          <p className="mb-4 text-sm" style={{ color: designTokens.text.secondary }}>
            {t.learning.totalEnrollments} <span style={{ color: designTokens.text.primary, fontWeight: 600 }}>{filteredContent.length}</span> {t.learning.enrollments}
          </p>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: designTokens.text.secondary }} />
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="text-center py-20">
            <p style={{ color: designTokens.status.error_text }}>
              {t.learning.loadError}
            </p>
          </div>
        )}

        {/* Empty State */}
        {data && filteredContent.length === 0 && (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 mx-auto mb-4" style={{ color: designTokens.text.placeholder }} />
            <h3
              className="text-lg font-medium mb-2"
              style={{ color: designTokens.text.primary }}
            >
              {t.learning.noEnrollments}
            </h3>
            <p className="mb-4" style={{ color: designTokens.text.secondary }}>
              {t.learning.noEnrollmentsDesc}
            </p>
            <Button onClick={() => navigate('/tu/catalog')}>
              {t.learning.browseCourses}
            </Button>
          </div>
        )}

        {/* Enrollment Grid */}
        {data && filteredContent.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {filteredContent.map((enrollment) => (
                <EnrollmentCard
                  key={enrollment.id}
                  enrollment={enrollment}
                  onClick={() => handleEnrollmentClick(enrollment.id)}
                  t={t}
                />
              ))}
            </div>

            {/* Pagination */}
            {data.totalPages > 1 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setPage(Math.max(0, page - 1))}
                      className={page === 0 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>

                  {Array.from({ length: Math.min(5, data.totalPages) }, (_, i) => {
                    const pageNum = Math.max(0, Math.min(page - 2, data.totalPages - 5)) + i;
                    if (pageNum >= data.totalPages) return null;
                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          onClick={() => setPage(pageNum)}
                          isActive={pageNum === page}
                          className="cursor-pointer"
                        >
                          {pageNum + 1}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setPage(Math.min(data.totalPages - 1, page + 1))}
                      className={page >= data.totalPages - 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
      </div>
    </div>
  );
}
