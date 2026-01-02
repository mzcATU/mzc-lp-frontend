import { useState } from 'react';
import { X, Tag, Loader2 } from 'lucide-react';
import type { PostType, CreatePostRequest, CommunityCategory } from '@/types/tu/community.types';

interface WritePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePostRequest) => Promise<void>;
  categories: CommunityCategory[];
  isDark: boolean;
  isSubmitting?: boolean;
}

const POST_TYPES: { value: PostType; label: string; description: string }[] = [
  { value: 'question', label: 'Q&A', description: '궁금한 점을 질문하세요' },
  { value: 'tip', label: '학습 팁', description: '유용한 팁을 공유하세요' },
  { value: 'review', label: '강의 후기', description: '수강 후기를 남겨주세요' },
  { value: 'discussion', label: '스터디 모집', description: '함께 공부할 동료를 찾아보세요' },
];

export function WritePostModal({
  isOpen,
  onClose,
  onSubmit,
  categories,
  isDark,
  isSubmitting = false,
}: WritePostModalProps) {
  const [postType, setPostType] = useState<PostType>('question');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ title?: string; content?: string; category?: string }>({});

  // 카테고리 필터링 (전체 제외)
  const filteredCategories = categories.filter((cat) => cat.id !== 'all');

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

  const validate = (): boolean => {
    const newErrors: { title?: string; content?: string; category?: string } = {};

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

    if (!category) {
      newErrors.category = '카테고리를 선택해주세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const data: CreatePostRequest = {
      type: postType,
      title: title.trim(),
      content: content.trim(),
      category,
      tags: tags.length > 0 ? tags : undefined,
    };

    await onSubmit(data);

    // 성공 시 초기화
    setTitle('');
    setContent('');
    setCategory('');
    setTags([]);
    setTagInput('');
    setPostType('question');
    setErrors({});
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl ${
          isDark ? 'bg-[#252525] border border-white/10' : 'bg-white'
        }`}
      >
        {/* Header */}
        <div className={`sticky top-0 flex items-center justify-between p-6 border-b ${
          isDark ? 'bg-[#252525] border-white/10' : 'bg-white border-gray-200'
        }`}>
          <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            새 글 작성
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Post Type Selection */}
          <div>
            <label className={`block text-sm font-medium mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
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
                  <div className={`text-xs mt-1 ${postType === type.value ? 'text-white/80' : isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                    {type.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Category Selection */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              카테고리 <span className="text-red-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                if (errors.category) setErrors({ ...errors, category: undefined });
              }}
              className={`w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6778ff] ${
                isDark
                  ? 'bg-white/5 border border-white/10 text-white'
                  : 'bg-white border border-gray-200 text-gray-900'
              } ${errors.category ? 'border-red-500' : ''}`}
            >
              <option value="">카테고리를 선택하세요</option>
              {filteredCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-500">{errors.category}</p>
            )}
          </div>

          {/* Title */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
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
              <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                {title.length}/100
              </span>
            </div>
          </div>

          {/* Content */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
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
              <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                {content.length}/5000
              </span>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              태그 (최대 5개)
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
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
              disabled={isSubmitting}
              className="flex-1 landing-btn-primary px-6 py-3 rounded-xl text-white font-medium flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  게시 중...
                </>
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
