/**
 * 리뷰 카드 컴포넌트
 */

import { MoreVertical, Pencil, Trash2, Users } from 'lucide-react';
import { useState } from 'react';
import { StarRating } from './StarRating';
import type { CourseReview } from '@/types/tu/courseReview.types';

interface ReviewCardProps {
  review: CourseReview;
  isDark?: boolean;
  onEdit?: (review: CourseReview) => void;
  onDelete?: (reviewId: number) => void;
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffMonth / 12);

  if (diffYear > 0) return `${diffYear}년 전`;
  if (diffMonth > 0) return `${diffMonth}개월 전`;
  if (diffDay > 0) return `${diffDay}일 전`;
  if (diffHour > 0) return `${diffHour}시간 전`;
  if (diffMin > 0) return `${diffMin}분 전`;
  return '방금 전';
}

export function ReviewCard({ review, isDark = false, onEdit, onDelete }: ReviewCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  const handleEdit = () => {
    setShowMenu(false);
    onEdit?.(review);
  };

  const handleDelete = () => {
    setShowMenu(false);
    if (confirm('리뷰를 삭제하시겠습니까?')) {
      onDelete?.(review.id);
    }
  };

  return (
    <div
      className={`p-4 rounded-xl border ${
        isDark ? 'glass border-white/10' : 'bg-white border-gray-200'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {/* Author Avatar */}
          {review.author.profileImageUrl ? (
            <img
              src={review.author.profileImageUrl}
              alt={review.author.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                isDark ? 'bg-white/10' : 'bg-gray-200'
              }`}
            >
              <Users className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
          )}

          {/* Author Info */}
          <div>
            <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {review.author.name}
            </p>
            <div className="flex items-center gap-2">
              <StarRating value={review.rating} readonly size="sm" isDark={isDark} />
              <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                진도율 {review.completionRate}%
              </span>
              <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                •
              </span>
              <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                {formatRelativeTime(review.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Menu (본인 리뷰일 때만) */}
        {review.isMyReview && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className={`p-1 rounded-lg transition-colors ${
                isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'
              }`}
            >
              <MoreVertical className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                <div
                  className={`absolute right-0 top-full mt-1 py-1 rounded-lg shadow-lg border z-20 min-w-[120px] ${
                    isDark
                      ? 'bg-[#2a2a2a] border-white/10'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <button
                    onClick={handleEdit}
                    className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 transition-colors ${
                      isDark
                        ? 'text-gray-300 hover:bg-white/10'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Pencil className="w-4 h-4" />
                    수정
                  </button>
                  <button
                    onClick={handleDelete}
                    className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 transition-colors text-red-500 ${
                      isDark ? 'hover:bg-white/10' : 'hover:bg-gray-50'
                    }`}
                  >
                    <Trash2 className="w-4 h-4" />
                    삭제
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
        {review.content}
      </p>
    </div>
  );
}
