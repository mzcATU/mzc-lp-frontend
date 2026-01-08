import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, ImageIcon, Smartphone, Monitor, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { designTokens } from '@/styles/admin-design-tokens';
import { cn } from '@/utils/cn';
import axiosInstance from '@/services/common/api/axiosInstance';

interface BannerImageDropzoneProps {
  value?: string;
  onChange: (url: string) => void;
  onFileSelect?: (file: File) => void;
  label?: string;
  recommendedSize?: string;
  aspectRatio?: string;
  deviceType?: 'pc' | 'mobile';
  className?: string;
}

export const BannerImageDropzone = ({
  value,
  onChange,
  onFileSelect,
  label = '배너 이미지',
  recommendedSize = '1200x400px',
  aspectRatio = 'aspect-[3/1]',
  deviceType = 'pc',
  className,
}: BannerImageDropzoneProps) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axiosInstance.post<{ url: string }>(
      '/community/images/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data.url;
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        setIsUploading(true);
        try {
          const imageUrl = await uploadImage(file);
          onChange(imageUrl);
          onFileSelect?.(file);
        } catch (error) {
          console.error('Image upload failed:', error);
          toast.error('이미지 업로드에 실패했습니다.');
        } finally {
          setIsUploading(false);
        }
      }
    },
    [onChange, onFileSelect]
  );

  const { getRootProps, getInputProps, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB (서버 제한)
    disabled: isUploading,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
  });

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
  };

  const DeviceIcon = deviceType === 'mobile' ? Smartphone : Monitor;

  return (
    <div className={className}>
      <div className="flex items-center gap-2 mb-2">
        <DeviceIcon
          className="w-4 h-4"
          style={{ color: designTokens.text.secondary }}
        />
        <span
          className="text-sm font-medium"
          style={{ color: designTokens.text.primary }}
        >
          {label}
        </span>
      </div>

      <div
        {...getRootProps()}
        className={cn(
          aspectRatio,
          'relative rounded-xl border-2 border-dashed cursor-pointer transition-all overflow-hidden group',
          isDragActive && 'border-solid',
          isDragReject && 'border-red-500 bg-red-50'
        )}
        style={{
          borderColor: isDragActive
            ? designTokens.button.brand_default
            : designTokens.bg.border,
          backgroundColor: isDragActive
            ? `${designTokens.button.brand_default}08`
            : value
              ? 'transparent'
              : designTokens.bg.secondary,
        }}
      >
        <input {...getInputProps()} />

        {value ? (
          <>
            <img
              src={value}
              alt="Banner preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="flex gap-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: designTokens.bg.default,
                    color: designTokens.text.primary,
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Upload className="w-4 h-4 inline mr-1" />
                  변경
                </button>
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: designTokens.status.error_background,
                    color: designTokens.status.error_text,
                  }}
                  onClick={handleRemove}
                >
                  <X className="w-4 h-4 inline mr-1" />
                  삭제
                </button>
              </div>
            </div>
          </>
        ) : isUploading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
            <Loader2
              className="w-8 h-8 animate-spin mb-3"
              style={{ color: designTokens.button.brand_default }}
            />
            <p
              className="text-sm font-medium"
              style={{ color: designTokens.text.primary }}
            >
              업로드 중...
            </p>
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
              style={{ backgroundColor: designTokens.bg.default }}
            >
              <ImageIcon
                className="w-6 h-6"
                style={{ color: designTokens.text.placeholder }}
              />
            </div>
            <p
              className="text-sm font-medium mb-1"
              style={{ color: designTokens.text.primary }}
            >
              {isDragActive ? '여기에 놓으세요' : '이미지를 드래그하거나 클릭'}
            </p>
            <p
              className="text-xs"
              style={{ color: designTokens.text.placeholder }}
            >
              PNG, JPG, GIF, WEBP (최대 10MB)
            </p>
          </div>
        )}
      </div>

      <p
        className="text-xs mt-2"
        style={{ color: designTokens.text.placeholder }}
      >
        권장 크기: {recommendedSize}
      </p>
    </div>
  );
}
