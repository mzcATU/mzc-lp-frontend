/**
 * 강의 미리보기 페이지
 * 수강생이 보게 될 강의 모습을 미리보기
 * sessionStorage에서 formData를 읽어와 CourseDetailPage와 동일한 UI로 표시
 */
import { useState, useEffect } from 'react';
import {
  X,
  Eye,
  Clock,
  FileText,
  ChevronDown,
  ChevronRight,
  PlayCircle,
  AlertCircle,
  BookOpen,
  Tag,
} from 'lucide-react';
import { useThemeStore } from '@/store/common/themeStore';
import type { CourseFormData } from '@/types';
import type { CategoryResponse } from '@/types/common';
import type { CurriculumItem } from '@/types/tu';
import { isCurriculumFolder, isCurriculumContent } from '@/types/tu';
import { translations, type TranslationKey } from './components/courseCreate.constants';
import { COURSE_LEVEL_LABELS } from '@/types/common/course.types';

interface PreviewData {
  formData: CourseFormData;
  categories: CategoryResponse[];
  language: 'ko' | 'en';
}

/**
 * 커리큘럼 섹션 컴포넌트 (트리 구조)
 */
interface CurriculumSectionProps {
  item: CurriculumItem;
  isExpanded: boolean;
  onToggle: () => void;
  isDark: boolean;
}

function CurriculumSection({ item, isExpanded, onToggle, isDark }: CurriculumSectionProps) {
  const isFolder = isCurriculumFolder(item);
  const isContent = isCurriculumContent(item);

  if (!isFolder) {
    // 콘텐츠 아이템 - 카드 스타일로 표시
    return (
      <div
        className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${
          isDark
            ? 'glass border-white/10 hover:bg-white/5'
            : 'bg-white border-gray-200 hover:bg-gray-50'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              isDark ? 'bg-white/10' : 'bg-gray-100'
            }`}
          >
            <PlayCircle className={`w-4 h-4 ${isDark ? 'text-[#6bc2f0]' : 'text-[#6778ff]'}`} />
          </div>
          <span className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
            {isContent && item.displayName ? item.displayName : item.name}
          </span>
        </div>
      </div>
    );
  }

  // 폴더 아이템
  const childCount = item.children?.length || 0;

  return (
    <div
      className={`rounded-xl overflow-hidden border ${
        isDark ? 'glass border-white/10' : 'bg-white border-gray-200'
      }`}
    >
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between p-4 transition-colors ${
          isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50'
        }`}
      >
        <div className="flex items-center gap-3">
          <ChevronDown
            className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''} ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}
          />
          <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {item.name}
          </span>
        </div>
        <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          {childCount}개 항목
        </span>
      </button>
      {isExpanded && item.children && item.children.length > 0 && (
        <div className={`border-t ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
          {item.children.map((child) => {
            const childIsContent = isCurriculumContent(child);
            return (
              <div
                key={child.id}
                className={`flex items-center justify-between p-4 pl-12 transition-colors ${
                  isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isDark ? 'bg-white/10' : 'bg-gray-100'
                    }`}
                  >
                    {isCurriculumFolder(child) ? (
                      <FileText className={`w-4 h-4 ${isDark ? 'text-[#6bc2f0]' : 'text-[#6778ff]'}`} />
                    ) : (
                      <PlayCircle className={`w-4 h-4 ${isDark ? 'text-[#6bc2f0]' : 'text-[#6778ff]'}`} />
                    )}
                  </div>
                  <span className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                    {childIsContent && child.displayName ? child.displayName : child.name}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function CoursePreviewPage() {
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [expandedSections, setExpandedSections] = useState<number[]>([0]);
  const [activeTab, setActiveTab] = useState<'intro' | 'curriculum'>('intro');
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  // sessionStorage에서 미리보기 데이터 로드
  useEffect(() => {
    const stored = sessionStorage.getItem('course-preview-data');
    if (stored) {
      try {
        const data: PreviewData = JSON.parse(stored);
        setPreviewData(data);
      } catch {
        console.error('미리보기 데이터 파싱 실패');
      }
    }
  }, []);

  const toggleSection = (index: number) => {
    if (expandedSections.includes(index)) {
      setExpandedSections(expandedSections.filter((i) => i !== index));
    } else {
      setExpandedSections([...expandedSections, index]);
    }
  };

  const handleClose = () => {
    window.close();
  };

  const getText = (key: TranslationKey) =>
    previewData ? (previewData.language === 'ko' ? translations[key].ko : translations[key].en) : translations[key].ko;

  if (!previewData) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDark ? 'landing-dark bg-[#1e1e1e]' : 'landing-light bg-gray-50'
        }`}
      >
        <div className="text-center">
          <AlertCircle size={48} className="text-text-tertiary mx-auto mb-4" />
          <p className={`text-xl ${isDark ? 'text-white' : 'text-gray-900'}`}>
            미리보기 데이터가 없습니다.
          </p>
          <button
            onClick={handleClose}
            className="mt-4 px-4 py-2 border rounded-lg transition-colors"
          >
            창 닫기
          </button>
        </div>
      </div>
    );
  }

  const { formData, categories } = previewData;

  // 카테고리 정보
  const categoryName = categories.find((cat) => cat.id === formData.categoryId)?.name;

  // 레벨 라벨
  const levelLabel = formData.level ? COURSE_LEVEL_LABELS[formData.level] : null;

  // 썸네일
  const thumbnailUrl =
    formData.thumbnailUrl ||
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=450&fit=crop';

  return (
    <div className={`min-h-screen ${isDark ? 'landing-dark bg-[#1e1e1e]' : 'landing-light bg-gray-50'}`}>
      {/* 미리보기 모드 배너 */}
      <div className="bg-action-primary text-white px-6 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Eye size={18} />
          <span className="font-medium">{getText('previewMode')}</span>
          <span className="text-white/80 text-sm ml-2">- {getText('previewDesc')}</span>
        </div>
        <button
          onClick={handleClose}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-white hover:bg-white/20 border border-white/30 transition-colors"
        >
          <X size={16} />
          {getText('closePreview')}
        </button>
      </div>

      {/* Hero Section */}
      <div
        className={`py-12 ${
          isDark
            ? 'bg-gradient-to-b from-[#1a1a2e] to-[#1e1e1e]'
            : 'bg-gradient-to-b from-gray-100 to-gray-50'
        }`}
      >
        <div className="w-full px-4 md:px-8 lg:px-16">
          <div className="flex flex-col lg:flex-row gap-8 lg:items-start">
            {/* Left Content */}
            <div className="flex-1">
              {/* Breadcrumb */}
              <nav
                className={`flex items-center gap-2 text-sm mb-4 ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}
              >
                <span className={`transition-colors`}>
                  강의
                </span>
                <ChevronRight className="w-4 h-4" />
                <span className={isDark ? 'text-white' : 'text-gray-900'}>{formData.title || '제목 없음'}</span>
              </nav>

              {/* Tags */}
              <div className="flex gap-2 mb-4">
                {/* 카테고리 태그 */}
                {categoryName && (
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      isDark ? 'bg-white/10 text-gray-300' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {categoryName}
                  </span>
                )}

                {/* 레벨 태그 */}
                {levelLabel && (
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      isDark ? 'bg-white/10 text-gray-300' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {levelLabel}
                  </span>
                )}

                {/* 미리보기 태그 */}
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-[#6778ff] to-[#a855f7] text-white">
                  미리보기
                </span>
              </div>

              {/* Title */}
              <h1
                className={`text-3xl md:text-4xl font-bold mb-4 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                {formData.title || '제목 없음'}
              </h1>

              {/* Description */}
              {formData.description && (
                <p className={`mb-6 leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {formData.description}
                </p>
              )}

              {/* Tags */}
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-action-primary/10 text-action-primary text-sm rounded-md"
                    >
                      <Tag size={12} />
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Thumbnail */}
              <div
                className={`rounded-xl overflow-hidden border ${
                  isDark ? 'glass border-white/10' : 'bg-white border-gray-200'
                }`}
              >
                <div className="relative aspect-video">
                  <img
                    src={thumbnailUrl}
                    alt={formData.title || '강의 썸네일'}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Right - Course Card */}
            <div className="lg:w-96">
              <div
                className={`rounded-2xl overflow-hidden sticky top-24 border ${
                  isDark ? 'glass border-white/10' : 'bg-white border-gray-200 shadow-lg'
                }`}
              >
                <div className="p-6">
                  {/* 미리보기 안내 */}
                  <div
                    className={`mb-6 p-4 rounded-lg border ${
                      isDark
                        ? 'bg-blue-500/10 border-blue-500/30'
                        : 'bg-blue-50 border-blue-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Eye className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                      <span className={`font-medium ${isDark ? 'text-blue-300' : 'text-blue-800'}`}>
                        미리보기 모드
                      </span>
                    </div>
                    <p className={`text-sm ${isDark ? 'text-blue-200' : 'text-blue-700'}`}>
                      실제 수강생에게 이렇게 보입니다
                    </p>
                  </div>

                  {/* 카테고리 정보 */}
                  {categoryName && (
                    <div
                      className={`mb-4 flex items-center gap-2 text-sm ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>{categoryName}</span>
                    </div>
                  )}

                  {/* 레벨 정보 */}
                  {levelLabel && (
                    <div
                      className={`mb-4 flex items-center gap-2 text-sm ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}
                    >
                      <FileText className="w-4 h-4" />
                      <span>{levelLabel}</span>
                    </div>
                  )}

                  {/* 커리큘럼 항목 개수 */}
                  {formData.curriculumItems.length > 0 && (
                    <div
                      className={`mb-4 flex items-center gap-2 text-sm ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}
                    >
                      <Clock className="w-4 h-4" />
                      <span>{formData.curriculumItems.length}개 커리큘럼 항목</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className={`border-b ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
        <div className="w-full px-4 md:px-8 lg:px-16">
          <div className="flex gap-8 max-w-4xl">
            <button
              onClick={() => setActiveTab('intro')}
              className={`py-4 font-medium transition-colors relative ${
                activeTab === 'intro'
                  ? isDark
                    ? 'text-white'
                    : 'text-gray-900'
                  : isDark
                    ? 'text-gray-400 hover:text-gray-300'
                    : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              강의 소개
              {activeTab === 'intro' && (
                <div
                  className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                    isDark ? 'bg-white' : 'bg-gray-900'
                  }`}
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab('curriculum')}
              className={`py-4 font-medium transition-colors relative ${
                activeTab === 'curriculum'
                  ? isDark
                    ? 'text-white'
                    : 'text-gray-900'
                  : isDark
                    ? 'text-gray-400 hover:text-gray-300'
                    : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              커리큘럼
              {activeTab === 'curriculum' && (
                <div
                  className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                    isDark ? 'bg-white' : 'bg-gray-900'
                  }`}
                />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="w-full px-4 md:px-8 lg:px-16 py-12">
        <div className="max-w-4xl">
          {/* 강의 소개 탭 */}
          {activeTab === 'intro' && (
            <>
              {/* 과정 설명 */}
              {formData.description && (
                <section className="mb-12">
                  <h2
                    className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}
                  >
                    강의 소개
                  </h2>
                  <div
                    className={`rounded-xl p-6 border ${
                      isDark ? 'glass border-white/10' : 'bg-white border-gray-200'
                    }`}
                  >
                    <p className={`leading-relaxed whitespace-pre-wrap ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {formData.description}
                    </p>
                  </div>
                </section>
              )}
            </>
          )}

          {/* 커리큘럼 탭 */}
          {activeTab === 'curriculum' && (
            <section className="mb-12">
              <h2
                className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}
              >
                커리큘럼
              </h2>
              {formData.curriculumItems && formData.curriculumItems.length > 0 ? (
                <div className="space-y-3">
                  {formData.curriculumItems.map((item, index) => (
                    <CurriculumSection
                      key={item.id}
                      item={item}
                      isExpanded={expandedSections.includes(index)}
                      onToggle={() => toggleSection(index)}
                      isDark={isDark}
                    />
                  ))}
                </div>
              ) : (
                <div
                  className={`rounded-xl p-8 text-center border ${
                    isDark ? 'glass border-white/10' : 'bg-white border-gray-200'
                  }`}
                >
                  <FileText
                    className={`w-12 h-12 mx-auto mb-4 ${
                      isDark ? 'text-gray-600' : 'text-gray-300'
                    }`}
                  />
                  <p className={`font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    커리큘럼 준비 중
                  </p>
                  <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                    상세 커리큘럼은 곧 업데이트될 예정입니다.
                  </p>
                </div>
              )}
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
