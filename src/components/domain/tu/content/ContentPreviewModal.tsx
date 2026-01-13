import { useEffect, useState, useMemo } from 'react';
import { Loader2, ExternalLink, Download, AlertCircle, FileText } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
} from '@/components/common';
import { useContentPreview, useContent } from '@/hooks/tu';
import type { ContentType } from '@/types/tu';

interface ContentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentId: number | null;
  contentType: ContentType | null;
  fileName?: string;
}

export function ContentPreviewModal({
  isOpen,
  onClose,
  contentId,
  contentType,
  fileName,
}: Readonly<ContentPreviewModalProps>) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  // 외부 링크인 경우 콘텐츠 상세 조회
  const { data: contentDetail } = useContent(
    contentType === 'EXTERNAL_LINK' && contentId ? contentId : 0
  );

  // 파일 콘텐츠인 경우 미리보기 데이터 조회
  const { data: previewData, isLoading, error } = useContentPreview(
    contentType !== 'EXTERNAL_LINK' && isOpen ? contentId : null
  );

  // Blob URL 생성 및 정리
  useEffect(() => {
    if (previewData?.blob) {
      const url = URL.createObjectURL(previewData.blob);
      setBlobUrl(url);
      return () => {
        URL.revokeObjectURL(url);
        setBlobUrl(null);
      };
    }
  }, [previewData]);

  // 모달 닫힐 때 Blob URL 정리
  useEffect(() => {
    if (!isOpen && blobUrl) {
      URL.revokeObjectURL(blobUrl);
      setBlobUrl(null);
    }
  }, [isOpen, blobUrl]);

  const handleOpenExternal = () => {
    if (contentDetail?.externalUrl) {
      window.open(contentDetail.externalUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleDownload = () => {
    if (blobUrl && previewData) {
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = fileName || 'download';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  // 콘텐츠 타입에 따른 렌더링
  const renderContent = useMemo(() => {
    if (contentType === 'EXTERNAL_LINK') {
      return (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <ExternalLink className="w-16 h-16 text-text-secondary" />
          <p className="text-text-primary text-center">외부 링크 콘텐츠입니다.</p>
          {contentDetail?.externalUrl && (
            <p className="text-sm text-text-secondary text-center break-all max-w-md">
              {contentDetail.externalUrl}
            </p>
          )}
          <Button onClick={handleOpenExternal}>
            <ExternalLink size={16} />
            외부 링크 열기
          </Button>
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-text-secondary" />
          <span className="ml-2 text-text-secondary">로딩 중...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <AlertCircle className="w-12 h-12 text-status-error" />
          <p className="text-text-secondary">미리보기를 불러올 수 없습니다.</p>
        </div>
      );
    }

    if (!blobUrl) {
      return (
        <div className="flex items-center justify-center py-12">
          <p className="text-text-secondary">콘텐츠를 불러오는 중...</p>
        </div>
      );
    }

    switch (contentType) {
      case 'VIDEO':
        return (
          <video
            src={blobUrl}
            controls
            className="w-full max-h-[70vh] bg-black rounded-lg"
          >
            브라우저가 비디오를 지원하지 않습니다.
          </video>
        );

      case 'AUDIO':
        return (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="w-24 h-24 rounded-full bg-bg-secondary flex items-center justify-center">
              <span className="text-4xl">🎵</span>
            </div>
            <audio src={blobUrl} controls className="w-full max-w-md">
              브라우저가 오디오를 지원하지 않습니다.
            </audio>
          </div>
        );

      case 'IMAGE':
        return (
          <div className="flex items-center justify-center">
            <img
              src={blobUrl}
              alt={fileName || '이미지 미리보기'}
              className="max-w-full max-h-[70vh] object-contain rounded-lg"
            />
          </div>
        );

      case 'DOCUMENT':
        // PDF인 경우 iframe으로 인라인 미리보기
        if (previewData?.contentType?.includes('pdf')) {
          return (
            <div className="flex flex-col space-y-3">
              <iframe
                src={blobUrl}
                title={fileName || 'PDF 미리보기'}
                className="w-full h-[70vh] border-0 rounded-lg"
              />
              <div className="flex justify-end gap-2">
                <Button variant="ghost" className="border border-border" onClick={handleDownload}>
                  <Download size={16} />
                  다운로드
                </Button>
              </div>
            </div>
          );
        }
        // 기타 문서는 다운로드 유도
        return (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <FileText className="w-16 h-16 text-text-secondary" />
            <p className="text-text-primary text-lg font-medium">{fileName}</p>
            <p className="text-text-secondary text-sm">
              이 문서 형식은 미리보기를 지원하지 않습니다.
            </p>
            <Button onClick={handleDownload}>
              <Download size={16} />
              다운로드
            </Button>
          </div>
        );

      default:
        return (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <AlertCircle className="w-12 h-12 text-text-secondary" />
            <p className="text-text-secondary">지원하지 않는 콘텐츠 타입입니다.</p>
          </div>
        );
    }
  }, [contentType, isLoading, error, blobUrl, previewData, contentDetail, fileName]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto bg-bg-default">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-text-primary">
            {fileName || '콘텐츠 미리보기'}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">{renderContent}</div>
      </DialogContent>
    </Dialog>
  );
}
