import { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { designTokens } from '@/styles/design-tokens';
import { Button } from '@/components/ui';
import { ArrowLeft, Upload, File } from 'lucide-react';

export const ContentUploadPage = () => {
  const navigate = useNavigate();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragActive, setIsDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    const files = Array.from(e.dataTransfer.files);
    setSelectedFiles((prev) => [...prev, ...files]);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragActive(false);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...files]);
    }
  };

  const handleUpload = async () => {
    // TODO: useUploadContent 훅 연동
    for (let i = 0; i < selectedFiles.length; i++) {
      setUploadProgress(((i + 1) / selectedFiles.length) * 100);
      // await uploadMutation.mutateAsync(selectedFiles[i]);
    }
    console.log('업로드 완료');
    navigate('/content');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div
      className="p-8 min-h-full"
      style={{ backgroundColor: designTokens.bg.default }}
    >
      {/* 뒤로가기 */}
      <Link
        to="/content"
        className="inline-flex items-center gap-2 mb-6 hover:underline"
        style={{ color: designTokens.text.secondary }}
      >
        <ArrowLeft className="w-4 h-4" />
        콘텐츠 풀로
      </Link>

      <div className="max-w-3xl">
        <h1
          className="text-2xl font-semibold mb-6"
          style={{ color: designTokens.text.primary }}
        >
          콘텐츠 업로드
        </h1>

        {/* 개발 예정 안내 */}
        <div
          className="rounded-lg border-2 border-dashed p-12 text-center"
          style={{ borderColor: designTokens.bg.border }}
        >
          <p className="text-lg mb-2" style={{ color: designTokens.text.placeholder }}>
            🚧 개발 예정
          </p>
          <p
            className="text-sm"
            style={{ color: designTokens.text.placeholder }}
          >
            콘텐츠 업로드 기능이 곧 추가될 예정입니다.
          </p>
        </div>

        {/* 버튼 */}
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={() => navigate(-1)}>
            돌아가기
          </Button>
        </div>
      </div>
    </div>
  );
};
