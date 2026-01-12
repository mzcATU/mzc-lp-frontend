/**
 * 코스 커뮤니티 게시글 카드 컴포넌트
 */

import { MessageCircle, Heart, Eye, Clock, CheckCircle, Lock } from 'lucide-react';
import { toast } from 'sonner';
import type { CourseCommunityPost } from '@/types/tu/courseCommunity.types';
import { POST_TYPE_LABELS } from '@/types/tu/courseCommunity.types';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

interface CourseCommunityPostCardProps {
  post: CourseCommunityPost;
  isDark: boolean;
  onClick: () => void;
  currentUserId?: number;
  instructorIds?: number[];
}

const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  question: { bg: 'bg-blue-500/10', text: 'text-blue-500' },
  tip: { bg: 'bg-green-500/10', text: 'text-green-500' },
  review: { bg: 'bg-purple-500/10', text: 'text-purple-500' },
  discussion: { bg: 'bg-orange-500/10', text: 'text-orange-500' },
  announcement: { bg: 'bg-red-500/10', text: 'text-red-500' },
};

export function CourseCommunityPostCard({
  post,
  isDark,
  onClick,
  currentUserId,
  instructorIds,
}: CourseCommunityPostCardProps) {
  const typeColor = TYPE_COLORS[post.type] || TYPE_COLORS.discussion;
  const timeAgo = formatDistanceToNow(new Date(post.createdAt), {
    addSuffix: true,
    locale: ko,
  });

  // 비밀글 열람 권한 확인
  const canViewPrivatePost = (): boolean => {
    if (!post.isPrivate) return true;
    if (!currentUserId) return false;
    if (post.author.id === currentUserId) return true;
    if (instructorIds?.includes(currentUserId)) return true;
    return false;
  };

  const hasAccess = canViewPrivatePost();

  const handleClick = () => {
    if (post.isPrivate && !hasAccess) {
      toast.error('비밀글입니다', {
        description: '작성자와 강사만 열람할 수 있습니다.',
      });
      return;
    }
    onClick();
  };

  return (
    <div
      onClick={handleClick}
      className={`p-4 rounded-xl cursor-pointer transition-all hover:shadow-md ${
        isDark
          ? 'bg-white/5 hover:bg-white/10 border border-white/10'
          : 'bg-white hover:bg-gray-50 border border-gray-200'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeColor.bg} ${typeColor.text}`}
          >
            {POST_TYPE_LABELS[post.type]}
          </span>
          {post.isPinned && (
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-500">
              고정
            </span>
          )}
          {post.isSolved && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-500">
              <CheckCircle className="w-3 h-3" />
              해결됨
            </span>
          )}
          {post.isPrivate && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-500/10 text-gray-500">
              <Lock className="w-3 h-3" />
              비밀글
            </span>
          )}
        </div>
      </div>

      {/* Title */}
      <h3
        className={`font-semibold mb-2 line-clamp-2 ${
          isDark ? 'text-white' : 'text-gray-900'
        } ${!hasAccess && post.isPrivate ? 'italic' : ''}`}
      >
        {hasAccess ? post.title : '비밀글입니다'}
      </h3>

      {/* Excerpt */}
      {hasAccess && post.excerpt && (
        <p
          className={`text-sm mb-3 line-clamp-2 ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          {post.excerpt}
        </p>
      )}
      {!hasAccess && post.isPrivate && (
        <p
          className={`text-sm mb-3 ${
            isDark ? 'text-gray-500' : 'text-gray-400'
          }`}
        >
          작성자와 강사만 열람할 수 있습니다.
        </p>
      )}

      {/* Tags */}
      {hasAccess && post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {post.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className={`text-xs px-2 py-0.5 rounded-full ${
                isDark
                  ? 'bg-[#6778ff]/20 text-[#6778ff]'
                  : 'bg-[#6778ff]/10 text-[#6778ff]'
              }`}
            >
              #{tag}
            </span>
          ))}
          {post.tags.length > 3 && (
            <span
              className={`text-xs px-2 py-0.5 ${
                isDark ? 'text-gray-500' : 'text-gray-400'
              }`}
            >
              +{post.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {post.author.avatar ? (
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-6 h-6 rounded-full object-cover"
            />
          ) : (
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                isDark ? 'bg-white/10 text-white' : 'bg-gray-200 text-gray-600'
              }`}
            >
              {post.author.name.charAt(0)}
            </div>
          )}
          <span
            className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
          >
            {post.author.name}
          </span>
        </div>

        <div
          className={`flex items-center gap-3 text-xs ${
            isDark ? 'text-gray-500' : 'text-gray-400'
          }`}
        >
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {timeAgo}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            {post.viewCount}
          </span>
          <span className="flex items-center gap-1">
            <Heart
              className={`w-3.5 h-3.5 ${post.isLiked ? 'fill-red-500 text-red-500' : ''}`}
            />
            {post.likeCount}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="w-3.5 h-3.5" />
            {post.commentCount}
          </span>
        </div>
      </div>
    </div>
  );
}
