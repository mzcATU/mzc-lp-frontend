import { Award, Calendar, User, Eye, Download, CheckCircle, Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button, Badge } from '@/components/common';
import type { CertificateResponse } from '@/types/tu';

// 날짜 포맷팅
function formatDate(dateString: string | undefined): string {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export interface CertificateCardLabels {
  completedOn: string;
  view: string;
  download: string;
  preparing: string;
  certificateOf: string;
  completion: string;
  downloading?: string;
}

interface CertificateCardProps {
  certificate: CertificateResponse;
  labels: CertificateCardLabels;
  onPreview: () => void;
  onDownload?: () => void;
  isDownloading?: boolean;
  isDark?: boolean;
}

/**
 * 수료증 카드 컴포넌트
 * 수료 완료된 강의의 수료증을 인증서 스타일로 표시
 */
export const CertificateCard = ({
  certificate,
  labels,
  onPreview,
  onDownload,
  isDownloading = false,
  isDark = false,
}: Readonly<CertificateCardProps>) => {
  const isDownloadEnabled = certificate.status === 'ISSUED' || certificate.status === 'VALID';

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border-2 transition-all hover:shadow-lg cursor-pointer',
        isDark
          ? 'bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 border-yellow-500/30 hover:border-yellow-500/50'
          : 'bg-gradient-to-br from-amber-50 via-white to-amber-50 border-amber-300 hover:border-amber-400'
      )}
      onClick={onPreview}
    >
      {/* 장식용 코너 디자인 */}
      <div
        className={cn(
          'absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 rounded-tl-xl',
          isDark ? 'border-yellow-500/40' : 'border-amber-400'
        )}
      />
      <div
        className={cn(
          'absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 rounded-tr-xl',
          isDark ? 'border-yellow-500/40' : 'border-amber-400'
        )}
      />
      <div
        className={cn(
          'absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 rounded-bl-xl',
          isDark ? 'border-yellow-500/40' : 'border-amber-400'
        )}
      />
      <div
        className={cn(
          'absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 rounded-br-xl',
          isDark ? 'border-yellow-500/40' : 'border-amber-400'
        )}
      />

      <div className="p-6 text-center">
        {/* 헤더: 수료증 아이콘 & 타이틀 */}
        <div className="mb-4">
          <div
            className={cn(
              'inline-flex items-center justify-center w-14 h-14 rounded-full mb-3',
              isDark ? 'bg-yellow-500/20' : 'bg-amber-100'
            )}
          >
            <Award className={cn('w-7 h-7', isDark ? 'text-yellow-400' : 'text-amber-600')} />
          </div>
          <div className={cn('text-xs font-medium tracking-widest uppercase mb-1', isDark ? 'text-yellow-400/80' : 'text-amber-600')}>
            {labels.certificateOf}
          </div>
          <div className={cn('text-lg font-bold', isDark ? 'text-yellow-400' : 'text-amber-700')}>
            {labels.completion}
          </div>
        </div>

        {/* 수료 배지 */}
        <div className="mb-4">
          <Badge variant="green" className="text-xs">
            <CheckCircle className="w-3 h-3 mr-1" />
            100% {labels.completion}
          </Badge>
        </div>

        {/* 프로그램/강의명 */}
        <h3
          className={cn(
            'text-base font-semibold mb-2 line-clamp-2 min-h-[3rem]',
            isDark ? 'text-white' : 'text-gray-900'
          )}
        >
          {certificate.programTitle}
        </h3>

        {/* 차수명 */}
        <p className={cn('text-sm mb-4', isDark ? 'text-gray-400' : 'text-gray-500')}>
          {certificate.courseTimeTitle}
        </p>

        {/* 구분선 */}
        <div className={cn('border-t my-4', isDark ? 'border-white/10' : 'border-amber-200')} />

        {/* 수료자 정보 */}
        <div className="space-y-2 mb-4">
          <div className={cn('flex items-center justify-center gap-2 text-sm', isDark ? 'text-gray-300' : 'text-gray-700')}>
            <User className="w-4 h-4" />
            <span className="font-medium">{certificate.userName}</span>
          </div>
          <div className={cn('flex items-center justify-center gap-2 text-xs', isDark ? 'text-gray-400' : 'text-gray-500')}>
            <Calendar className="w-3.5 h-3.5" />
            <span>{labels.completedOn}: {formatDate(certificate.completedAt)}</span>
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="flex items-center gap-2 mt-4" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              'flex-1',
              isDark && '!bg-transparent !border-white/20 !text-white hover:!bg-white/10'
            )}
            onClick={onPreview}
          >
            <Eye className="w-4 h-4 mr-1" />
            {labels.view}
          </Button>
          <Button
            variant={isDownloadEnabled ? 'brand' : 'ghost'}
            size="sm"
            className={cn(
              'flex-1',
              !isDownloadEnabled && (isDark ? '!text-gray-500' : '!text-gray-400')
            )}
            onClick={isDownloadEnabled ? onDownload : undefined}
            disabled={!isDownloadEnabled || isDownloading}
          >
            {isDownloading ? (
              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-1" />
            )}
            {isDownloading
              ? (labels.downloading || 'Downloading...')
              : isDownloadEnabled
                ? labels.download
                : labels.preparing}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CertificateCard;
