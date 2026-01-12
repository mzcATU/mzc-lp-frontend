/**
 * 코스 커뮤니티 게시글 작성/수정 모달
 */

import { useState, useRef, useEffect } from 'react';
import { X, Tag, Loader2, ImagePlus, Trash2, Lock } from 'lucide-react';
import type {
  PostType,
  CreateCourseCommunityPostRequest,
  CourseCommunityPost,
} from '@/types/tu/courseCommunity.types';
import { communityService } from '@/services/tu/communityService';

interface CourseCommunityWritePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCourseCommunityPostRequest) => Promise<void>;
  isDark: boolean;
  isSubmitting?: boolean;
  editPost?: CourseCommunityPost | null;
}

const POST_TYPES: { value: PostType; label: string; description: string }[] = [
  { value: 'question', label: 'Q&A', description: '궁금한 점을 질문하세요' },
  { value: 'tip', label: '학습 팁', description: '유용한 팁을 공유하세요' },
  { value: 'review', label: '강의 후기', description: '수강 후기를 남겨주세요' },
  { value: 'discussion', label: '자유 토론', description: '자유롭게 이야기해요' },
];

const MAX_IMAGES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function CourseCommunityWritePostModal({
  isOpen,
  onClose,
  onSubmit,
  isDark,
  isSubmitting = false,
  editPost,
}: CourseCommunityWritePostModalProps) {
  const [postType, setPostType] = useState<PostType>('question');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [images, setImages] = useState<
    { file: File; preview: string; uploading: boolean; url?: string }[]
  >([]);
  const [isPrivate, setIsPrivate] = useState(false);
  const [errors, setErrors] = useState<{
    title?: string;
    content?: string;
    images?: string;
  }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 수정 모드일 때 초기값 설정
  useEffect(() => {
    if (editPost) {
      setPostType(editPost.type);
      setTitle(editPost.title);
      setContent(editPost.content);
      setTags(editPost.tags || []);
      setIsPrivate(editPost.isPrivate || false);
    } else {
      setPostType('question');
      setTitle('');
      setContent('');
      setTags([]);
      setTagInput('');
      setImages([]);
      setIsPrivate(false);
      setErrors({});
    }
  }, [editPost, isOpen]);

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 5) {
      setTags([...tags, trimmedTag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const remainingSlots = MAX_IMAGES - images.length;
    const filesToAdd = Array.from(files).slice(0, remainingSlots);

    for (const file of filesToAdd) {
      if (file.size > MAX_FILE_SIZE) {
        setErrors((prev) => ({
          ...prev,
          images: `파일 크기는 5MB를 초과할 수 없습니다: ${file.name}`,
        }));
        continue;
      }

      if (!file.type.startsWith('image/')) {
        setErrors((prev) => ({
          ...prev,
          images: `이미지 파일만 업로드 가능합니다: ${file.name}`,
        }));
        continue;
      }

      const preview = URL.createObjectURL(file);
      const newImage = { file, preview, uploading: true };

      setImages((prev) => [...prev, newImage]);

      try {
        const url = await communityService.uploadImage(file);
        setImages((prev) =>
          prev.map((img) =>
            img.preview === preview ? { ...img, uploading: false, url } : img
          )
        );
        const imageMarkdown = `\n![이미지](${url})\n`;
        setContent((prev) => prev + imageMarkdown);
        setErrors((prev) => ({ ...prev, images: undefined }));
      } catch {
        setImages((prev) => prev.filter((img) => img.preview !== preview));
        setErrors((prev) => ({ ...prev, images: '이미지 업로드에 실패했습니다.' }));
        URL.revokeObjectURL(preview);
      }
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (preview: string) => {
    setImages((prev) => {
      const imageToRemove = prev.find((img) => img.preview === preview);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview);
      }
      return prev.filter((img) => img.preview !== preview);
    });
  };

  const insertImageToContent = (url: string) => {
    const imageMarkdown = `\n![이미지](${url})\n`;
    setContent((prev) => prev + imageMarkdown);
  };

  const validate = (): boolean => {
    const newErrors: { title?: string; content?: string } = {};

    if (!title.trim()) {
      newErrors.title = '제목을 입력해주세요';
    } else if (title.length < 5) {
      newErrors.title = '제목은 5자 이상이어야 합니다';
    }

    if (!content.trim()) {
      newErrors.content = '내용을 입력해주세요';
    } else if (content.length < 10) {
      newErrors.content = '내용은 10자 이상이어야 합니다';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    if (images.some((img) => img.uploading)) {
      setErrors((prev) => ({
        ...prev,
        images: '이미지 업로드가 완료될 때까지 기다려주세요.',
      }));
      return;
    }

    // type에 따른 기본 카테고리 매핑
    const categoryMap: Record<PostType, string> = {
      question: 'Q&A',
      tip: '학습팁',
      review: '후기',
      discussion: '자유게시판',
      announcement: '공지',
    };

    const data: CreateCourseCommunityPostRequest = {
      type: postType,
      title: title.trim(),
      content: content.trim(),
      category: categoryMap[postType] || '일반',
      tags: tags.length > 0 ? tags : undefined,
      isPrivate: isPrivate || undefined,
    };

    await onSubmit(data);

    setTitle('');
    setContent('');
    setTags([]);
    setTagInput('');
    setPostType('question');
    setErrors({});
    images.forEach((img) => URL.revokeObjectURL(img.preview));
    setImages([]);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div
        className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl ${
          isDark ? 'bg-[#252525] border border-white/10' : 'bg-white'
        }`}
      >
        <div
          className={`sticky top-0 flex items-center justify-between p-6 border-b z-10 ${
            isDark
              ? 'bg-[#252525] border-white/10'
              : 'bg-white border-gray-200'
          }`}
        >
          <h2
            className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}
          >
            {editPost ? '글 수정' : '새 글 작성'}
          </h2>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className={`p-2 rounded-full transition-colors ${
              isDark
                ? 'hover:bg-white/10 text-gray-400 hover:text-white'
                : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
            } disabled:opacity-50`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Post Type Selection */}
          <div>
            <label
              className={`block text-sm font-medium mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
            >
              게시글 유형
            </label>
            <div className="grid grid-cols-2 gap-3">
              {POST_TYPES.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setPostType(type.value)}
                  className={`p-3 rounded-xl text-left transition-all ${
                    postType === type.value
                      ? 'bg-gradient-to-r from-[#6778ff] to-[#a855f7] text-white'
                      : isDark
                        ? 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200'
                  }`}
                >
                  <div className="font-medium">{type.label}</div>
                  <div
                    className={`text-xs mt-1 ${postType === type.value ? 'text-white/80' : isDark ? 'text-gray-500' : 'text-gray-500'}`}
                  >
                    {type.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
            >
              제목 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors({ ...errors, title: undefined });
              }}
              placeholder="제목을 입력하세요"
              maxLength={100}
              className={`w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6778ff] ${
                isDark
                  ? 'bg-white/5 border border-white/10 text-white placeholder-gray-500'
                  : 'bg-white border border-gray-200 text-gray-900 placeholder-gray-400'
              } ${errors.title ? 'border-red-500' : ''}`}
            />
            <div className="flex justify-between mt-1">
              {errors.title ? (
                <p className="text-sm text-red-500">{errors.title}</p>
              ) : (
                <span />
              )}
              <span
                className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}
              >
                {title.length}/100
              </span>
            </div>
          </div>

          {/* Content */}
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
            >
              내용 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                if (errors.content) setErrors({ ...errors, content: undefined });
              }}
              placeholder="내용을 입력하세요"
              rows={8}
              maxLength={5000}
              className={`w-full rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-[#6778ff] ${
                isDark
                  ? 'bg-white/5 border border-white/10 text-white placeholder-gray-500'
                  : 'bg-white border border-gray-200 text-gray-900 placeholder-gray-400'
              } ${errors.content ? 'border-red-500' : ''}`}
            />
            <div className="flex justify-between mt-1">
              {errors.content ? (
                <p className="text-sm text-red-500">{errors.content}</p>
              ) : (
                <span />
              )}
              <span
                className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}
              >
                {content.length}/5000
              </span>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
            >
              이미지 (최대 {MAX_IMAGES}개)
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageSelect}
              className="hidden"
            />
            <div className="flex flex-wrap gap-3">
              {images.map((img) => (
                <div
                  key={img.preview}
                  className={`relative w-24 h-24 rounded-xl overflow-hidden border ${
                    isDark ? 'border-white/10' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={img.preview}
                    alt="업로드 이미지"
                    className="w-full h-full object-cover"
                  />
                  {img.uploading ? (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Loader2 className="w-6 h-6 text-white animate-spin" />
                    </div>
                  ) : (
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/50 transition-colors group">
                      <div className="absolute inset-0 flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => img.url && insertImageToContent(img.url)}
                          className="p-1.5 bg-blue-500 rounded-full text-white hover:bg-blue-600"
                          title="본문에 삽입"
                        >
                          <ImagePlus className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(img.preview)}
                          className="p-1.5 bg-red-500 rounded-full text-white hover:bg-red-600"
                          title="삭제"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {images.length < MAX_IMAGES && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-24 h-24 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1 transition-colors ${
                    isDark
                      ? 'border-white/20 hover:border-white/40 text-gray-400 hover:text-gray-300'
                      : 'border-gray-300 hover:border-gray-400 text-gray-400 hover:text-gray-500'
                  }`}
                >
                  <ImagePlus className="w-6 h-6" />
                  <span className="text-xs">추가</span>
                </button>
              )}
            </div>
            {errors.images && (
              <p className="mt-2 text-sm text-red-500">{errors.images}</p>
            )}
            <p
              className={`mt-2 text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}
            >
              이미지 업로드 시 자동으로 본문에 삽입됩니다. (최대 5MB)
            </p>
          </div>

          {/* Tags */}
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
            >
              태그 (최대 5개)
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag
                  className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}
                />
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="태그 입력 후 Enter"
                  disabled={tags.length >= 5}
                  className={`w-full rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6778ff] ${
                    isDark
                      ? 'bg-white/5 border border-white/10 text-white placeholder-gray-500'
                      : 'bg-white border border-gray-200 text-gray-900 placeholder-gray-400'
                  } disabled:opacity-50`}
                />
              </div>
              <button
                type="button"
                onClick={handleAddTag}
                disabled={!tagInput.trim() || tags.length >= 5}
                className={`px-4 py-3 rounded-xl font-medium transition-colors ${
                  isDark
                    ? 'bg-white/10 text-white hover:bg-white/20'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } disabled:opacity-50`}
              >
                추가
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                      isDark
                        ? 'bg-[#6778ff]/20 text-[#6778ff]'
                        : 'bg-[#6778ff]/10 text-[#6778ff]'
                    }`}
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Private Post Option */}
          <div
            className={`flex items-center gap-3 p-4 rounded-xl border ${
              isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
            }`}
          >
            <input
              type="checkbox"
              id="isPrivate"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-[#6778ff] focus:ring-[#6778ff] cursor-pointer"
            />
            <Lock
              className={`w-4 h-4 ${
                isPrivate
                  ? 'text-[#6778ff]'
                  : isDark
                    ? 'text-gray-500'
                    : 'text-gray-400'
              }`}
            />
            <label
              htmlFor="isPrivate"
              className={`flex-1 cursor-pointer ${isDark ? 'text-white' : 'text-gray-900'}`}
            >
              <span className="font-medium">비밀글로 작성</span>
              <span
                className={`text-xs ml-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
              >
                작성자와 강사만 열람 가능
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className={`flex-1 px-6 py-3 rounded-xl font-medium transition-colors ${
                isDark
                  ? 'bg-white/10 text-white hover:bg-white/20'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } disabled:opacity-50`}
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting || images.some((img) => img.uploading)}
              className="flex-1 landing-btn-primary px-6 py-3 rounded-xl text-white font-medium flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {editPost ? '수정 중...' : '게시 중...'}
                </>
              ) : editPost ? (
                '수정하기'
              ) : (
                '게시하기'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
