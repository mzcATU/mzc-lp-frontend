import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  BookOpen,
  Clock,
  Users,
  Star,
  ChevronDown,
  Loader2,
  GraduationCap,
  LayoutGrid,
  List,
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
import { useCatalogPrograms } from '@/hooks/tu';
import type { CatalogFilterParams, CatalogProgram } from '@/services/tu/catalogService';

type ViewMode = 'grid' | 'list';
type Difficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'all';

const difficultyLabels: Record<string, string> = {
  BEGINNER: '입문',
  INTERMEDIATE: '중급',
  ADVANCED: '고급',
};

const difficultyColors: Record<string, 'green' | 'blue' | 'orange'> = {
  BEGINNER: 'green',
  INTERMEDIATE: 'blue',
  ADVANCED: 'orange',
};

function ProgramCard({ program, onClick }: { program: CatalogProgram; onClick: () => void }) {
  return (
    <Card
      className="cursor-pointer transition-all hover:shadow-md"
      onClick={onClick}
      style={{ backgroundColor: designTokens.bg.default }}
    >
      {/* Thumbnail */}
      <div
        className="h-40 bg-cover bg-center rounded-t-lg"
        style={{
          backgroundColor: designTokens.bg.secondary,
          backgroundImage: program.thumbnailUrl ? `url(${program.thumbnailUrl})` : undefined,
        }}
      >
        {!program.thumbnailUrl && (
          <div className="h-full flex items-center justify-center">
            <BookOpen className="w-12 h-12" style={{ color: designTokens.text.placeholder }} />
          </div>
        )}
      </div>

      <CardContent className="p-4">
        {/* Category & Difficulty */}
        <div className="flex items-center gap-2 mb-2">
          {program.categoryName && (
            <Badge variant="gray" className="text-xs">
              {program.categoryName}
            </Badge>
          )}
          {program.difficulty && (
            <Badge variant={difficultyColors[program.difficulty]} className="text-xs">
              {difficultyLabels[program.difficulty]}
            </Badge>
          )}
        </div>

        {/* Title */}
        <h3
          className="font-semibold text-base mb-2 line-clamp-2"
          style={{ color: designTokens.text.primary }}
        >
          {program.title}
        </h3>

        {/* Description */}
        {program.description && (
          <p
            className="text-sm mb-3 line-clamp-2"
            style={{ color: designTokens.text.secondary }}
          >
            {program.description}
          </p>
        )}

        {/* Instructor */}
        {program.instructorName && (
          <p className="text-sm mb-3" style={{ color: designTokens.text.secondary }}>
            <GraduationCap className="w-4 h-4 inline-block mr-1" />
            {program.instructorName}
          </p>
        )}

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-xs" style={{ color: designTokens.text.secondary }}>
          {program.duration && (
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {Math.floor(program.duration / 60)}시간 {program.duration % 60}분
            </span>
          )}
          {program.enrollmentCount !== undefined && (
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {program.enrollmentCount.toLocaleString()}명
            </span>
          )}
          {program.rating !== undefined && (
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-current text-yellow-500" />
              {program.rating.toFixed(1)}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function ProgramListItem({ program, onClick }: { program: CatalogProgram; onClick: () => void }) {
  return (
    <div
      className="flex gap-4 p-4 rounded-lg cursor-pointer transition-all hover:bg-opacity-80"
      onClick={onClick}
      style={{ backgroundColor: designTokens.bg.default }}
    >
      {/* Thumbnail */}
      <div
        className="w-48 h-28 rounded-lg bg-cover bg-center flex-shrink-0"
        style={{
          backgroundColor: designTokens.bg.secondary,
          backgroundImage: program.thumbnailUrl ? `url(${program.thumbnailUrl})` : undefined,
        }}
      >
        {!program.thumbnailUrl && (
          <div className="h-full flex items-center justify-center">
            <BookOpen className="w-8 h-8" style={{ color: designTokens.text.placeholder }} />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Category & Difficulty */}
        <div className="flex items-center gap-2 mb-1">
          {program.categoryName && (
            <Badge variant="gray" className="text-xs">
              {program.categoryName}
            </Badge>
          )}
          {program.difficulty && (
            <Badge variant={difficultyColors[program.difficulty]} className="text-xs">
              {difficultyLabels[program.difficulty]}
            </Badge>
          )}
        </div>

        {/* Title */}
        <h3
          className="font-semibold text-base mb-1 truncate"
          style={{ color: designTokens.text.primary }}
        >
          {program.title}
        </h3>

        {/* Description */}
        {program.description && (
          <p
            className="text-sm mb-2 line-clamp-1"
            style={{ color: designTokens.text.secondary }}
          >
            {program.description}
          </p>
        )}

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-xs" style={{ color: designTokens.text.secondary }}>
          {program.instructorName && (
            <span className="flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5" />
              {program.instructorName}
            </span>
          )}
          {program.duration && (
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {Math.floor(program.duration / 60)}시간 {program.duration % 60}분
            </span>
          )}
          {program.enrollmentCount !== undefined && (
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {program.enrollmentCount.toLocaleString()}명
            </span>
          )}
          {program.rating !== undefined && (
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-current text-yellow-500" />
              {program.rating.toFixed(1)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export function CatalogPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // API 파라미터
  const params: CatalogFilterParams = {
    page,
    size: 12,
    search: searchQuery || undefined,
    difficulty: difficultyFilter !== 'all' ? difficultyFilter : undefined,
    sortBy: 'createdAt',
    sortDirection: 'DESC',
  };

  const { data, isLoading, isError } = useCatalogPrograms(params);

  const handleProgramClick = (programId: number) => {
    navigate(`/tu/catalog/${programId}`);
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
            강의 카탈로그
          </h1>
          <p style={{ color: designTokens.text.secondary, fontSize: '14px' }}>
            수강 가능한 강의를 탐색하고 수강신청하세요
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
                placeholder="강의 검색..."
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
            필터
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </Button>

          {/* View Toggle */}
          <div className="flex items-center gap-1 p-1 rounded-md" style={{ backgroundColor: designTokens.bg.secondary }}>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'grid' ? 'bg-white shadow-sm' : ''
              }`}
              style={{ color: viewMode === 'grid' ? designTokens.text.primary : designTokens.text.secondary }}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'list' ? 'bg-white shadow-sm' : ''
              }`}
              style={{ color: viewMode === 'list' ? designTokens.text.primary : designTokens.text.secondary }}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
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
                  난이도
                </label>
                <div className="flex gap-2">
                  {(['all', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED'] as Difficulty[]).map((level) => (
                    <Button
                      key={level}
                      variant={difficultyFilter === level ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        setDifficultyFilter(level);
                        setPage(0);
                      }}
                    >
                      {level === 'all' ? '전체' : difficultyLabels[level]}
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
            총 <span style={{ color: designTokens.text.primary, fontWeight: 600 }}>{data.totalElements}</span>개의 강의
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
              데이터를 불러오는 중 오류가 발생했습니다.
            </p>
          </div>
        )}

        {/* Empty State */}
        {data && data.content.length === 0 && (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 mx-auto mb-4" style={{ color: designTokens.text.placeholder }} />
            <h3
              className="text-lg font-medium mb-2"
              style={{ color: designTokens.text.primary }}
            >
              강의가 없습니다
            </h3>
            <p style={{ color: designTokens.text.secondary }}>
              검색 조건을 변경해 보세요
            </p>
          </div>
        )}

        {/* Program Grid/List */}
        {data && data.content.length > 0 && (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {data.content.map((program) => (
                  <ProgramCard
                    key={program.id}
                    program={program}
                    onClick={() => handleProgramClick(program.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-4 mb-8">
                {data.content.map((program) => (
                  <ProgramListItem
                    key={program.id}
                    program={program}
                    onClick={() => handleProgramClick(program.id)}
                  />
                ))}
              </div>
            )}

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
