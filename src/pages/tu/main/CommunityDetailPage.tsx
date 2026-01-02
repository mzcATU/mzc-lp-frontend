/**
 * CommunityDetailPage
 * 커뮤니티 게시글 상세 페이지 (인프런 스타일)
 */
import { useState, useEffect, useRef } from 'react';
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
  User,
  ImagePlus,
} from 'lucide-react';
import { toast } from 'sonner';
import { useThemeStore } from '@/store/common/themeStore';
import { LandingHeader, LandingFooter } from '@/components/landing';
import { Button } from '@/components/common';
import {
  useCommunityPost,
  useComments,
  useLikePost,
  useUnlikePost,
  useCreateComment,
  useDeleteComment,
  useLikeComment,
  useUnlikeComment,
  useUpdatePost,
  useDeletePost,
} from '@/hooks/tu/useCommunityQueries';
import { useAuthStore } from '@/store/common/authStore';
import { communityService } from '@/services/tu/communityService';
import type { CommunityPostDetail, Comment } from '@/types/tu/community.types';
import { POST_TYPE_LABELS } from '@/types/tu/community.types';

// API 사용 여부 플래그
const USE_API = true;

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

// 이미지 URL 처리 (상대 경로를 절대 URL로 변환)
const getImageUrl = (url: string | null | undefined): string | null => {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  // /uploads/로 시작하는 상대 경로는 API 서버 URL을 붙임
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:8080';
  return `${apiBaseUrl}${url}`;
};

// 본문 내 이미지 URL을 절대 URL로 변환
const getAbsoluteImageUrl = (url: string): string => {
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:8080';
  return `${apiBaseUrl}${url}`;
};

// 본문 렌더러 컴포넌트 (마크다운 이미지를 실제 이미지로 변환)
interface ContentRendererProps {
  content: string;
  isDark: boolean;
}

function ContentRenderer({ content, isDark }: ContentRendererProps) {
  // 마크다운 이미지 패턴: ![alt](url)
  const imagePattern = /!\[([^\]]*)\]\(([^)]+)\)/g;

  // 콘텐츠를 파싱하여 텍스트와 이미지로 분리
  const parts: Array<{ type: 'text' | 'image'; content: string; alt?: string }> = [];
  let lastIndex = 0;
  let match;

  while ((match = imagePattern.exec(content)) !== null) {
    // 이미지 앞의 텍스트
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: content.slice(lastIndex, match.index) });
    }
    // 이미지
    parts.push({ type: 'image', content: match[2], alt: match[1] });
    lastIndex = match.index + match[0].length;
  }

  // 마지막 텍스트
  if (lastIndex < content.length) {
    parts.push({ type: 'text', content: content.slice(lastIndex) });
  }

  // 파츠가 없으면 전체 텍스트로 처리
  if (parts.length === 0) {
    parts.push({ type: 'text', content });
  }

  return (
    <>
      {parts.map((part, index) => {
        if (part.type === 'image') {
          return (
            <img
              key={index}
              src={getAbsoluteImageUrl(part.content)}
              alt={part.alt || '이미지'}
              className="max-w-full h-auto rounded-lg my-4"
              loading="lazy"
            />
          );
        }
        return (
          <div
            key={index}
            className={`whitespace-pre-wrap leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
          >
            {part.content}
          </div>
        );
      })}
    </>
  );
}

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
        {getImageUrl(comment.author.avatar) ? (
          <img
            src={getImageUrl(comment.author.avatar)!}
            alt={comment.author.name}
            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
          />
        ) : (
          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
            isDark ? 'bg-white/10' : 'bg-gray-200'
          }`}>
            <User className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
          </div>
        )}

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
  const { user } = useAuthStore();

  // 상태
  const [commentText, setCommentText] = useState('');
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [localLiked, setLocalLiked] = useState(false);
  const [localLikeCount, setLocalLikeCount] = useState(0);
  const [comments, setComments] = useState<Comment[]>(MOCK_COMMENTS);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  // React Query 훅 (API 모드일 때만 활성화)
  const { data: apiPost, isLoading, error } = useCommunityPost(postId, USE_API);
  const { data: apiComments } = useComments(postId, 0, 50, USE_API);
  const likePostMutation = useLikePost();
  const unlikePostMutation = useUnlikePost();
  const createCommentMutation = useCreateComment();
  const deleteCommentMutation = useDeleteComment();
  const likeCommentMutation = useLikeComment();
  const unlikeCommentMutation = useUnlikeComment();
  const updatePostMutation = useUpdatePost();
  const deletePostMutation = useDeletePost();

  // 실제 사용할 데이터
  const post: CommunityPostDetail = USE_API ? (apiPost || MOCK_POST_DETAIL) : MOCK_POST_DETAIL;

  // API 댓글 데이터를 로컬 상태로 동기화
  useEffect(() => {
    if (USE_API && apiComments?.comments) {
      setComments(apiComments.comments);
    }
  }, [apiComments]);

  // 초기 좋아요 상태 설정
  useEffect(() => {
    setLocalLiked(post.isLiked || false);
    setLocalLikeCount(post.likeCount);
  }, [post.isLiked, post.likeCount]);

  // 현재 사용자가 작성자인지 확인
  const isAuthor = user && post.author && user.id === post.author.id;

  // 수정 모드 시작
  const handleStartEdit = () => {
    setEditTitle(post.title);
    setEditContent(post.content);
    setIsEditing(true);
  };

  // 수정 취소
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditTitle('');
    setEditContent('');
  };

  // 수정 모드에서 이미지 업로드
  const handleEditImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 파일 크기 검증 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('이미지 크기는 5MB를 초과할 수 없습니다.');
      return;
    }

    // 이미지 타입 검증
    if (!file.type.startsWith('image/')) {
      toast.error('이미지 파일만 업로드 가능합니다.');
      return;
    }

    setIsUploadingImage(true);
    try {
      const url = await communityService.uploadImage(file);
      // 마크다운 이미지 형식으로 본문에 추가
      const imageMarkdown = `\n![이미지](${url})\n`;
      setEditContent(prev => prev + imageMarkdown);
      toast.success('이미지가 업로드되었습니다.');
    } catch (err) {
      console.error('이미지 업로드 실패:', err);
      toast.error('이미지 업로드에 실패했습니다.');
    } finally {
      setIsUploadingImage(false);
      // input 초기화
      if (editFileInputRef.current) {
        editFileInputRef.current.value = '';
      }
    }
  };

  // 게시글 수정 제출
  const handleUpdatePost = async () => {
    if (!editTitle.trim() || !editContent.trim()) {
      toast.error('제목과 내용을 모두 입력해주세요.');
      return;
    }

    try {
      await updatePostMutation.mutateAsync({
        postId,
        data: {
          title: editTitle.trim(),
          content: editContent.trim(),
        },
      });
      toast.success('게시글이 수정되었습니다.');
      setIsEditing(false);
    } catch (err) {
      console.error('게시글 수정 실패:', err);
      toast.error('게시글 수정에 실패했습니다.');
    }
  };

  // 게시글 삭제
  const handleDeletePost = async () => {
    try {
      await deletePostMutation.mutateAsync(postId);
      toast.success('게시글이 삭제되었습니다.');
      navigate('/tu/main/community');
    } catch (err) {
      console.error('게시글 삭제 실패:', err);
      toast.error('게시글 삭제에 실패했습니다.');
    }
  };

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
              {getImageUrl(post.author.avatar) ? (
                <img
                  src={getImageUrl(post.author.avatar)!}
                  alt={post.author.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  isDark ? 'bg-white/10' : 'bg-gray-200'
                }`}>
                  <User className={`w-6 h-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                </div>
              )}
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
            {isEditing ? (
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className={`w-full text-2xl md:text-3xl font-bold mb-4 p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#6778ff] ${
                  isDark
                    ? 'bg-white/5 border-white/10 text-white'
                    : 'bg-white border-gray-200 text-gray-900'
                }`}
                placeholder="제목을 입력하세요"
              />
            ) : (
              <h1 className={`text-2xl md:text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {post.title}
              </h1>
            )}

            {/* 태그 */}
            {!isEditing && post.tags && post.tags.length > 0 && (
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
            {isEditing ? (
              <div className="mb-4">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={15}
                  className={`w-full p-4 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#6778ff] resize-none ${
                    isDark
                      ? 'bg-white/5 border-white/10 text-white placeholder-gray-500'
                      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
                  }`}
                  placeholder="내용을 입력하세요"
                />
                {/* 이미지 업로드 버튼 */}
                <div className="mt-2 flex items-center gap-2">
                  <input
                    ref={editFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleEditImageUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => editFileInputRef.current?.click()}
                    disabled={isUploadingImage}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                      isDark
                        ? 'bg-white/10 text-gray-300 hover:bg-white/20'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    } disabled:opacity-50`}
                  >
                    {isUploadingImage ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <ImagePlus className="w-4 h-4" />
                    )}
                    {isUploadingImage ? '업로드 중...' : '이미지 추가'}
                  </button>
                  <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    이미지는 본문 끝에 추가됩니다 (최대 5MB)
                  </span>
                </div>
              </div>
            ) : (
              <div
                className={`prose max-w-none mb-8 ${
                  isDark ? 'prose-invert' : ''
                } prose-headings:font-bold prose-h2:text-xl prose-p:leading-relaxed prose-img:rounded-lg prose-img:max-w-full`}
              >
                <ContentRenderer content={post.content} isDark={isDark} />
              </div>
            )}

            {/* 수정 모드 버튼 */}
            {isEditing && (
              <div className="flex gap-3 mb-8">
                <button
                  onClick={handleCancelEdit}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    isDark
                      ? 'bg-white/10 text-white hover:bg-white/20'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  취소
                </button>
                <button
                  onClick={handleUpdatePost}
                  disabled={updatePostMutation.isPending}
                  className="px-4 py-2 rounded-lg font-medium bg-gradient-to-r from-[#6778ff] to-[#a855f7] text-white hover:opacity-90 disabled:opacity-50"
                >
                  {updatePostMutation.isPending ? '수정 중...' : '수정 완료'}
                </button>
              </div>
            )}

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

              <div className="flex items-center gap-2">
                {/* 작성자만 보이는 수정/삭제 버튼 */}
                {isAuthor && !isEditing && (
                  <>
                    <button
                      onClick={handleStartEdit}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        isDark
                          ? 'bg-white/5 text-gray-400 hover:bg-white/10'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <MoreHorizontal className="w-5 h-5" />
                      <span>수정</span>
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        isDark
                          ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                          : 'bg-red-50 text-red-600 hover:bg-red-100'
                      }`}
                    >
                      <Trash2 className="w-5 h-5" />
                      <span>삭제</span>
                    </button>
                  </>
                )}
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
            </div>

            {/* 삭제 확인 모달 */}
            {showDeleteConfirm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div
                  className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                  onClick={() => setShowDeleteConfirm(false)}
                />
                <div
                  className={`relative w-full max-w-md p-6 rounded-2xl shadow-2xl ${
                    isDark ? 'bg-[#252525] border border-white/10' : 'bg-white'
                  }`}
                >
                  <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    게시글 삭제
                  </h3>
                  <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    정말로 이 게시글을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                        isDark
                          ? 'bg-white/10 text-white hover:bg-white/20'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      취소
                    </button>
                    <button
                      onClick={handleDeletePost}
                      disabled={deletePostMutation.isPending}
                      className="flex-1 px-4 py-2 rounded-lg font-medium bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
                    >
                      {deletePostMutation.isPending ? '삭제 중...' : '삭제'}
                    </button>
                  </div>
                </div>
              </div>
            )}

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
