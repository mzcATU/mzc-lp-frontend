/**
 * DocumentViewer 컴포넌트
 * PDF, 문서 및 이미지 콘텐츠를 표시하고 진도 추적 기능 제공
 */
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Loader2, AlertCircle, RefreshCw, FileText, Download, ZoomIn, ZoomOut, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/common';
import { useTranslation } from '@/store/common/languageStore';
import { useThemeStore } from '@/store/common/themeStore';
import axiosInstance from '@/services/common/api/axiosInstance';
import { API_ENDPOINTS } from '@/services/common/api/endpoints';
import { userSiteDesignTokens } from '@/styles/user-site-design-tokens';

// react-pdf imports
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// PDF.js worker 설정
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface DocumentViewerProps {
  contentId: number;
  externalUrl?: string;
  contentType?: 'DOCUMENT' | 'IMAGE' | 'PDF';
  isLearnerMode?: boolean;
  downloadable?: boolean;
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
  downloadable = true,
  onProgress,
  onReady,
  onError,
}: Readonly<DocumentViewerProps>) {
  const { t } = useTranslation();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewedPages, setViewedPages] = useState<Set<number>>(new Set([1]));
  const [isPdf, setIsPdf] = useState(false);

  const isImage = contentType === 'IMAGE';

  // 이미지용 줌 상태
  const [imageZoom, setImageZoom] = useState(100);

  // PDF 보기 모드: 'single' = 1페이지, 'dual' = 2페이지
  const [pdfViewMode, setPdfViewMode] = useState<'single' | 'dual'>('single');

  // PDF 현재 줌 레벨
  const [pdfZoom, setPdfZoom] = useState(1);

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

        // PDF 여부 확인
        setIsPdf(responseContentType.includes('pdf'));
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentId, externalUrl, isLearnerMode]);

  // 페이지 변경 시 진도 업데이트
  useEffect(() => {
    if (totalPages > 0) {
      const viewedPercent = viewedPages.size / totalPages;
      onProgress?.({ viewed: viewedPercent });
    }
  }, [viewedPages, totalPages, onProgress]);

  const handleZoomIn = useCallback(() => {
    if (isImage) {
      setImageZoom((prev: number) => Math.min(prev + 25, 200));
    } else if (isPdf) {
      setPdfZoom((prev) => Math.min(prev + 0.25, 3));
    } else {
      setScale((prev) => Math.min(prev + 0.25, 3));
    }
  }, [isImage, isPdf]);

  const handleZoomOut = useCallback(() => {
    if (isImage) {
      setImageZoom((prev: number) => Math.max(prev - 25, 50));
    } else if (isPdf) {
      setPdfZoom((prev) => Math.max(prev - 0.25, 0.5));
    } else {
      setScale((prev) => Math.max(prev - 0.25, 0.5));
    }
  }, [isImage, isPdf]);

  const handleRetry = useCallback(() => {
    setHasError(false);
    setIsLoading(true);
    setDocumentUrl(null);
    // Re-trigger useEffect by changing a dependency
    const timer = setTimeout(() => {
      if (externalUrl) {
        setDocumentUrl(externalUrl);
        setIsLoading(false);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [externalUrl]);

  const handleDownload = useCallback(() => {
    if (documentUrl && downloadable) {
      window.open(documentUrl, '_blank');
    }
  }, [documentUrl, downloadable]);

  // PDF 문서 로드 완료 시 페이지 수 설정
  const handleDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setTotalPages(numPages);
    setIsLoading(false);
    onReady?.();
  }, [onReady]);

  // PDF 문서 로드 실패
  const handleDocumentLoadError = useCallback(() => {
    setHasError(true);
    onError?.(new Error('Failed to load PDF'));
  }, [onError]);

  // 페이지 이동
  const goToPreviousPage = useCallback(() => {
    if (pdfViewMode === 'dual') {
      // 2페이지 모드: 2페이지씩 이동
      setCurrentPage((prev) => Math.max(prev - 2, 1));
    } else {
      setCurrentPage((prev) => Math.max(prev - 1, 1));
    }
  }, [pdfViewMode]);

  const goToNextPage = useCallback(() => {
    if (pdfViewMode === 'dual') {
      // 2페이지 모드: 2페이지씩 이동
      setCurrentPage((prev) => Math.min(prev + 2, totalPages));
    } else {
      setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    }
  }, [pdfViewMode, totalPages]);

  // 페이지 변경 시 진도 추적
  useEffect(() => {
    setViewedPages((prev) => {
      const newSet = new Set(prev);
      newSet.add(currentPage);
      if (pdfViewMode === 'dual' && currentPage + 1 <= totalPages) {
        newSet.add(currentPage + 1);
      }
      return newSet;
    });
  }, [currentPage, pdfViewMode, totalPages]);

  // 키보드 방향키로 페이지 이동
  useEffect(() => {
    if (!isPdf || !documentUrl) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPreviousPage();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goToNextPage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPdf, documentUrl, goToPreviousPage, goToNextPage]);

  // 2페이지 모드에서 표시할 페이지 번호들
  const displayPages = useMemo(() => {
    if (pdfViewMode === 'single') {
      return [currentPage];
    }
    // 2페이지 모드
    const pages = [currentPage];
    if (currentPage + 1 <= totalPages) {
      pages.push(currentPage + 1);
    }
    return pages;
  }, [pdfViewMode, currentPage, totalPages]);

  // 현재 줌 레벨 표시
  const zoomDisplay = useMemo(() => {
    if (isImage) {
      return `${imageZoom}%`;
    }
    if (isPdf) {
      return `${Math.round(pdfZoom * 100)}%`;
    }
    return `${Math.round(scale * 100)}%`;
  }, [isImage, isPdf, imageZoom, pdfZoom, scale]);

  // 로딩 상태
  if (isLoading) {
    return (
      <div
        className={`relative w-full h-full flex items-center justify-center ${
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
        className={`relative w-full h-full flex flex-col items-center justify-center gap-4 ${
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
            {isImage ? '이미지' : isPdf ? 'PDF 문서' : '문서'}
          </span>
          {/* PDF 페이지 정보 */}
          {isPdf && totalPages > 1 && (
            <span className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              ({pdfViewMode === 'dual' && currentPage + 1 <= totalPages
                ? `${currentPage}-${currentPage + 1}`
                : currentPage} / {totalPages})
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* PDF 1페이지/2페이지 선택 */}
          {isPdf && totalPages > 1 && (
            <>
              <div
                className="flex overflow-hidden"
                style={{
                  borderRadius: userSiteDesignTokens.radius.button,
                  border: `1px solid ${isDark ? userSiteDesignTokens.dark.border.default : userSiteDesignTokens.light.border.default}`,
                }}
              >
                <button
                  onClick={() => setPdfViewMode('single')}
                  className="px-3 py-1.5 text-xs font-medium transition-colors"
                  style={{
                    background: pdfViewMode === 'single'
                      ? userSiteDesignTokens.brand.primary
                      : 'transparent',
                    color: pdfViewMode === 'single'
                      ? '#FFFFFF'
                      : isDark ? userSiteDesignTokens.dark.text.secondary : userSiteDesignTokens.light.text.secondary,
                  }}
                >
                  1p
                </button>
                <div
                  style={{
                    width: '1px',
                    background: isDark ? userSiteDesignTokens.dark.border.default : userSiteDesignTokens.light.border.default,
                  }}
                />
                <button
                  onClick={() => setPdfViewMode('dual')}
                  className="px-3 py-1.5 text-xs font-medium transition-colors"
                  style={{
                    background: pdfViewMode === 'dual'
                      ? userSiteDesignTokens.brand.primary
                      : 'transparent',
                    color: pdfViewMode === 'dual'
                      ? '#FFFFFF'
                      : isDark ? userSiteDesignTokens.dark.text.secondary : userSiteDesignTokens.light.text.secondary,
                  }}
                >
                  2p
                </button>
              </div>
              <div
                className="h-4 mx-1"
                style={{
                  width: '1px',
                  background: isDark ? userSiteDesignTokens.dark.border.light : userSiteDesignTokens.light.border.light,
                }}
              />
            </>
          )}

          {/* PDF 페이지 이동 버튼 */}
          {isPdf && totalPages > 1 && (
            <>
              <Button variant="ghost" size="sm" onClick={goToPreviousPage} disabled={currentPage <= 1}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={goToNextPage} disabled={currentPage >= totalPages}>
                <ChevronRight className="w-4 h-4" />
              </Button>
              <div
                className="h-4 mx-1"
                style={{
                  width: '1px',
                  background: isDark ? userSiteDesignTokens.dark.border.light : userSiteDesignTokens.light.border.light,
                }}
              />
            </>
          )}

          {/* 줌 컨트롤 */}
          <Button variant="ghost" size="sm" onClick={handleZoomOut} disabled={isImage ? imageZoom <= 50 : pdfZoom <= 0.5}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span
            className="text-sm min-w-[3rem] text-center"
            style={{ color: isDark ? userSiteDesignTokens.dark.text.secondary : userSiteDesignTokens.light.text.secondary }}
          >
            {zoomDisplay}
          </span>
          <Button variant="ghost" size="sm" onClick={handleZoomIn} disabled={isImage ? imageZoom >= 200 : pdfZoom >= 3}>
            <ZoomIn className="w-4 h-4" />
          </Button>

          {/* 다운로드 - downloadable이 true일 때만 표시 */}
          {downloadable && (
            <>
              <div
                className="h-4 mx-2"
                style={{
                  width: '1px',
                  background: isDark ? userSiteDesignTokens.dark.border.light : userSiteDesignTokens.light.border.light,
                }}
              />
              <Button variant="ghost" size="sm" onClick={handleDownload}>
                <Download className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      {/* 콘텐츠 뷰어 */}
      <div className="flex-1 relative overflow-auto min-h-0">
        {/* 이미지 뷰어 */}
        {isImage && documentUrl && (
          <div className="w-full h-full flex items-center justify-center p-4 bg-white">
            <img
              src={documentUrl}
              alt="Content"
              className="max-w-full max-h-full object-contain"
              style={{
                transform: `scale(${imageZoom / 100})`,
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

        {/* PDF 뷰어 - react-pdf */}
        {!isImage && isPdf && documentUrl && (
          <div className="w-full h-full bg-gray-100 overflow-auto flex justify-center py-4">
            <Document
              file={documentUrl}
              onLoadSuccess={handleDocumentLoadSuccess}
              onLoadError={handleDocumentLoadError}
              loading={
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                </div>
              }
            >
              <div className={`flex ${pdfViewMode === 'dual' ? 'gap-2' : ''} justify-center`}>
                {displayPages.map((pageNum) => (
                  <Page
                    key={pageNum}
                    pageNumber={pageNum}
                    scale={pdfZoom}
                    className="shadow-lg"
                    renderTextLayer={true}
                    renderAnnotationLayer={true}
                  />
                ))}
              </div>
            </Document>
          </div>
        )}

        {/* 비 PDF 문서 뷰어 (TXT 등) - iframe 사용 */}
        {!isImage && !isPdf && documentUrl && (
          <iframe
            src={documentUrl}
            className="w-full h-full border-0 bg-white"
            style={{
              transform: scale !== 1 ? `scale(${scale})` : undefined,
              transformOrigin: 'top left',
              width: scale !== 1 ? `${100 / scale}%` : '100%',
              height: scale !== 1 ? `${100 / scale}%` : '100%',
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
    </div>
  );
}
