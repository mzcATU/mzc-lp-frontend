import { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  FileText,
  Calendar,
  ChevronDown,
  File,
} from 'lucide-react';
import { designTokens } from '@/styles/design-tokens';

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
  onCreateContent?: () => void;
  language?: 'ko' | 'en';
}

const mockContents: Content[] = [
  {
    id: '1',
    title: '1주차 과제: React 기초 실습',
    type: 'assignment',
    registrationDate: '2024-11-15',
    fileName: 'react-assignment-week1.pdf',
    fileSize: '2.4 MB',
    fileType: 'PDF',
  },
  {
    id: '2',
    title: '강의 일정 변경 안내',
    type: 'notice',
    registrationDate: '2024-11-20',
    fileName: 'schedule-change-notice.pdf',
    fileSize: '1.2 MB',
    fileType: 'PDF',
  },
  {
    id: '3',
    title: 'TypeScript 공식 문서 번역본',
    type: 'reference',
    registrationDate: '2024-11-10',
    fileName: 'typescript-docs-kr.pdf',
    fileSize: '5.8 MB',
    fileType: 'PDF',
  },
  {
    id: '4',
    title: '2주차 과제: 컴포넌트 설계',
    type: 'assignment',
    registrationDate: '2024-11-22',
    fileName: 'component-design-assignment.pdf',
    fileSize: '3.1 MB',
    fileType: 'PDF',
  },
  {
    id: '5',
    title: 'Node.js 개발 환경 설정 가이드',
    type: 'reference',
    registrationDate: '2024-11-05',
    fileName: 'nodejs-setup-guide.pdf',
    fileSize: '4.5 MB',
    fileType: 'PDF',
  },
  {
    id: '6',
    title: '중간 평가 일정 공지',
    type: 'notice',
    registrationDate: '2024-11-18',
    fileName: 'midterm-evaluation-notice.pdf',
    fileSize: '890 KB',
    fileType: 'PDF',
  },
];

const t = {
  title: { ko: '내 콘텐츠', en: 'My Content' },
  subtitle: {
    ko: '등록한 콘텐츠를 관리하고 새로운 콘텐츠를 업로드하세요.',
    en: 'Manage your content and upload new materials.',
  },
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

export function MyContentPage({
  onCreateContent,
  language = 'ko',
}: MyContentPageProps) {
  const [contents] = useState<Content[]>(mockContents);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | ContentType>('all');
  const [showFilters, setShowFilters] = useState(false);

  const getText = (key: keyof typeof t) => {
    return language === 'ko' ? t[key].ko : t[key].en;
  };

  const getTypeBadge = (type: ContentType) => {
    const badges = {
      assignment: {
        bg: '#E3F2FD',
        color: '#1565C0',
        text: getText('assignment'),
      },
      notice: {
        bg: '#FFF3E0',
        color: '#E65100',
        text: getText('notice'),
      },
      reference: {
        bg: '#E8F5E9',
        color: '#2E7D32',
        text: getText('reference'),
      },
    };
    const badge = badges[type];
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: '2px 10px',
          borderRadius: '4px',
          fontSize: '12px',
          backgroundColor: badge.bg,
          color: badge.color,
        }}
      >
        {badge.text}
      </span>
    );
  };

  const filteredContents = contents.filter((content) => {
    const matchesSearch = content.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
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
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: designTokens.bg.default,
      }}
    >
      {/* Top Bar */}
      <div
        style={{
          borderBottom: `1px solid ${designTokens.bg.border}`,
          backgroundColor: designTokens.bg.default,
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <div style={{ padding: '24px 32px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '24px',
            }}
          >
            <div>
              <h1
                style={{
                  color: designTokens.text.primary,
                  marginBottom: '4px',
                }}
              >
                {getText('title')}
              </h1>
              <p
                style={{
                  color: designTokens.text.secondary,
                  fontSize: '14px',
                  margin: 0,
                }}
              >
                {getText('subtitle')}
              </p>
            </div>
            <button
              onClick={onCreateContent}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                borderRadius: '8px',
                color: designTokens.button.neutral_text,
                backgroundColor: designTokens.button.neutral_default,
                border: 'none',
                cursor: 'pointer',
                transition: 'all 150ms ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  designTokens.button.neutral_hover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  designTokens.button.neutral_default;
              }}
            >
              <Plus size={20} />
              <span>{getText('createContent')}</span>
            </button>
          </div>

          {/* Search and Filter Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <Search
                size={20}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: designTokens.text.secondary,
                }}
              />
              <input
                type="text"
                placeholder={getText('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  paddingLeft: '40px',
                  paddingRight: '16px',
                  paddingTop: '10px',
                  paddingBottom: '10px',
                  border: `1px solid ${designTokens.bg.border}`,
                  borderRadius: '8px',
                  color: designTokens.text.primary,
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                border: `1px solid ${designTokens.bg.border}`,
                borderRadius: '8px',
                color: designTokens.text.primary,
                backgroundColor: 'transparent',
                cursor: 'pointer',
                transition: 'all 150ms ease',
              }}
            >
              <Filter size={20} />
              <span>{getText('filter')}</span>
              <ChevronDown
                size={16}
                style={{
                  transition: 'transform 150ms ease',
                  transform: showFilters ? 'rotate(180deg)' : 'rotate(0deg)',
                }}
              />
            </button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div
              style={{
                marginTop: '16px',
                padding: '16px',
                border: `1px solid ${designTokens.bg.border}`,
                borderRadius: '8px',
                backgroundColor: designTokens.bg.secondary,
              }}
            >
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  color: designTokens.text.primary,
                  marginBottom: '8px',
                }}
              >
                {getText('contentType')}
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {(['all', 'assignment', 'notice', 'reference'] as const).map(
                  (type) => (
                    <button
                      key={type}
                      onClick={() => setTypeFilter(type)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '8px',
                        fontSize: '14px',
                        cursor: 'pointer',
                        transition: 'all 150ms ease',
                        backgroundColor:
                          typeFilter === type
                            ? designTokens.button.neutral_default
                            : designTokens.bg.default,
                        color:
                          typeFilter === type
                            ? designTokens.button.neutral_text
                            : designTokens.text.primary,
                        border:
                          typeFilter === type
                            ? 'none'
                            : `1px solid ${designTokens.bg.border}`,
                      }}
                    >
                      {getText(type)}
                    </button>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content List */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        <div style={{ padding: '24px 32px' }}>
          {/* Statistics Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              marginBottom: '24px',
            }}
          >
            <div
              style={{
                backgroundColor: designTokens.bg.default,
                border: `1px solid ${designTokens.bg.border}`,
                borderRadius: '8px',
                padding: '16px',
              }}
            >
              <p
                style={{
                  fontSize: '14px',
                  color: designTokens.text.secondary,
                  marginBottom: '4px',
                }}
              >
                {getText('totalContent')}
              </p>
              <p
                style={{
                  fontSize: '24px',
                  color: designTokens.text.primary,
                  fontWeight: 600,
                  margin: 0,
                }}
              >
                {contentStats.total}
              </p>
            </div>
            <div
              style={{
                backgroundColor: designTokens.bg.default,
                border: `1px solid ${designTokens.bg.border}`,
                borderRadius: '8px',
                padding: '16px',
              }}
            >
              <p
                style={{
                  fontSize: '14px',
                  color: designTokens.text.secondary,
                  marginBottom: '4px',
                }}
              >
                {getText('assignment')}
              </p>
              <p
                style={{
                  fontSize: '24px',
                  color: designTokens.text.primary,
                  fontWeight: 600,
                  margin: 0,
                }}
              >
                {contentStats.assignment}
              </p>
            </div>
            <div
              style={{
                backgroundColor: designTokens.bg.default,
                border: `1px solid ${designTokens.bg.border}`,
                borderRadius: '8px',
                padding: '16px',
              }}
            >
              <p
                style={{
                  fontSize: '14px',
                  color: designTokens.text.secondary,
                  marginBottom: '4px',
                }}
              >
                {getText('notice')}
              </p>
              <p
                style={{
                  fontSize: '24px',
                  color: designTokens.text.primary,
                  fontWeight: 600,
                  margin: 0,
                }}
              >
                {contentStats.notice}
              </p>
            </div>
            <div
              style={{
                backgroundColor: designTokens.bg.default,
                border: `1px solid ${designTokens.bg.border}`,
                borderRadius: '8px',
                padding: '16px',
              }}
            >
              <p
                style={{
                  fontSize: '14px',
                  color: designTokens.text.secondary,
                  marginBottom: '4px',
                }}
              >
                {getText('reference')}
              </p>
              <p
                style={{
                  fontSize: '24px',
                  color: designTokens.text.primary,
                  fontWeight: 600,
                  margin: 0,
                }}
              >
                {contentStats.reference}
              </p>
            </div>
          </div>

          {/* Content Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '16px',
            }}
          >
            {filteredContents.length === 0 ? (
              <div
                style={{
                  gridColumn: '1 / -1',
                  textAlign: 'center',
                  padding: '48px 20px',
                  color: designTokens.text.secondary,
                }}
              >
                <FileText
                  size={48}
                  style={{
                    margin: '0 auto 12px',
                    color: designTokens.text.placeholder,
                  }}
                />
                <p>{getText('noResults')}</p>
              </div>
            ) : (
              filteredContents.map((content) => (
                <div
                  key={content.id}
                  style={{
                    backgroundColor: designTokens.bg.default,
                    border: `1px solid ${designTokens.bg.border}`,
                    borderRadius: '8px',
                    padding: '20px',
                    transition: 'all 150ms ease',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow =
                      '0 4px 12px rgba(0,0,0,0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {/* Content Header */}
                  <div style={{ marginBottom: '12px' }}>
                    <h3
                      style={{
                        color: designTokens.text.primary,
                        marginBottom: '8px',
                        fontSize: '16px',
                        lineHeight: 1.4,
                      }}
                    >
                      {content.title}
                    </h3>
                    {getTypeBadge(content.type)}
                  </div>

                  {/* File Info */}
                  <div
                    style={{
                      marginBottom: '16px',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: designTokens.bg.app_default,
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '8px',
                      }}
                    >
                      <File size={16} color={designTokens.text.secondary} />
                      <span
                        style={{
                          fontSize: '14px',
                          color: designTokens.text.primary,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {content.fileName}
                      </span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        fontSize: '12px',
                        color: designTokens.text.secondary,
                      }}
                    >
                      <span>{content.fileType}</span>
                      <span>•</span>
                      <span>{content.fileSize}</span>
                    </div>
                  </div>

                  {/* Registration Date */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '16px',
                      fontSize: '14px',
                      color: designTokens.text.secondary,
                    }}
                  >
                    <Calendar size={16} />
                    <span>
                      {getText('registrationDate')}: {content.registrationDate}
                    </span>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      style={{
                        flex: 1,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '8px 12px',
                        border: `1px solid ${designTokens.bg.border}`,
                        borderRadius: '8px',
                        fontSize: '14px',
                        color: designTokens.text.primary,
                        backgroundColor: 'transparent',
                        cursor: 'pointer',
                        transition: 'all 150ms ease',
                      }}
                    >
                      <Eye size={16} />
                      <span>{getText('view')}</span>
                    </button>
                    <button
                      style={{
                        flex: 1,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '8px 12px',
                        border: `1px solid ${designTokens.bg.border}`,
                        borderRadius: '8px',
                        fontSize: '14px',
                        color: designTokens.text.primary,
                        backgroundColor: 'transparent',
                        cursor: 'pointer',
                        transition: 'all 150ms ease',
                      }}
                    >
                      <Edit size={16} />
                      <span>{getText('edit')}</span>
                    </button>
                    <button
                      style={{
                        padding: '8px 12px',
                        border: `1px solid ${designTokens.bg.border}`,
                        borderRadius: '8px',
                        fontSize: '14px',
                        backgroundColor: 'transparent',
                        cursor: 'pointer',
                        transition: 'all 150ms ease',
                      }}
                    >
                      <Trash2 size={16} color={designTokens.action.delete_text} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
