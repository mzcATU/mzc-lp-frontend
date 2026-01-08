/**
 * 코스 리뷰 섹션 컴포넌트
 * - 리뷰 통계 (평균 별점, 분포)
 * - 리뷰 목록
 * - 리뷰 작성/수정 모달
 */

import { useState } from 'react';
import { Loader2, MessageSquare, ChevronDown, X } from 'lucide-react';
import { toast } from 'sonner';
import { StarRating } from './StarRating';
import { ReviewCard } from './ReviewCard';
import {
  useCourseReviews,
  useCourseReviewStats,
  useMyCourseReview,
  useCreateCourseReview,
  useUpdateCourseReview,
  useDeleteCourseReview,
} from '@/hooks/tu';
import type { CourseReview, CourseReviewParams } from '@/types/tu/courseReview.types';

interface CourseReviewSectionProps {
  timeId: number;
  isDark?: boolean;
  /** 리뷰 작성 가능 여부 (수강 완료 학습자만) */
  canWrite?: boolean;
}

type SortOption = 'latest' | 'rating_high' | 'rating_low';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'latest', label: '최신순' },
  { value: 'rating_high', label: '별점 높은순' },
  { value: 'rating_low', label: '별점 낮은순' },
];

export function CourseReviewSection({ timeId, isDark = false, canWrite = false }: CourseReviewSectionProps) {
  const [sortBy, setSortBy] = useState<SortOption>('latest');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingReview, setEditingReview] = useState<CourseReview | null>(null);

  // 리뷰 폼 상태
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');

  // 쿼리 파라미터
  const params: CourseReviewParams = {
    sort: sortBy,
    size: 10,
  };

  // 쿼리
  const { data: reviewsData, isLoading: isLoadingReviews } = useCourseReviews(timeId, params);
  const { data: stats, isLoading: isLoadingStats } = useCourseReviewStats(timeId);
  const { data: myReview } = useMyCourseReview(timeId, canWrite);

  // 뮤테이션
  const createMutation = useCreateCourseReview();
  const updateMutation = useUpdateCourseReview();
  const deleteMutation = useDeleteCourseReview();

  const reviews = reviewsData?.content || [];
  const hasMyReview = !!myReview?.id;

  const handleOpenModal = (review?: CourseReview) => {
    if (review) {
      setEditingReview(review);
      setRating(review.rating);
      setContent(review.content);
    } else {
      setEditingReview(null);
      setRating(5);
      setContent('');
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingReview(null);
    setRating(5);
    setContent('');
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast.error('리뷰 내용을 입력해주세요.');
      return;
    }

    try {
      if (editingReview) {
        await updateMutation.mutateAsync({
          timeId,
          reviewId: editingReview.id,
          data: { rating, content: content.trim() },
        });
        toast.success('리뷰가 수정되었습니다.');
      } else {
        await createMutation.mutateAsync({
          timeId,
          data: { rating, content: content.trim() },
        });
        toast.success('리뷰가 작성되었습니다.');
      }
      handleCloseModal();
    } catch {
      toast.error(editingReview ? '리뷰 수정에 실패했습니다.' : '리뷰 작성에 실패했습니다.');
    }
  };

  const handleDelete = async (reviewId: number) => {
    try {
      await deleteMutation.mutateAsync({ timeId, reviewId });
      toast.success('리뷰가 삭제되었습니다.');
    } catch {
      toast.error('리뷰 삭제에 실패했습니다.');
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          수강평
        </h2>
        {canWrite && (
          <button
            onClick={() => handleOpenModal(hasMyReview ? myReview : undefined)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isDark
                ? 'bg-white/10 text-white hover:bg-white/20'
                : 'bg-gray-900 text-white hover:bg-gray-800'
            }`}
          >
            {hasMyReview ? '내 리뷰 수정' : '리뷰 작성'}
          </button>
        )}
      </div>

      {/* Stats */}
      {isLoadingStats ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      ) : stats ? (
        <div
          className={`p-6 rounded-xl border ${
            isDark ? 'glass border-white/10' : 'bg-white border-gray-200'
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            {/* 평균 별점 */}
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {stats.averageRating.toFixed(1)}
                </div>
                <StarRating value={stats.averageRating} readonly size="md" isDark={isDark} />
                <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {stats.totalReviews}개의 수강평
                </p>
              </div>
            </div>

            {/* 별점 분포 */}
            {stats.ratingDistribution && (
            <div className="flex-1 space-y-2">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = stats.ratingDistribution?.[star as keyof typeof stats.ratingDistribution] || 0;
                const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-2">
                    <span className={`text-sm w-12 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {star}점
                    </span>
                    <div className={`flex-1 h-2 rounded-full ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}>
                      <div
                        className="h-full rounded-full bg-yellow-400"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className={`text-sm w-10 text-right ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
            )}
          </div>
        </div>
      ) : null}

      {/* Sort & Filter */}
      <div className="flex justify-between items-center">
        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          총 {reviewsData?.totalElements || 0}개의 수강평
        </p>
        <div className="relative">
          <button
            onClick={() => setShowSortDropdown(!showSortDropdown)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-colors ${
              isDark
                ? 'bg-white/10 text-gray-300 hover:bg-white/20'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {SORT_OPTIONS.find((o) => o.value === sortBy)?.label}
            <ChevronDown className="w-4 h-4" />
          </button>

          {showSortDropdown && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowSortDropdown(false)} />
              <div
                className={`absolute right-0 top-full mt-1 py-1 rounded-lg shadow-lg border z-20 min-w-[120px] ${
                  isDark ? 'bg-[#2a2a2a] border-white/10' : 'bg-white border-gray-200'
                }`}
              >
                {SORT_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSortBy(option.value);
                      setShowSortDropdown(false);
                    }}
                    className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                      sortBy === option.value
                        ? isDark
                          ? 'bg-white/10 text-white'
                          : 'bg-gray-100 text-gray-900'
                        : isDark
                          ? 'text-gray-300 hover:bg-white/10'
                          : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Review List */}
      {isLoadingReviews ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              isDark={isDark}
              onEdit={handleOpenModal}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div
          className={`py-12 text-center rounded-xl border ${
            isDark ? 'glass border-white/10' : 'bg-white border-gray-200'
          }`}
        >
          <MessageSquare className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
          <p className={`font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            아직 수강평이 없습니다
          </p>
          <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
            첫 번째 수강평을 작성해보세요!
          </p>
        </div>
      )}

      {/* Review Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={handleCloseModal} />
          <div
            className={`relative w-full max-w-lg rounded-2xl p-6 ${
              isDark ? 'bg-[#1e1e1e]' : 'bg-white'
            }`}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {editingReview ? '리뷰 수정' : '리뷰 작성'}
              </h3>
              <button
                onClick={handleCloseModal}
                className={`p-1 rounded-lg transition-colors ${
                  isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'
                }`}
              >
                <X className={`w-6 h-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              </button>
            </div>

            {/* Rating */}
            <div className="mb-6">
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                별점
              </label>
              <div className="flex items-center gap-3">
                <StarRating value={rating} onChange={setRating} size="lg" isDark={isDark} />
                <span className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {rating}점
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="mb-6">
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                수강평
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="수강 후기를 작성해주세요."
                rows={5}
                className={`w-full px-4 py-3 rounded-xl border resize-none focus:outline-none focus:ring-2 transition-colors ${
                  isDark
                    ? 'bg-white/5 border-white/10 text-white placeholder-gray-500 focus:ring-white/30'
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-gray-300'
                }`}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleCloseModal}
                className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
                  isDark
                    ? 'bg-white/10 text-gray-300 hover:bg-white/20'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                취소
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !content.trim()}
                className="flex-1 py-3 rounded-xl font-medium bg-[#6778ff] text-white hover:bg-[#5668ee] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    저장 중...
                  </>
                ) : (
                  '저장'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
