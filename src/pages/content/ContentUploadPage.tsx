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

        {/* 드롭존 */}
        <div
          className={`rounded-lg border-2 border-dashed p-12 text-center transition-colors cursor-pointer ${
            isDragActive ? 'border-blue-500 bg-blue-50' : ''
          }`}
          style={{
            borderColor: isDragActive
              ? designTokens.button.brand_default
              : designTokens.bg.border,
          }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => document.getElementById('file-input')?.click()}
        >
          <Upload
            className="w-12 h-12 mx-auto mb-4"
            style={{ color: designTokens.text.placeholder }}
          />
          {isDragActive ? (
            <p style={{ color: designTokens.button.brand_default }}>
              파일을 여기에 놓으세요...
            </p>
          ) : (
            <>
              <p style={{ color: designTokens.text.primary }}>
                파일을 드래그하거나 클릭하여 업로드
              </p>
              <p
                className="text-sm mt-1"
                style={{ color: designTokens.text.placeholder }}
              >
                여러 파일을 동시에 업로드할 수 있습니다
              </p>
            </>
          )}
          <input
            id="file-input"
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            accept="video/*,application/pdf,image/*,audio/*"
          />
        </div>

        {/* 선택된 파일 목록 */}
        {selectedFiles.length > 0 && (
          <div
            className="mt-6 rounded-lg border p-4"
            style={{
              backgroundColor: designTokens.bg.secondary,
              borderColor: designTokens.bg.border,
            }}
          >
            <h3
              className="font-medium mb-3"
              style={{ color: designTokens.text.primary }}
            >
              선택된 파일 ({selectedFiles.length}개)
            </h3>
            <ul className="space-y-2">
              {selectedFiles.map((file, index) => (
                <li
                  key={index}
                  className="flex items-center gap-3 p-2 rounded"
                  style={{ backgroundColor: designTokens.bg.default }}
                >
                  <File
                    className="w-4 h-4"
                    style={{ color: designTokens.text.secondary }}
                  />
                  <span style={{ color: designTokens.text.primary }}>
                    {file.name}
                  </span>
                  <span
                    className="text-sm ml-auto"
                    style={{ color: designTokens.text.placeholder }}
                  >
                    {formatFileSize(file.size)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 업로드 진행률 */}
        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="mt-4">
            <div
              className="h-2 rounded-full overflow-hidden"
              style={{ backgroundColor: designTokens.bg.border }}
            >
              <div
                className="h-full transition-all"
                style={{
                  width: `${uploadProgress}%`,
                  backgroundColor: designTokens.button.brand_default,
                }}
              />
            </div>
            <p
              className="text-sm mt-1 text-center"
              style={{ color: designTokens.text.secondary }}
            >
              {Math.round(uploadProgress)}% 완료
            </p>
          </div>
        )}

        {/* 지원 형식 */}
        <div
          className="mt-6 rounded-lg border p-4"
          style={{
            backgroundColor: designTokens.bg.secondary,
            borderColor: designTokens.bg.border,
          }}
        >
          <h3
            className="font-medium mb-2"
            style={{ color: designTokens.text.primary }}
          >
            지원 형식
          </h3>
          <ul
            className="text-sm space-y-1"
            style={{ color: designTokens.text.secondary }}
          >
            <li>영상: mp4, avi, mov, mkv (최대 2GB)</li>
            <li>문서: pdf, doc, docx, ppt, pptx (최대 100MB)</li>
            <li>이미지: jpg, png, gif, svg (최대 50MB)</li>
            <li>오디오: mp3, wav, m4a (최대 500MB)</li>
          </ul>
        </div>

        {/* 버튼 */}
        {selectedFiles.length > 0 && (
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setSelectedFiles([])}>
              초기화
            </Button>
            <Button onClick={handleUpload}>업로드 시작</Button>
          </div>
        )}
      </div>
    </div>
  );
};
