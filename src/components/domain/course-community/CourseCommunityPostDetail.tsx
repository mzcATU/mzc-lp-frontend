/**
 * 코스 커뮤니티 게시글 상세 모달
 */

import { useState } from 'react';
import {
  X,
  Heart,
  MessageCircle,
  Eye,
  Clock,
  Edit,
  Trash2,
  Loader2,
  Send,
  CornerDownRight,
  Lock,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import {
  useCourseCommunityPost,
  useCourseCommunityComments,
  useLikeCourseCommunityPost,
  useUnlikeCourseCommunityPost,
  useCreateCourseCommunityComment,
  useDeleteCourseCommunityComment,
  useLikeCourseCommunityComment,
  useUnlikeCourseCommunityComment,
} from '@/hooks/tu/useCourseCommunityQueries';
import { POST_TYPE_LABELS } from '@/types/tu/courseCommunity.types';
import type { Comment } from '@/types/tu/courseCommunity.types';
import { useAuthStore } from '@/store/common/authStore';

interface CourseCommunityPostDetailProps {
  timeId: number;
  postId: number;
  isDark: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  instructorIds?: number[];
}

const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  question: { bg: 'bg-blue-500/10', text: 'text-blue-500' },
  tip: { bg: 'bg-green-500/10', text: 'text-green-500' },
  review: { bg: 'bg-purple-500/10', text: 'text-purple-500' },
  discussion: { bg: 'bg-orange-500/10', text: 'text-orange-500' },
  announcement: { bg: 'bg-red-500/10', text: 'text-red-500' },
};

export function CourseCommunityPostDetail({
  timeId,
  postId,
  isDark,
  onClose,
  onEdit,
  onDelete,
  instructorIds,
}: CourseCommunityPostDetailProps) {
  const { user } = useAuthStore();
  const [commentContent, setCommentContent] = useState('');
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState('');

  const { data: post, isLoading: isPostLoading } = useCourseCommunityPost(
    timeId,
    postId
  );
  const { data: commentsData, isLoading: isCommentsLoading } =
    useCourseCommunityComments(timeId, postId);

  const likePost = useLikeCourseCommunityPost();
  const unlikePost = useUnlikeCourseCommunityPost();
  const createComment = useCreateCourseCommunityComment();
  const deleteComment = useDeleteCourseCommunityComment();
  const likeComment = useLikeCourseCommunityComment();
  const unlikeComment = useUnlikeCourseCommunityComment();

  const handleLikePost = async () => {
    if (!post) return;
    if (post.isLiked) {
      await unlikePost.mutateAsync({ timeId, postId });
    } else {
      await likePost.mutateAsync({ timeId, postId });
    }
  };

  const handleSubmitComment = async () => {
    if (!commentContent.trim()) return;
    await createComment.mutateAsync({
      timeId,
      postId,
      data: { content: commentContent.trim() },
    });
    setCommentContent('');
  };

  const handleSubmitReply = async (parentId: number) => {
    if (!replyContent.trim()) return;
    await createComment.mutateAsync({
      timeId,
      postId,
      data: { content: replyContent.trim(), parentId },
    });
    setReplyContent('');
    setReplyTo(null);
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!window.confirm('댓글을 삭제하시겠습니까?')) return;
    await deleteComment.mutateAsync({ timeId, postId, commentId });
  };

  const handleLikeComment = async (commentId: number, isLiked: boolean) => {
    if (isLiked) {
      await unlikeComment.mutateAsync({ timeId, postId, commentId });
    } else {
      await likeComment.mutateAsync({ timeId, postId, commentId });
    }
  };

  const isAuthor = user?.id === post?.author.id;
  const comments = commentsData?.comments || [];

  // 비밀글 열람 권한 확인
  const canViewPrivatePost = (): boolean => {
    if (!post?.isPrivate) return true;
    if (!user?.id) return false;
    if (post.author.id === user.id) return true;
    if (instructorIds?.includes(user.id)) return true;
    return false;
  };

  const hasAccess = canViewPrivatePost();

  const renderComment = (comment: Comment, depth = 0) => {
    const isCommentAuthor = user?.id === comment.author.id;
    const timeAgo = formatDistanceToNow(new Date(comment.createdAt), {
      addSuffix: true,
      locale: ko,
    });

    return (
      <div
        key={comment.id}
        className={`${depth > 0 ? 'ml-8 mt-3' : 'mt-4'}`}
      >
        <div
          className={`p-3 rounded-lg ${
            isDark ? 'bg-white/5' : 'bg-gray-50'
          }`}
        >
          {/* Comment Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {depth > 0 && (
                <CornerDownRight
                  className={`w-4 h-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}
                />
              )}
              {comment.author.avatar ? (
                <img
                  src={comment.author.avatar}
                  alt={comment.author.name}
                  className="w-6 h-6 rounded-full object-cover"
                />
              ) : (
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                    isDark ? 'bg-white/10 text-white' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {comment.author.name.charAt(0)}
                </div>
              )}
              <span
                className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}
              >
                {comment.author.name}
              </span>
              <span
                className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}
              >
                {timeAgo}
              </span>
            </div>
            {isCommentAuthor && (
              <button
                onClick={() => handleDeleteComment(comment.id)}
                className={`p-1 rounded hover:bg-red-500/10 text-red-500`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Comment Content */}
          <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            {comment.content}
          </p>

          {/* Comment Actions */}
          <div className="flex items-center gap-3 mt-2">
            <button
              onClick={() => handleLikeComment(comment.id, comment.isLiked || false)}
              className={`flex items-center gap-1 text-xs transition-colors ${
                comment.isLiked
                  ? 'text-red-500'
                  : isDark
                    ? 'text-gray-500 hover:text-red-500'
                    : 'text-gray-400 hover:text-red-500'
              }`}
            >
              <Heart
                className={`w-3.5 h-3.5 ${comment.isLiked ? 'fill-current' : ''}`}
              />
              {comment.likeCount}
            </button>
            {depth === 0 && (
              <button
                onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                className={`text-xs ${
                  isDark
                    ? 'text-gray-500 hover:text-[#6778ff]'
                    : 'text-gray-400 hover:text-[#6778ff]'
                }`}
              >
                답글
              </button>
            )}
          </div>
        </div>

        {/* Reply Input */}
        {replyTo === comment.id && (
          <div className="mt-2 ml-8 flex gap-2">
            <input
              type="text"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="답글을 입력하세요"
              className={`flex-1 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6778ff] ${
                isDark
                  ? 'bg-white/5 border border-white/10 text-white placeholder-gray-500'
                  : 'bg-white border border-gray-200 text-gray-900 placeholder-gray-400'
              }`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmitReply(comment.id);
                }
              }}
            />
            <button
              onClick={() => handleSubmitReply(comment.id)}
              disabled={!replyContent.trim() || createComment.isPending}
              className="px-3 py-2 rounded-lg bg-[#6778ff] text-white text-sm disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Nested Replies */}
        {comment.replies?.map((reply) => renderComment(reply, depth + 1))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className={`relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl ${
          isDark ? 'bg-[#252525] border border-white/10' : 'bg-white'
        }`}
      >
        {/* Header */}
        <div
          className={`sticky top-0 flex items-center justify-between p-4 border-b z-10 ${
            isDark ? 'bg-[#252525] border-white/10' : 'bg-white border-gray-200'
          }`}
        >
          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            게시글 상세
          </span>
          <button
            onClick={onClose}
            className={`p-2 rounded-full transition-colors ${
              isDark
                ? 'hover:bg-white/10 text-gray-400 hover:text-white'
                : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isPostLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#6778ff]" />
          </div>
        ) : post && !hasAccess ? (
          <div className="flex flex-col items-center justify-center py-20 px-6">
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${
                isDark ? 'bg-white/10' : 'bg-gray-100'
              }`}
            >
              <Lock className={`w-10 h-10 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
            <h3
              className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}
            >
              비밀글입니다
            </h3>
            <p
              className={`text-center mb-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
            >
              작성자와 강사만 열람할 수 있습니다.
            </p>
            <button
              onClick={onClose}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                isDark
                  ? 'bg-white/10 text-white hover:bg-white/20'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              돌아가기
            </button>
          </div>
        ) : post ? (
          <div className="p-6">
            {/* Post Header */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      TYPE_COLORS[post.type]?.bg || ''
                    } ${TYPE_COLORS[post.type]?.text || ''}`}
                  >
                    {POST_TYPE_LABELS[post.type]}
                  </span>
                  {post.isPinned && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-500">
                      고정
                    </span>
                  )}
                </div>
                <h2
                  className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}
                >
                  {post.title}
                </h2>
              </div>
              {isAuthor && (
                <div className="flex gap-2">
                  <button
                    onClick={onEdit}
                    className={`p-2 rounded-lg transition-colors ${
                      isDark
                        ? 'hover:bg-white/10 text-gray-400'
                        : 'hover:bg-gray-100 text-gray-500'
                    }`}
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={onDelete}
                    className="p-2 rounded-lg hover:bg-red-500/10 text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Author & Meta */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                {post.author.avatar ? (
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      isDark ? 'bg-white/10 text-white' : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {post.author.name.charAt(0)}
                  </div>
                )}
                <span
                  className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}
                >
                  {post.author.name}
                </span>
              </div>
              <div
                className={`flex items-center gap-4 text-sm ${
                  isDark ? 'text-gray-500' : 'text-gray-400'
                }`}
              >
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {formatDistanceToNow(new Date(post.createdAt), {
                    addSuffix: true,
                    locale: ko,
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {post.viewCount}
                </span>
              </div>
            </div>

            {/* Content */}
            <div
              className={`prose prose-sm max-w-none mb-6 ${
                isDark ? 'prose-invert' : ''
              }`}
            >
              <div
                className={`whitespace-pre-wrap ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
              >
                {post.content}
              </div>
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`text-sm px-3 py-1 rounded-full ${
                      isDark
                        ? 'bg-[#6778ff]/20 text-[#6778ff]'
                        : 'bg-[#6778ff]/10 text-[#6778ff]'
                    }`}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Actions */}
            <div
              className={`flex items-center gap-4 py-4 border-t border-b ${
                isDark ? 'border-white/10' : 'border-gray-200'
              }`}
            >
              <button
                onClick={handleLikePost}
                disabled={likePost.isPending || unlikePost.isPending}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  post.isLiked
                    ? 'bg-red-500/10 text-red-500'
                    : isDark
                      ? 'bg-white/5 text-gray-400 hover:text-red-500 hover:bg-red-500/10'
                      : 'bg-gray-100 text-gray-600 hover:text-red-500 hover:bg-red-500/10'
                }`}
              >
                <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
                좋아요 {post.likeCount}
              </button>
              <div
                className={`flex items-center gap-2 px-4 py-2 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                <MessageCircle className="w-5 h-5" />
                댓글 {post.commentCount}
              </div>
            </div>

            {/* Comments Section */}
            <div className="mt-6">
              <h3
                className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}
              >
                댓글 {comments.length}개
              </h3>

              {/* Comment Input */}
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  placeholder="댓글을 입력하세요"
                  className={`flex-1 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#6778ff] ${
                    isDark
                      ? 'bg-white/5 border border-white/10 text-white placeholder-gray-500'
                      : 'bg-white border border-gray-200 text-gray-900 placeholder-gray-400'
                  }`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmitComment();
                    }
                  }}
                />
                <button
                  onClick={handleSubmitComment}
                  disabled={!commentContent.trim() || createComment.isPending}
                  className="px-4 py-2 rounded-lg bg-[#6778ff] text-white font-medium disabled:opacity-50 flex items-center gap-2"
                >
                  {createComment.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Comments List */}
              {isCommentsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-[#6778ff]" />
                </div>
              ) : comments.length === 0 ? (
                <p
                  className={`text-center py-8 ${
                    isDark ? 'text-gray-500' : 'text-gray-400'
                  }`}
                >
                  아직 댓글이 없습니다. 첫 댓글을 작성해보세요!
                </p>
              ) : (
                <div>{comments.map((comment) => renderComment(comment))}</div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-20">
            <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
              게시글을 찾을 수 없습니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
