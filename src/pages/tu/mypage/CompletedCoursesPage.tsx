import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle,
  BookOpen,
  Loader2,
  Award,
  Calendar,
  FileText,
} from 'lucide-react';
import { useThemeStore } from '@/store/common/themeStore';
import { useTranslation, useLanguageStore } from '@/store/common/languageStore';
import { useMyEnrollments, useCertificateByEnrollment, useDownloadCertificate, useIssueCertificate } from '@/hooks/tu';
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
import { CertificatePreviewModal } from '@/components/domain/tu/certificate';
import type { Enrollment } from '@/services/tu/enrollmentService';

interface CompletedCourseCardProps {
  enrollment: Enrollment;
  onClick: () => void;
  onViewCertificate: () => void;
  isDark: boolean;
  language: string;
}

function CompletedCourseCard({ enrollment, onClick, onViewCertificate, isDark, language }: CompletedCourseCardProps) {
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

        {/* Action Buttons */}
        <div className="flex items-center gap-2 mt-4">
          <Button
            variant="outline"
            className={`flex-1 ${isDark ? '!bg-transparent !border-white/20 !text-white hover:!bg-white/10' : ''}`}
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            {language === 'ko' ? '학습 내용' : 'Course'}
          </Button>
          <Button
            variant="brand"
            size="sm"
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              onViewCertificate();
            }}
          >
            <FileText className="w-4 h-4 mr-2" />
            {language === 'ko' ? '수료증' : 'Certificate'}
          </Button>
        </div>
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

  // 수료증 모달 상태
  const [selectedEnrollmentId, setSelectedEnrollmentId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // COMPLETED 상태의 수강 목록만 조회
  const { data, isLoading, isError } = useMyEnrollments({
    page,
    size: pageSize,
    status: 'COMPLETED',
  });

  // 선택된 수강의 수료증 조회
  const { data: certificate, isLoading: isCertificateLoading, isError: isCertificateError, refetch: refetchCertificate } = useCertificateByEnrollment(
    selectedEnrollmentId ?? 0,
    { enabled: !!selectedEnrollmentId && isModalOpen }
  );

  // PDF 다운로드 mutation
  const downloadMutation = useDownloadCertificate();

  // 수료증 발급 mutation
  const issueMutation = useIssueCertificate();

  const handleCourseClick = (enrollmentId: number) => {
    navigate(`/tu/b2c/mypage/learning/${enrollmentId}`);
  };

  const handleViewCertificate = (enrollmentId: number) => {
    setSelectedEnrollmentId(enrollmentId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEnrollmentId(null);
  };

  const handleDownload = async () => {
    if (!certificate || isDownloading) return;

    setIsDownloading(true);
    try {
      const fileName = `certificate_${certificate.certificateNumber}.pdf`;
      await downloadMutation.mutateAsync({ id: certificate.id, fileName });
    } catch (error) {
      console.error('Failed to download certificate:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleIssueCertificate = async () => {
    if (!selectedEnrollmentId || issueMutation.isPending) return;

    try {
      await issueMutation.mutateAsync(selectedEnrollmentId);
      // 발급 성공 후 수료증 다시 조회
      refetchCertificate();
    } catch (error) {
      console.error('Failed to issue certificate:', error);
    }
  };

  // 수료증 모달 라벨
  const modalLabels = {
    title: language === 'ko' ? '수료증 미리보기' : 'Certificate Preview',
    certificateOf: language === 'ko' ? '수료증' : 'Certificate of',
    completion: language === 'ko' ? '수료' : 'Completion',
    certifyThat: language === 'ko' ? '다음의 사용자가' : 'This is to certify that',
    hasCompleted: language === 'ko' ? '아래 과정을 성공적으로 수료하였음을 인증합니다.' : 'has successfully completed the following course.',
    issuedOn: language === 'ko' ? '발급일' : 'Issued on',
    completedOn: language === 'ko' ? '수료일' : 'Completed on',
    certificateNumber: language === 'ko' ? '수료증 번호' : 'Certificate No.',
    download: language === 'ko' ? 'PDF 다운로드' : 'Download PDF',
    downloading: language === 'ko' ? '다운로드 중...' : 'Downloading...',
    close: language === 'ko' ? '닫기' : 'Close',
    organization: language === 'ko' ? '발급 기관' : 'Organization',
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
                  onViewCertificate={() => handleViewCertificate(enrollment.id)}
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

        {/* Certificate Modal - 발급 또는 미리보기 */}
        {isModalOpen && (
          isCertificateLoading || issueMutation.isPending ? (
            // 로딩 상태
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className={`p-8 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                <Loader2 className={`w-8 h-8 animate-spin mx-auto ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                <p className={`mt-4 text-center ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {issueMutation.isPending
                    ? (language === 'ko' ? '수료증 발급 중...' : 'Issuing certificate...')
                    : (language === 'ko' ? '수료증 조회 중...' : 'Loading certificate...')}
                </p>
              </div>
            </div>
          ) : isCertificateError && !certificate ? (
            // 수료증 없음 - 발급 필요
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={handleCloseModal}>
              <div
                className={`p-8 rounded-xl max-w-md mx-4 ${isDark ? 'bg-gray-800' : 'bg-white'}`}
                onClick={(e) => e.stopPropagation()}
              >
                <Award className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-yellow-400' : 'text-amber-500'}`} />
                <h3 className={`text-lg font-semibold text-center mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {language === 'ko' ? '수료증 발급' : 'Issue Certificate'}
                </h3>
                <p className={`text-center mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {language === 'ko'
                    ? '아직 수료증이 발급되지 않았습니다. 수료증을 발급하시겠습니까?'
                    : 'Certificate has not been issued yet. Would you like to issue it?'}
                </p>
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={handleCloseModal}>
                    {language === 'ko' ? '취소' : 'Cancel'}
                  </Button>
                  <Button variant="brand" className="flex-1" onClick={handleIssueCertificate}>
                    <FileText className="w-4 h-4 mr-2" />
                    {language === 'ko' ? '발급하기' : 'Issue'}
                  </Button>
                </div>
              </div>
            </div>
          ) : certificate ? (
            // 수료증 미리보기
            <CertificatePreviewModal
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              certificate={certificate}
              labels={modalLabels}
              onDownload={handleDownload}
              isDownloading={isDownloading}
              isDark={isDark}
            />
          ) : null
        )}
      </div>
    </div>
  );
}
