/**
 * DocumentViewer 컴포넌트
 * PDF, 문서 및 이미지 콘텐츠를 표시하고 진도 추적 기능 제공
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { Loader2, AlertCircle, RefreshCw, FileText, Download, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/common';
import { useTranslation } from '@/store/common/languageStore';
import { useThemeStore } from '@/store/common/themeStore';
import axiosInstance from '@/services/common/api/axiosInstance';
import { API_ENDPOINTS } from '@/services/common/api/endpoints';

interface DocumentViewerProps {
  contentId: number;
  externalUrl?: string;
  contentType?: 'DOCUMENT' | 'IMAGE' | 'PDF';
  isLearnerMode?: boolean;
  onProgress?: (progress: { viewed: number }) => void;
  onComplete?: () => void;
  onReady?: () => void;
  onError?: (error: Error) => void;
}

export function DocumentViewer({
  contentId,
  externalUrl,
  contentType = 'DOCUMENT',
  isLearnerMode = true,
  onProgress,
  onReady,
  onError,
}: DocumentViewerProps) {
  const { t } = useTranslation();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  // TODO: setTotalPages will be used when implementing proper PDF page detection
  const [totalPages] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [viewedPages, setViewedPages] = useState<Set<number>>(new Set([1]));

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const isImage = contentType === 'IMAGE';

  // 문서/이미지 Blob URL 로드 (인증 토큰 포함)
  useEffect(() => {
    if (externalUrl) {
      setDocumentUrl(externalUrl);
      setIsLoading(false);
      onReady?.();
      return;
    }

    const loadContent = async () => {
      try {
        setIsLoading(true);
        setHasError(false);

        // API 엔드포인트 선택 (학습자용/관리자용)
        const endpoint = isLearnerMode
          ? API_ENDPOINTS.LEARNING.CONTENT_STREAM(contentId)
          : API_ENDPOINTS.CONTENTS.STREAM(contentId);

        // Blob으로 가져오기 (인증 토큰 자동 포함)
        const response = await axiosInstance.get(endpoint, {
          responseType: 'blob',
        });

        // 서버 응답의 Content-Type 사용
        const responseContentType = response.headers['content-type'] || 'application/octet-stream';
        const blob = new Blob([response.data], { type: responseContentType });
        const blobUrl = URL.createObjectURL(blob);
        setDocumentUrl(blobUrl);
        onReady?.();
      } catch (error) {
        console.error('Failed to load content:', error);
        setHasError(true);
        onError?.(error as Error);
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();

    // 클린업: Blob URL 해제
    return () => {
      if (documentUrl && documentUrl.startsWith('blob:')) {
        URL.revokeObjectURL(documentUrl);
      }
    };
  }, [contentId, externalUrl, isLearnerMode, onReady, onError]);

  // 페이지 변경 시 진도 업데이트
  useEffect(() => {
    if (totalPages > 0) {
      const viewedPercent = viewedPages.size / totalPages;
      onProgress?.({ viewed: viewedPercent });
      // 자동 완료 처리 제거 - 사용자가 직접 "학습 완료" 버튼을 클릭해야 함
    }
  }, [viewedPages, totalPages, onProgress]);

  const handlePageChange = useCallback((newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      setViewedPages((prev) => new Set([...prev, newPage]));
    }
  }, [totalPages]);

  const handleZoomIn = useCallback(() => {
    setZoom((prev) => Math.min(prev + 25, 200));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((prev) => Math.max(prev - 25, 50));
  }, []);

  const handleRetry = useCallback(() => {
    setHasError(false);
    setIsLoading(true);
    setDocumentUrl(null);
    // Re-trigger useEffect
    const timer = setTimeout(() => {
      if (externalUrl) {
        setDocumentUrl(externalUrl);
        setIsLoading(false);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [externalUrl]);

  const handleDownload = useCallback(() => {
    if (documentUrl) {
      window.open(documentUrl, '_blank');
    }
  }, [documentUrl]);

  // 로딩 상태
  if (isLoading) {
    return (
      <div
        className={`relative w-full aspect-[4/3] rounded-lg flex items-center justify-center ${
          isDark ? 'bg-white/5' : 'bg-gray-100'
        }`}
      >
        <div className="flex flex-col items-center gap-3">
          <Loader2 className={`w-10 h-10 animate-spin ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
          <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>{t.player.loading}</span>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (hasError) {
    return (
      <div
        className={`relative w-full aspect-[4/3] rounded-lg flex flex-col items-center justify-center gap-4 ${
          isDark ? 'bg-white/5' : 'bg-gray-100'
        }`}
      >
        <AlertCircle className="w-12 h-12 text-red-500" />
        <span className={isDark ? 'text-white' : 'text-gray-900'}>{t.player.error}</span>
        <Button onClick={handleRetry} variant="outline" className="gap-2">
          <RefreshCw className="w-4 h-4" />
          {t.player.retry}
        </Button>
      </div>
    );
  }

  return (
    <div className={`h-full flex flex-col ${isDark ? 'bg-[#1a1a2e]' : 'bg-white'}`}>
      {/* 툴바 */}
      <div
        className={`shrink-0 flex items-center justify-between px-4 py-2 border-b ${
          isDark ? 'bg-[#12121a] border-white/10' : 'bg-gray-50 border-gray-200'
        }`}
      >
        <div className="flex items-center gap-2">
          {isImage ? (
            <ImageIcon className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
          ) : (
            <FileText className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
          )}
          <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            {isImage ? '이미지' : '문서'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* 줌 컨트롤 */}
          <Button variant="ghost" size="sm" onClick={handleZoomOut} disabled={zoom <= 50}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className={`text-sm min-w-[3rem] text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {zoom}%
          </span>
          <Button variant="ghost" size="sm" onClick={handleZoomIn} disabled={zoom >= 200}>
            <ZoomIn className="w-4 h-4" />
          </Button>

          <div className={`h-4 w-px mx-2 ${isDark ? 'bg-white/10' : 'bg-gray-300'}`} />

          {/* 다운로드 */}
          <Button variant="ghost" size="sm" onClick={handleDownload}>
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* 콘텐츠 뷰어 */}
      <div className="flex-1 relative overflow-auto min-h-0">
        {/* 이미지 뷰어 - 배경 흰색 */}
        {isImage && documentUrl && (
          <div className="w-full h-full flex items-center justify-center p-4 bg-white">
            <img
              src={documentUrl}
              alt="Content"
              className="max-w-full max-h-full object-contain"
              style={{
                transform: `scale(${zoom / 100})`,
                transition: 'transform 0.2s ease',
              }}
              onLoad={() => {
                setIsLoading(false);
                onReady?.();
              }}
              onError={() => {
                setHasError(true);
                onError?.(new Error('Failed to load image'));
              }}
            />
          </div>
        )}

        {/* 문서 뷰어 (PDF, TXT 등) - iframe 사용 */}
        {!isImage && documentUrl && (
          <iframe
            ref={iframeRef}
            src={documentUrl}
            className="w-full h-full border-0 bg-white"
            style={{
              transform: zoom !== 100 ? `scale(${zoom / 100})` : undefined,
              transformOrigin: 'top left',
              width: zoom !== 100 ? `${10000 / zoom}%` : '100%',
              height: zoom !== 100 ? `${10000 / zoom}%` : '100%',
            }}
            title="Document Viewer"
          />
        )}

        {/* URL 없는 경우 */}
        {!documentUrl && (
          <div className="flex items-center justify-center h-full">
            <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>
              {t.player.selectContent}
            </span>
          </div>
        )}
      </div>

      {/* 페이지 네비게이션 (여러 페이지가 있는 경우) */}
      {totalPages > 1 && (
        <div
          className={`flex items-center justify-center gap-4 px-4 py-2 border-t ${
            isDark ? 'bg-[#12121a] border-white/10' : 'bg-gray-50 border-gray-200'
          }`}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {currentPage} / {totalPages}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
