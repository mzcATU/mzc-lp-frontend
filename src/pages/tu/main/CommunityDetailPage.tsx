/**
 * CommunityDetailPage
 * 커뮤니티 게시글 상세 페이지 (인프런 스타일)
 */
import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Heart,
  MessageSquare,
  Eye,
  Clock,
  Share2,
  MoreHorizontal,
  Star,
  Users,
  ChevronRight,
  Send,
  Loader2,
  Trash2,
  Flag,
} from 'lucide-react';
import { toast } from 'sonner';
import { useThemeStore } from '@/store/common/themeStore';
import { LandingHeader, LandingFooter } from '@/components/landing';
import { Button } from '@/components/common';
import {
  useCommunityPost,
  useLikePost,
  useUnlikePost,
  useCreateComment,
  useDeleteComment,
  useLikeComment,
  useUnlikeComment,
} from '@/hooks/tu/useCommunityQueries';
import type { CommunityPostDetail, Comment } from '@/types/tu/community.types';
import { POST_TYPE_LABELS } from '@/types/tu/community.types';

// API 사용 여부 플래그
const USE_API = false;

// 더미 게시글 상세 데이터
const MOCK_POST_DETAIL: CommunityPostDetail = {
  id: 1,
  type: 'review',
  category: 'review',
  title: '[후기] Next.js 15 완벽 마스터 강의 솔직 리뷰',
  content: `안녕하세요, 프론트마스터입니다.

김개발님의 Next.js 15 완벽 마스터 강의를 완강하고 후기를 남깁니다.

## 강의 장점

1. **체계적인 커리큘럼**: App Router부터 Server Components까지 순서대로 배울 수 있어서 좋았습니다.
2. **실전 프로젝트**: 이론만 배우는 게 아니라 실제 프로젝트를 만들어보면서 학습할 수 있었어요.
3. **친절한 설명**: 어려운 개념도 쉽게 풀어서 설명해주셔서 이해가 잘 됐습니다.

## 아쉬운 점

- 간혹 음질이 좋지 않은 부분이 있었어요
- 좀 더 다양한 예제가 있었으면 좋겠습니다

## 총평

전반적으로 Next.js를 처음 배우시는 분들께 강력 추천드립니다!
실무에서 바로 적용할 수 있는 내용들이 많아서 정말 유익했어요.

⭐⭐⭐⭐⭐ 5점 만점에 5점!`,
  excerpt: '김개발님의 Next.js 강의를 완강했습니다. App Router부터 서버 컴포넌트까지 정말 깊이있게 다뤄주셔서 실무에 바로 적용할 수 있었어요.',
  author: {
    id: 3,
    name: '프론트마스터',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
  },
  tags: ['Next.js', '강의후기', 'React'],
  viewCount: 892,
  likeCount: 56,
  commentCount: 5,
  isLiked: false,
  createdAt: '2024-12-29T10:00:00Z',
  relatedCourse: {
    id: 1,
    title: '실전! Next.js 15 완벽 마스터',
    thumbnailUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=450&fit=crop',
    instructor: {
      id: 1,
      name: '김개발',
      profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    },
    rating: 4.9,
    studentCount: 5678,
  },
};

// 더미 댓글 데이터
const MOCK_COMMENTS: Comment[] = [
  {
    id: 1,
    postId: 1,
    content: '좋은 후기 감사합니다! 저도 이 강의 들을까 고민 중이었는데 결정하는데 도움이 됐어요.',
    author: {
      id: 4,
      name: '코딩초보',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
    },
    likeCount: 3,
    isLiked: false,
    createdAt: '2024-12-29T12:00:00Z',
  },
  {
    id: 2,
    postId: 1,
    content: '저도 완강했는데 정말 좋은 강의였어요! 특히 Server Actions 부분이 유익했습니다.',
    author: {
      id: 5,
      name: '개발왕',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=100&h=100&fit=crop',
    },
    likeCount: 5,
    isLiked: true,
    createdAt: '2024-12-29T14:30:00Z',
    replies: [
      {
        id: 3,
        postId: 1,
        parentId: 2,
        content: '맞아요! Server Actions 덕분에 폼 처리가 훨씬 간편해졌어요.',
        author: {
          id: 3,
          name: '프론트마스터',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
        },
        likeCount: 2,
        isLiked: false,
        createdAt: '2024-12-29T15:00:00Z',
      },
    ],
  },
  {
    id: 4,
    postId: 1,
    content: '혹시 React 기초 없이도 들을 수 있을까요?',
    author: {
      id: 6,
      name: '입문자',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    },
    likeCount: 1,
    isLiked: false,
    createdAt: '2024-12-30T09:00:00Z',
    replies: [
      {
        id: 5,
        postId: 1,
        parentId: 4,
        content: 'React 기초는 필수입니다! useState, useEffect 정도는 알고 계셔야 해요.',
        author: {
          id: 3,
          name: '프론트마스터',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
        },
        likeCount: 4,
        isLiked: false,
        createdAt: '2024-12-30T10:00:00Z',
      },
    ],
  },
];

// 상대 시간 포맷
const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return '방금 전';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}일 전`;
  return date.toLocaleDateString('ko-KR');
};

// 댓글 컴포넌트
interface CommentItemProps {
  comment: Comment;
  isDark: boolean;
  onReply: (commentId: number) => void;
  onLike: (commentId: number, isLiked: boolean) => void;
  onDelete: (commentId: number) => void;
  isReply?: boolean;
}

function CommentItem({ comment, isDark, onReply, onLike, onDelete, isReply = false }: CommentItemProps) {
  const [showActions, setShowActions] = useState(false);

  return (
    <div className={`${isReply ? 'ml-12 mt-4' : ''}`}>
      <div className="flex gap-3">
        {/* 아바타 */}
        <img
          src={comment.author.avatar || 'https://via.placeholder.com/40'}
          alt={comment.author.name}
          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
        />

        {/* 콘텐츠 */}
        <div className="flex-1 min-w-0">
          {/* 헤더 */}
          <div className="flex items-center gap-2 mb-1">
            <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {comment.author.name}
            </span>
            <span className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              {formatRelativeTime(comment.createdAt)}
            </span>
          </div>

          {/* 내용 */}
          <p className={`text-sm leading-relaxed mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            {comment.content}
          </p>

          {/* 액션 버튼 */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => onLike(comment.id, comment.isLiked || false)}
              className={`flex items-center gap-1 text-sm transition-colors ${
                comment.isLiked
                  ? 'text-red-500'
                  : isDark
                    ? 'text-gray-500 hover:text-gray-300'
                    : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Heart className={`w-4 h-4 ${comment.isLiked ? 'fill-current' : ''}`} />
              <span>{comment.likeCount}</span>
            </button>

            {!isReply && (
              <button
                onClick={() => onReply(comment.id)}
                className={`text-sm transition-colors ${
                  isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                답글
              </button>
            )}

            <div className="relative">
              <button
                onClick={() => setShowActions(!showActions)}
                className={`p-1 rounded transition-colors ${
                  isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'
                }`}
              >
                <MoreHorizontal className={`w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
              </button>

              {showActions && (
                <div
                  className={`absolute right-0 top-full mt-1 py-1 rounded-lg shadow-lg border z-10 min-w-[120px] ${
                    isDark ? 'bg-[#2a2a2a] border-white/10' : 'bg-white border-gray-200'
                  }`}
                >
                  <button
                    onClick={() => {
                      onDelete(comment.id);
                      setShowActions(false);
                    }}
                    className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 ${
                      isDark ? 'hover:bg-white/5 text-red-400' : 'hover:bg-gray-50 text-red-500'
                    }`}
                  >
                    <Trash2 className="w-4 h-4" />
                    삭제
                  </button>
                  <button
                    className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 ${
                      isDark ? 'hover:bg-white/5 text-gray-300' : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <Flag className="w-4 h-4" />
                    신고
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 대댓글 */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              isDark={isDark}
              onReply={onReply}
              onLike={onLike}
              onDelete={onDelete}
              isReply
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function CommunityDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const postId = id ? parseInt(id, 10) : 0;

  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  // 상태
  const [commentText, setCommentText] = useState('');
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [localLiked, setLocalLiked] = useState(false);
  const [localLikeCount, setLocalLikeCount] = useState(0);
  const [comments, setComments] = useState<Comment[]>(MOCK_COMMENTS);

  // React Query 훅 (API 모드일 때만 활성화)
  const { data: apiPost, isLoading, error } = useCommunityPost(postId, USE_API);
  const likePostMutation = useLikePost();
  const unlikePostMutation = useUnlikePost();
  const createCommentMutation = useCreateComment();
  const deleteCommentMutation = useDeleteComment();
  const likeCommentMutation = useLikeComment();
  const unlikeCommentMutation = useUnlikeComment();

  // 실제 사용할 데이터
  const post: CommunityPostDetail = USE_API ? (apiPost || MOCK_POST_DETAIL) : MOCK_POST_DETAIL;

  // 초기 좋아요 상태 설정
  useState(() => {
    setLocalLiked(post.isLiked || false);
    setLocalLikeCount(post.likeCount);
  });

  // 게시글 좋아요 토글
  const handleLikePost = async () => {
    if (USE_API) {
      try {
        if (localLiked) {
          await unlikePostMutation.mutateAsync(postId);
        } else {
          await likePostMutation.mutateAsync(postId);
        }
      } catch (err) {
        console.error('좋아요 실패:', err);
        return;
      }
    }

    setLocalLiked(!localLiked);
    setLocalLikeCount((prev) => (localLiked ? prev - 1 : prev + 1));
  };

  // 댓글 좋아요 토글
  const handleLikeComment = async (commentId: number, isLiked: boolean) => {
    if (USE_API) {
      try {
        if (isLiked) {
          await unlikeCommentMutation.mutateAsync({ postId, commentId });
        } else {
          await likeCommentMutation.mutateAsync({ postId, commentId });
        }
      } catch (err) {
        console.error('댓글 좋아요 실패:', err);
        return;
      }
    }

    // 로컬 상태 업데이트
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId) {
          return {
            ...c,
            isLiked: !isLiked,
            likeCount: isLiked ? c.likeCount - 1 : c.likeCount + 1,
          };
        }
        if (c.replies) {
          return {
            ...c,
            replies: c.replies.map((r) =>
              r.id === commentId
                ? { ...r, isLiked: !isLiked, likeCount: isLiked ? r.likeCount - 1 : r.likeCount + 1 }
                : r
            ),
          };
        }
        return c;
      })
    );
  };

  // 댓글 작성
  const handleSubmitComment = async () => {
    if (!commentText.trim()) return;

    if (USE_API) {
      try {
        await createCommentMutation.mutateAsync({
          postId,
          content: commentText,
          parentId: replyTo || undefined,
        });
      } catch (err) {
        console.error('댓글 작성 실패:', err);
        toast.error('댓글 작성에 실패했습니다.');
        return;
      }
    } else {
      // Mock 모드에서 로컬 상태 업데이트
      const newComment: Comment = {
        id: Date.now(),
        postId,
        content: commentText,
        author: {
          id: 999,
          name: '나',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
        },
        likeCount: 0,
        isLiked: false,
        parentId: replyTo || undefined,
        createdAt: new Date().toISOString(),
      };

      if (replyTo) {
        setComments((prev) =>
          prev.map((c) =>
            c.id === replyTo ? { ...c, replies: [...(c.replies || []), newComment] } : c
          )
        );
      } else {
        setComments((prev) => [...prev, newComment]);
      }
    }

    setCommentText('');
    setReplyTo(null);
    toast.success('댓글이 등록되었습니다.');
  };

  // 댓글 삭제
  const handleDeleteComment = async (commentId: number) => {
    if (USE_API) {
      try {
        await deleteCommentMutation.mutateAsync({ postId, commentId });
      } catch (err) {
        console.error('댓글 삭제 실패:', err);
        toast.error('댓글 삭제에 실패했습니다.');
        return;
      }
    }

    // 로컬 상태 업데이트
    setComments((prev) =>
      prev
        .filter((c) => c.id !== commentId)
        .map((c) => ({
          ...c,
          replies: c.replies?.filter((r) => r.id !== commentId),
        }))
    );
    toast.success('댓글이 삭제되었습니다.');
  };

  // 공유하기
  const handleShare = async () => {
    const url = window.location.href;

    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        toast.success('링크가 클립보드에 복사되었습니다.');
      }
    } catch {
      toast.error('링크 복사에 실패했습니다.');
    }
  };

  // 로딩 상태
  if (USE_API && isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
        <Loader2 className="w-8 h-8 animate-spin text-[#6778ff]" />
      </div>
    );
  }

  // 에러 상태
  if (USE_API && error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
        <div className="text-center">
          <p className={`text-xl ${isDark ? 'text-white' : 'text-gray-900'}`}>게시글을 불러올 수 없습니다.</p>
          <Link to="/tu/main/community" className="text-[#6778ff] hover:underline mt-4 inline-block">
            커뮤니티로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'landing-dark bg-[#1e1e1e]' : 'landing-light bg-gray-50'}`}>
      <LandingHeader />

      <main className="w-full px-4 md:px-8 lg:px-16 py-8">
        {/* 뒤로가기 */}
        <button
          onClick={() => navigate(-1)}
          className={`flex items-center gap-2 mb-6 transition-colors ${
            isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <ArrowLeft className="w-5 h-5" />
          <span>목록으로</span>
        </button>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* 메인 콘텐츠 */}
          <article className="flex-1 max-w-3xl">
            {/* 프로필 섹션 */}
            <div className="flex items-center gap-4 mb-6">
              <img
                src={post.author.avatar || 'https://via.placeholder.com/48'}
                alt={post.author.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {post.author.name}
                  </span>
                  <span
                    className={`px-2 py-0.5 text-xs rounded ${
                      isDark ? 'bg-[#6778ff]/20 text-[#6778ff]' : 'bg-[#6778ff]/10 text-[#6778ff]'
                    }`}
                  >
                    {POST_TYPE_LABELS[post.type] || post.type}
                  </span>
                </div>
                <div className={`flex items-center gap-3 text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatRelativeTime(post.createdAt)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {post.viewCount}
                  </span>
                </div>
              </div>
            </div>

            {/* 제목 */}
            <h1 className={`text-2xl md:text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {post.title}
            </h1>

            {/* 태그 */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`px-3 py-1 rounded-full text-sm ${
                      isDark ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* 본문 */}
            <div
              className={`prose max-w-none mb-8 ${
                isDark ? 'prose-invert' : ''
              } prose-headings:font-bold prose-h2:text-xl prose-p:leading-relaxed`}
            >
              <div
                className={`whitespace-pre-wrap leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
              >
                {post.content}
              </div>
            </div>

            {/* 액션 버튼 */}
            <div
              className={`flex items-center justify-between py-4 border-y mb-8 ${
                isDark ? 'border-white/10' : 'border-gray-200'
              }`}
            >
              <div className="flex items-center gap-4">
                <button
                  onClick={handleLikePost}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    localLiked
                      ? 'bg-red-500/10 text-red-500'
                      : isDark
                        ? 'bg-white/5 text-gray-400 hover:bg-white/10'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${localLiked ? 'fill-current' : ''}`} />
                  <span className="font-medium">{localLikeCount}</span>
                </button>

                <div
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                    isDark ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <MessageSquare className="w-5 h-5" />
                  <span className="font-medium">{comments.length}</span>
                </div>
              </div>

              <button
                onClick={handleShare}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  isDark
                    ? 'bg-white/5 text-gray-400 hover:bg-white/10'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Share2 className="w-5 h-5" />
                <span>공유</span>
              </button>
            </div>

            {/* 댓글 섹션 */}
            <section>
              <h2 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                댓글 {comments.length}개
              </h2>

              {/* 댓글 입력 */}
              <div className={`rounded-xl p-4 mb-6 ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
                {replyTo && (
                  <div
                    className={`flex items-center justify-between mb-3 pb-3 border-b ${
                      isDark ? 'border-white/10' : 'border-gray-200'
                    }`}
                  >
                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      답글 작성 중...
                    </span>
                    <button
                      onClick={() => setReplyTo(null)}
                      className={`text-sm ${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      취소
                    </button>
                  </div>
                )}
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="댓글을 작성해주세요..."
                  rows={3}
                  className={`w-full rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-[#6778ff] ${
                    isDark
                      ? 'bg-white/5 border border-white/10 text-white placeholder-gray-500'
                      : 'bg-white border border-gray-200 text-gray-900 placeholder-gray-400'
                  }`}
                />
                <div className="flex justify-end mt-3">
                  <Button
                    onClick={handleSubmitComment}
                    disabled={!commentText.trim() || createCommentMutation.isPending}
                    className="gap-2"
                  >
                    {createCommentMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    등록
                  </Button>
                </div>
              </div>

              {/* 댓글 목록 */}
              <div className="space-y-6">
                {comments.map((comment) => (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    isDark={isDark}
                    onReply={(commentId) => setReplyTo(commentId)}
                    onLike={handleLikeComment}
                    onDelete={handleDeleteComment}
                  />
                ))}

                {comments.length === 0 && (
                  <div className="text-center py-12">
                    <MessageSquare
                      className={`w-12 h-12 mx-auto mb-3 ${isDark ? 'text-gray-600' : 'text-gray-300'}`}
                    />
                    <p className={isDark ? 'text-gray-500' : 'text-gray-400'}>
                      첫 번째 댓글을 남겨보세요!
                    </p>
                  </div>
                )}
              </div>
            </section>
          </article>

          {/* 사이드바 - 관련 강의 */}
          {post.relatedCourse && (
            <aside className="lg:w-80 flex-shrink-0">
              <div
                className={`sticky top-24 rounded-xl overflow-hidden border ${
                  isDark ? 'glass border-white/10' : 'bg-white border-gray-200 shadow-sm'
                }`}
              >
                {/* 강의 썸네일 */}
                <Link to={`/tu/main/courses/${post.relatedCourse.id}`}>
                  <img
                    src={post.relatedCourse.thumbnailUrl || 'https://via.placeholder.com/320x180'}
                    alt={post.relatedCourse.title}
                    className="w-full aspect-video object-cover"
                  />
                </Link>

                <div className="p-4">
                  {/* 강의 제목 */}
                  <Link to={`/tu/main/courses/${post.relatedCourse.id}`}>
                    <h3
                      className={`font-semibold mb-2 line-clamp-2 hover:text-[#6778ff] transition-colors ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {post.relatedCourse.title}
                    </h3>
                  </Link>

                  {/* 강사 정보 */}
                  <Link
                    to={`/tu/main/instructors/${post.relatedCourse.instructor.id}`}
                    className="flex items-center gap-2 mb-3"
                  >
                    <img
                      src={post.relatedCourse.instructor.profileImage || 'https://via.placeholder.com/24'}
                      alt={post.relatedCourse.instructor.name}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {post.relatedCourse.instructor.name}
                    </span>
                  </Link>

                  {/* 통계 */}
                  <div className={`flex items-center gap-3 text-sm mb-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      {post.relatedCourse.rating}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {post.relatedCourse.studentCount.toLocaleString()}명
                    </span>
                  </div>

                  {/* 강의 보기 버튼 */}
                  <Link to={`/tu/main/courses/${post.relatedCourse.id}`}>
                    <Button className="w-full gap-2">
                      강의 상세보기
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </aside>
          )}
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
