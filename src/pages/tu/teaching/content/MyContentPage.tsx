import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Eye, Edit, Trash2, FileText, Calendar, ChevronDown, File } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button, Badge } from '@/components/common';

type ContentType = 'assignment' | 'notice' | 'reference';

interface Content {
  id: string;
  title: string;
  type: ContentType;
  registrationDate: string;
  fileName: string;
  fileSize: string;
  fileType: string;
}

interface MyContentPageProps {
  language?: 'ko' | 'en';
}

const mockContents: Content[] = [
  { id: '1', title: '1주차 과제: React 기초 실습', type: 'assignment', registrationDate: '2024-11-15', fileName: 'react-assignment-week1.pdf', fileSize: '2.4 MB', fileType: 'PDF' },
  { id: '2', title: '강의 일정 변경 안내', type: 'notice', registrationDate: '2024-11-20', fileName: 'schedule-change-notice.pdf', fileSize: '1.2 MB', fileType: 'PDF' },
  { id: '3', title: 'TypeScript 공식 문서 번역본', type: 'reference', registrationDate: '2024-11-10', fileName: 'typescript-docs-kr.pdf', fileSize: '5.8 MB', fileType: 'PDF' },
  { id: '4', title: '2주차 과제: 컴포넌트 설계', type: 'assignment', registrationDate: '2024-11-22', fileName: 'component-design-assignment.pdf', fileSize: '3.1 MB', fileType: 'PDF' },
  { id: '5', title: 'Node.js 개발 환경 설정 가이드', type: 'reference', registrationDate: '2024-11-05', fileName: 'nodejs-setup-guide.pdf', fileSize: '4.5 MB', fileType: 'PDF' },
  { id: '6', title: '중간 평가 일정 공지', type: 'notice', registrationDate: '2024-11-18', fileName: 'midterm-evaluation-notice.pdf', fileSize: '890 KB', fileType: 'PDF' },
];

const t = {
  title: { ko: '내 콘텐츠', en: 'My Content' },
  subtitle: { ko: '등록한 콘텐츠를 관리하고 새로운 콘텐츠를 업로드하세요.', en: 'Manage your content and upload new materials.' },
  createContent: { ko: '콘텐츠 등록', en: 'Add Content' },
  searchPlaceholder: { ko: '콘텐츠 검색...', en: 'Search content...' },
  filter: { ko: '필터', en: 'Filter' },
  contentType: { ko: '콘텐츠 유형', en: 'Content Type' },
  all: { ko: '전체', en: 'All' },
  assignment: { ko: '과제', en: 'Assignment' },
  notice: { ko: '안내', en: 'Notice' },
  reference: { ko: '참고 자료', en: 'Reference' },
  totalContent: { ko: '전체 콘텐츠', en: 'Total Content' },
  registrationDate: { ko: '등록일', en: 'Registered' },
  view: { ko: '확인', en: 'View' },
  edit: { ko: '수정', en: 'Edit' },
  noResults: { ko: '검색 결과가 없습니다.', en: 'No results found.' },
};

// 콘텐츠 타입별 색상
const typeColors: Record<ContentType, { bg: string; text: string }> = {
  assignment: { bg: '#E3F2FD', text: '#1565C0' },
  notice: { bg: '#FFF3E0', text: '#E65100' },
  reference: { bg: '#E8F5E9', text: '#2E7D32' },
};

export function MyContentPage({ language = 'ko' }: Readonly<MyContentPageProps>) {
  const navigate = useNavigate();
  const [contents] = useState<Content[]>(mockContents);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | ContentType>('all');
  const [showFilters, setShowFilters] = useState(false);

  const getText = (key: keyof typeof t) => (language === 'ko' ? t[key].ko : t[key].en);

  const filteredContents = contents.filter((content) => {
    const matchesSearch = content.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || content.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const contentStats = {
    total: contents.length,
    assignment: contents.filter((c) => c.type === 'assignment').length,
    notice: contents.filter((c) => c.type === 'notice').length,
    reference: contents.filter((c) => c.type === 'reference').length,
  };

  return (
    <div className="h-full flex flex-col bg-bg-app">
      {/* Top Bar */}
      <div className="border-b border-border bg-bg-default sticky top-0 z-10">
        <div className="p-6 px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-text-primary mb-1">{getText('title')}</h1>
              <p className="text-text-secondary text-sm m-0">{getText('subtitle')}</p>
            </div>
            <Button onClick={() => navigate('/tu/teaching/content/create')}>
              <Plus size={20} />
              <span>{getText('createContent')}</span>
            </Button>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
              <input
                type="text"
                placeholder={getText('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg text-text-primary text-sm outline-none focus:ring-2 focus:ring-action-primary"
              />
            </div>
            <Button variant="ghost" onClick={() => setShowFilters(!showFilters)} className="border border-border">
              <Filter size={20} />
              <span>{getText('filter')}</span>
              <ChevronDown size={16} className={cn('transition-transform', showFilters && 'rotate-180')} />
            </Button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-4 p-4 border border-border rounded-lg bg-bg-secondary">
              <label className="block text-sm text-text-primary mb-2">{getText('contentType')}</label>
              <div className="flex flex-wrap gap-2">
                {(['all', 'assignment', 'notice', 'reference'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setTypeFilter(type)}
                    className={cn(
                      'px-4 py-2 rounded-lg text-sm cursor-pointer transition-colors',
                      typeFilter === type
                        ? 'bg-btn-neutral text-white'
                        : 'bg-bg-default text-text-primary border border-border hover:bg-bg-secondary'
                    )}
                  >
                    {getText(type)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content List */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 px-8">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard label={getText('totalContent')} value={contentStats.total} />
            <StatCard label={getText('assignment')} value={contentStats.assignment} />
            <StatCard label={getText('notice')} value={contentStats.notice} />
            <StatCard label={getText('reference')} value={contentStats.reference} />
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredContents.length === 0 ? (
              <div className="col-span-full text-center py-12 text-text-secondary">
                <FileText size={48} className="mx-auto mb-3 text-text-placeholder" />
                <p>{getText('noResults')}</p>
              </div>
            ) : (
              filteredContents.map((content) => (
                <ContentCard key={content.id} content={content} getText={getText} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// 통계 카드 컴포넌트
function StatCard({ label, value }: Readonly<{ label: string; value: number }>) {
  return (
    <div className="bg-bg-default border border-border rounded-lg p-4">
      <p className="text-sm text-text-secondary mb-1">{label}</p>
      <p className="text-2xl text-text-primary font-semibold m-0">{value}</p>
    </div>
  );
}

// 콘텐츠 카드 컴포넌트
function ContentCard({ content, getText }: Readonly<{ content: Content; getText: (key: keyof typeof t) => string }>) {
  const colors = typeColors[content.type];

  return (
    <div className="bg-bg-default border border-border rounded-lg p-5 transition-shadow hover:shadow-md cursor-pointer">
      {/* Content Header */}
      <div className="mb-3">
        <h3 className="text-text-primary mb-2 text-base leading-snug">{content.title}</h3>
        <Badge variant="custom" customBg={colors.bg} customText={colors.text}>
          {getText(content.type)}
        </Badge>
      </div>

      {/* File Info */}
      <div className="mb-4 p-3 rounded-lg bg-bg-app">
        <div className="flex items-center gap-2 mb-2">
          <File size={16} className="text-text-secondary" />
          <span className="text-sm text-text-primary truncate">{content.fileName}</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-text-secondary">
          <span>{content.fileType}</span>
          <span>•</span>
          <span>{content.fileSize}</span>
        </div>
      </div>

      {/* Registration Date */}
      <div className="flex items-center gap-2 mb-4 text-sm text-text-secondary">
        <Calendar size={16} />
        <span>{getText('registrationDate')}: {content.registrationDate}</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" className="flex-1 border border-border">
          <Eye size={16} />
          <span>{getText('view')}</span>
        </Button>
        <Button variant="ghost" size="sm" className="flex-1 border border-border">
          <Edit size={16} />
          <span>{getText('edit')}</span>
        </Button>
        <Button variant="danger" size="sm" className="px-3">
          <Trash2 size={16} />
        </Button>
      </div>
    </div>
  );
}
