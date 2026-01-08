import { Award, Calendar, User, Download, Building2, BookOpen, Hash, Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
} from '@/components/common';
import type { CertificateResponse, CertificateDetailResponse } from '@/types/tu';

// 날짜 포맷팅
function formatDate(dateString: string | undefined | null): string {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export interface CertificatePreviewLabels {
  title: string;
  certificateOf: string;
  completion: string;
  certifyThat: string;
  hasCompleted: string;
  issuedOn: string;
  completedOn: string;
  certificateNumber: string;
  download: string;
  downloading?: string;
  close: string;
  organization: string;
}

interface CertificatePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  certificate: CertificateResponse | CertificateDetailResponse | null;
  labels: CertificatePreviewLabels;
  onDownload?: () => void;
  isDownloading?: boolean;
  isDark?: boolean;
  organizationName?: string;
}

/**
 * 수료증 미리보기 모달
 * 수료증을 상세하게 표시하는 모달 컴포넌트
 */
export const CertificatePreviewModal = ({
  isOpen,
  onClose,
  certificate,
  labels,
  onDownload,
  isDownloading = false,
  isDark = false,
  organizationName = 'MZC Learn Platform',
}: Readonly<CertificatePreviewModalProps>) => {
  if (!certificate) return null;

  const isDownloadEnabled = certificate.status === 'ISSUED' || certificate.status === 'VALID';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={cn(
          'max-w-2xl p-0 overflow-hidden',
          isDark ? 'bg-gray-900 border-gray-700' : 'bg-white'
        )}
      >
        {/* 헤더 */}
        <DialogHeader className={cn('p-4 border-b', isDark ? 'border-gray-700' : 'border-gray-200')}>
          <DialogTitle className={isDark ? 'text-white' : 'text-gray-900'}>
            {labels.title}
          </DialogTitle>
        </DialogHeader>

        {/* 수료증 본문 */}
        <div className="p-6">
          <div
            className={cn(
              'relative border-4 rounded-lg p-8 text-center',
              isDark
                ? 'bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 border-yellow-500/50'
                : 'bg-gradient-to-br from-amber-50 via-white to-amber-50 border-amber-400'
            )}
          >
            {/* 장식용 코너 */}
            <div className={cn('absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2', isDark ? 'border-yellow-500/40' : 'border-amber-300')} />
            <div className={cn('absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2', isDark ? 'border-yellow-500/40' : 'border-amber-300')} />
            <div className={cn('absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2', isDark ? 'border-yellow-500/40' : 'border-amber-300')} />
            <div className={cn('absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2', isDark ? 'border-yellow-500/40' : 'border-amber-300')} />

            {/* 기관 로고/이름 */}
            <div className="mb-6">
              <div className={cn('flex items-center justify-center gap-2 text-sm', isDark ? 'text-gray-400' : 'text-gray-500')}>
                <Building2 className="w-4 h-4" />
                <span>{organizationName}</span>
              </div>
            </div>

            {/* 수료증 타이틀 */}
            <div className="mb-6">
              <div
                className={cn(
                  'inline-flex items-center justify-center w-16 h-16 rounded-full mb-4',
                  isDark ? 'bg-yellow-500/20' : 'bg-amber-100'
                )}
              >
                <Award className={cn('w-8 h-8', isDark ? 'text-yellow-400' : 'text-amber-600')} />
              </div>
              <div className={cn('text-sm font-medium tracking-widest uppercase mb-2', isDark ? 'text-yellow-400/80' : 'text-amber-600')}>
                {labels.certificateOf}
              </div>
              <div className={cn('text-2xl font-bold', isDark ? 'text-yellow-400' : 'text-amber-700')}>
                {labels.completion}
              </div>
            </div>

            {/* 수료자 정보 */}
            <div className="mb-6">
              <p className={cn('text-sm mb-2', isDark ? 'text-gray-400' : 'text-gray-500')}>
                {labels.certifyThat}
              </p>
              <div className={cn('flex items-center justify-center gap-2 text-xl font-bold mb-2', isDark ? 'text-white' : 'text-gray-900')}>
                <User className="w-5 h-5" />
                <span>{certificate.userName}</span>
              </div>
              <p className={cn('text-sm', isDark ? 'text-gray-400' : 'text-gray-500')}>
                {labels.hasCompleted}
              </p>
            </div>

            {/* 강의 정보 */}
            <div className={cn('mb-6 p-4 rounded-lg', isDark ? 'bg-white/5' : 'bg-amber-100/50')}>
              <div className={cn('flex items-center justify-center gap-2 mb-2', isDark ? 'text-gray-300' : 'text-gray-700')}>
                <BookOpen className="w-4 h-4" />
                <span className="text-sm font-medium">{certificate.programTitle}</span>
              </div>
              <p className={cn('text-xs', isDark ? 'text-gray-400' : 'text-gray-500')}>
                {certificate.courseTimeTitle}
              </p>
            </div>

            {/* 날짜 정보 */}
            <div className="space-y-2 mb-6">
              <div className={cn('flex items-center justify-center gap-2 text-sm', isDark ? 'text-gray-300' : 'text-gray-600')}>
                <Calendar className="w-4 h-4" />
                <span>{labels.completedOn}: {formatDate(certificate.completedAt)}</span>
              </div>
              <div className={cn('flex items-center justify-center gap-2 text-sm font-medium', isDark ? 'text-yellow-400' : 'text-amber-700')}>
                <Award className="w-4 h-4" />
                <span>{labels.issuedOn}: {formatDate(certificate.issuedAt)}</span>
              </div>
            </div>

            {/* 수료증 번호 */}
            <div className={cn('mb-4 p-2 rounded', isDark ? 'bg-white/5' : 'bg-amber-50')}>
              <div className={cn('flex items-center justify-center gap-2 text-xs', isDark ? 'text-gray-400' : 'text-gray-500')}>
                <Hash className="w-3 h-3" />
                <span>{labels.certificateNumber}: {certificate.certificateNumber}</span>
              </div>
            </div>

            {/* 서명란 (장식용) */}
            <div className={cn('border-t pt-4', isDark ? 'border-white/10' : 'border-amber-200')}>
              <div className={cn('text-xs', isDark ? 'text-gray-500' : 'text-gray-400')}>
                {organizationName}
              </div>
            </div>
          </div>
        </div>

        {/* 푸터: 다운로드 버튼 */}
        <div className={cn('p-4 border-t flex justify-end gap-2', isDark ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50')}>
          <Button variant="outline" onClick={onClose}>
            {labels.close}
          </Button>
          <Button
            variant={isDownloadEnabled ? 'brand' : 'ghost'}
            onClick={isDownloadEnabled ? onDownload : undefined}
            disabled={!isDownloadEnabled || isDownloading}
          >
            {isDownloading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            {isDownloading
              ? (labels.downloading || 'Downloading...')
              : isDownloadEnabled
                ? labels.download
                : labels.close}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CertificatePreviewModal;
