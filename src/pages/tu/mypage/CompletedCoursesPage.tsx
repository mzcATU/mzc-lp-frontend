import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle,
  BookOpen,
  Loader2,
  Award,
  Calendar,
} from 'lucide-react';
import { useThemeStore } from '@/store/common/themeStore';
import { useTranslation, useLanguageStore } from '@/store/common/languageStore';
import { useMyEnrollments } from '@/hooks/tu';
import {
  Card,
  CardContent,
  Button,
  Badge,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/common';
import type { Enrollment } from '@/services/tu/enrollmentService';

interface CompletedCourseCardProps {
  enrollment: Enrollment;
  onClick: () => void;
  isDark: boolean;
  language: string;
}

function CompletedCourseCard({ enrollment, onClick, isDark, language }: CompletedCourseCardProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  };

  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-md ${
        isDark ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-gray-200'
      }`}
      onClick={onClick}
    >
      <CardContent className="p-5">
        {/* Header: Completed Badge */}
        <div className="flex items-center justify-between mb-3">
          <Badge variant="green" className="text-xs flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" />
            {language === 'ko' ? '수료 완료' : 'Completed'}
          </Badge>
          <div className={`flex items-center gap-1 text-xs ${isDark ? 'text-green-400' : 'text-green-600'}`}>
            <Award className="w-3.5 h-3.5" />
            <span>100%</span>
          </div>
        </div>

        {/* Program Title */}
        <h3 className={`font-semibold text-base mb-2 line-clamp-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {enrollment.programTitle}
        </h3>

        {/* Course Time Name */}
        <p className={`text-sm mb-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          {enrollment.courseTimeName}
        </p>

        {/* Progress Bar (100%) */}
        <div className="mb-3">
          <div className={`flex items-center justify-between text-xs mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            <span>{language === 'ko' ? '진도율' : 'Progress'}</span>
            <span className={`font-medium ${isDark ? 'text-green-400' : 'text-green-600'}`}>100%</span>
          </div>
          <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}>
            <div
              className="h-full rounded-full bg-green-500"
              style={{ width: '100%' }}
            />
          </div>
        </div>

        {/* Date Info */}
        <div className={`space-y-1 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>
              {language === 'ko' ? '학습 기간: ' : 'Period: '}
              {formatDate(enrollment.startDate)} ~ {formatDate(enrollment.endDate)}
            </span>
          </div>
          {enrollment.completedAt && (
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>
                {language === 'ko' ? '수료일: ' : 'Completed: '}
                {formatDate(enrollment.completedAt)}
              </span>
            </div>
          )}
        </div>

        {/* View Details Button */}
        <Button
          variant="outline"
          className={`w-full mt-4 ${isDark ? '!bg-transparent !border-white/20 !text-white hover:!bg-white/10' : ''}`}
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          <BookOpen className="w-4 h-4 mr-2" />
          {language === 'ko' ? '학습 내용 보기' : 'View Course'}
        </Button>
      </CardContent>
    </Card>
  );
}

export function CompletedCoursesPage() {
  const { theme } = useThemeStore();
  const { language } = useLanguageStore();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isDark = theme === 'dark';

  const [page, setPage] = useState(0);
  const pageSize = 12;

  // COMPLETED 상태의 수강 목록만 조회
  const { data, isLoading, isError } = useMyEnrollments({
    page,
    size: pageSize,
    status: 'COMPLETED',
  });

  const handleCourseClick = (enrollmentId: number) => {
    navigate(`/tu/b2c/mypage/learning/${enrollmentId}`);
  };

  return (
    <div className={`min-h-full p-6 sm:p-8 ${isDark ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              isDark ? 'bg-green-500/20' : 'bg-green-100'
            }`}>
              <CheckCircle className={`w-5 h-5 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
            </div>
            <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {t.mypage.completed}
            </h1>
          </div>
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            {t.mypage.completedDesc}
          </p>
        </div>

        {/* Results Count */}
        {data && (
          <p className={`mb-4 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {language === 'ko' ? '총 ' : 'Total '}
            <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {data.totalElements}
            </span>
            {language === 'ko' ? '개의 수료 강의' : ' completed courses'}
          </p>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className={`w-8 h-8 animate-spin ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="text-center py-20">
            <p className="text-red-500">
              {language === 'ko' ? '데이터를 불러오는데 실패했습니다.' : 'Failed to load data.'}
            </p>
          </div>
        )}

        {/* Empty State */}
        {data && data.content.length === 0 && (
          <div
            className={`text-center py-20 rounded-xl ${
              isDark ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-200'
            }`}
          >
            <CheckCircle className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
            <h3 className={`text-lg font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {language === 'ko' ? '수료한 강의가 없습니다' : 'No completed courses'}
            </h3>
            <p className={`mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {language === 'ko'
                ? '강의를 완료하면 여기에 표시됩니다.'
                : 'Completed courses will appear here.'}
            </p>
            <Button variant="brand" onClick={() => navigate('/tu/b2c/mypage/learning')}>
              {language === 'ko' ? '학습 중인 강의 보기' : 'View Current Courses'}
            </Button>
          </div>
        )}

        {/* Completed Courses Grid */}
        {data && data.content.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {data.content.map((enrollment) => (
                <CompletedCourseCard
                  key={enrollment.id}
                  enrollment={enrollment}
                  onClick={() => handleCourseClick(enrollment.id)}
                  isDark={isDark}
                  language={language}
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
