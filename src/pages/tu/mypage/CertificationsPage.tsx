import { useState } from 'react';
import { Award, Loader2 } from 'lucide-react';
import { useThemeStore } from '@/store/common/themeStore';
import { useTranslation, useLanguageStore } from '@/store/common/languageStore';
import { useAuthStore } from '@/store/common/authStore';
import { useMyEnrollments } from '@/hooks/tu';
import {
  Button,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/common';
import { CertificateCard, CertificatePreviewModal } from '@/components/domain/tu/certificate';
import type { Enrollment } from '@/services/tu/enrollmentService';

export function CertificationsPage() {
  const { theme } = useThemeStore();
  const { language } = useLanguageStore();
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const isDark = theme === 'dark';

  const [page, setPage] = useState(0);
  const pageSize = 12;

  // 수료증 미리보기 모달 상태
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // COMPLETED 상태의 수강 목록만 조회
  const { data, isLoading, isError } = useMyEnrollments({
    page,
    size: pageSize,
    status: 'COMPLETED',
  });

  // 수료증 카드 라벨
  const cardLabels = {
    completedOn: language === 'ko' ? '수료일' : 'Completed on',
    view: language === 'ko' ? '보기' : 'View',
    download: language === 'ko' ? '다운로드' : 'Download',
    preparing: language === 'ko' ? '준비 중' : 'Preparing',
    certificateOf: language === 'ko' ? '수료증' : 'Certificate of',
    completion: language === 'ko' ? '수료' : 'Completion',
  };

  // 수료증 모달 라벨
  const modalLabels = {
    title: language === 'ko' ? '수료증 미리보기' : 'Certificate Preview',
    certificateOf: language === 'ko' ? '수료증' : 'Certificate of',
    completion: language === 'ko' ? '수료' : 'Completion',
    certifyThat: language === 'ko' ? '다음의 사용자가' : 'This is to certify that',
    hasCompleted: language === 'ko' ? '아래 과정을 성공적으로 수료하였음을 인증합니다.' : 'has successfully completed the following course.',
    issuedOn: language === 'ko' ? '수료일' : 'Issued on',
    learningPeriod: language === 'ko' ? '학습 기간' : 'Learning Period',
    download: language === 'ko' ? 'PDF 다운로드' : 'Download PDF',
    preparing: language === 'ko' ? '준비 중' : 'Preparing',
    close: language === 'ko' ? '닫기' : 'Close',
    organization: language === 'ko' ? '발급 기관' : 'Organization',
  };

  const handlePreview = (enrollment: Enrollment) => {
    setSelectedEnrollment(enrollment);
    setIsPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    setSelectedEnrollment(null);
  };

  // TODO: Phase 2에서 실제 Certificate API 연동 시 구현
  const handleDownload = () => {
    // Certificate API: GET /api/certificates/{id}/download
    console.log('PDF download - Phase 2');
  };

  const userName = user?.name || (language === 'ko' ? '학습자' : 'Learner');

  return (
    <div className={`min-h-full p-6 sm:p-8 ${isDark ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              isDark ? 'bg-yellow-500/20' : 'bg-amber-100'
            }`}>
              <Award className={`w-5 h-5 ${isDark ? 'text-yellow-400' : 'text-amber-600'}`} />
            </div>
            <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {t.mypage.certificates}
            </h1>
          </div>
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            {t.mypage.certificatesDesc}
          </p>
        </div>

        {/* Results Count */}
        {data && (
          <p className={`mb-4 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {language === 'ko' ? '총 ' : 'Total '}
            <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {data.totalElements}
            </span>
            {language === 'ko' ? '개의 수료증' : ' certificates'}
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
            <Award className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
            <h3 className={`text-lg font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {language === 'ko' ? '발급된 수료증이 없습니다' : 'No certificates issued'}
            </h3>
            <p className={`mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {language === 'ko'
                ? '강의를 수료하면 수료증이 여기에 표시됩니다.'
                : 'Certificates will appear here when you complete courses.'}
            </p>
            <Button variant="brand" onClick={() => window.location.href = '/tu/b2c/mypage/learning'}>
              {language === 'ko' ? '학습 중인 강의 보기' : 'View Current Courses'}
            </Button>
          </div>
        )}

        {/* Certificates Grid */}
        {data && data.content.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {data.content.map((enrollment) => (
                <CertificateCard
                  key={enrollment.id}
                  enrollment={enrollment}
                  userName={userName}
                  labels={cardLabels}
                  onPreview={() => handlePreview(enrollment)}
                  onDownload={handleDownload}
                  isDownloadEnabled={false} // Phase 2에서 활성화
                  isDark={isDark}
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

        {/* Certificate Preview Modal */}
        <CertificatePreviewModal
          isOpen={isPreviewOpen}
          onClose={handleClosePreview}
          enrollment={selectedEnrollment}
          userName={userName}
          labels={modalLabels}
          onDownload={handleDownload}
          isDownloadEnabled={false} // Phase 2에서 활성화
          isDark={isDark}
        />
      </div>
    </div>
  );
}
