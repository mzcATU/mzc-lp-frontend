/**
 * B2BCommentSection
 * B2B 플레이어 전용 댓글 섹션
 * - 탭 구조: 댓글 / 질문
 * - 댓글 = type='review' 게시글 (API에서는 review 타입 사용)
 * - 질문 = type='question' 게시글
 * - 대댓글 = 게시글의 댓글 (comments)
 * - 강사 배지: 강사 ID와 작성자 ID 비교
 */
import { useState, useCallback, useRef } from 'react';
import { ThumbsUp, MessageCircle, Send, Loader2, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback, Skeleton, Badge } from '@/components/common';
import { useAuthStore } from '@/store/common/authStore';
import {
  useCourseCommunityPosts,
  useLikeCourseCommunityPost,
  useUnlikeCourseCommunityPost,
  useCreateCourseCommunityPost,
  useDeleteCourseCommunityPost,
  useCourseCommunityComments,
  useCreateCourseCommunityComment,
  useDeleteCourseCommunityComment,
} from '@/hooks/tu/useCourseCommunityQueries';
import type { CourseCommunityPost, CourseCommunityFilter, PostType } from '@/types/tu/courseCommunity.types';

type TabType = 'review' | 'question';

interface B2BCommentSectionProps {
  timeId: number;
  isDark: boolean;
  currentItemName?: string;
  /** 강사 ID 목록 (배지 표시용) */
  instructorIds?: number[];
  /** 토글 상태 변경 콜백 */
  onExpandChange?: (isExpanded: boolean) => void;
}

/** 시간 포맷 유틸 */
const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return '방금 전';
  if (minutes < 60) return `${minutes}분 전`;
  if (hours < 24) return `${hours}시간 전`;
  if (days < 7) return `${days}일 전`;
  return date.toLocaleDateString('ko-KR');
};

/** 대댓글 컴포넌트 */
function ReplySection({
  timeId,
  postId,
  isDark,
  instructorIds = [],
  currentUserId,
}: {
  timeId: number;
  postId: number;
  isDark: boolean;
  instructorIds?: number[];
  currentUserId?: number;
}) {
  const [replyContent, setReplyContent] = useState('');
  const isSubmittingRef = useRef(false);
  const { data, isLoading } = useCourseCommunityComments(timeId, postId);
  const createCommentMutation = useCreateCourseCommunityComment();
  const deleteCommentMutation = useDeleteCourseCommunityComment();

  const handleCreateReply = async () => {
    if (!replyContent.trim()) return;
    if (createCommentMutation.isPending) return;
    if (isSubmittingRef.current) return;

    isSubmittingRef.current = true;
    try {
      await createCommentMutation.mutateAsync({
        timeId,
        postId,
        data: { content: replyContent },
      });
      setReplyContent('');
    } catch (error) {
      console.error('Failed to create reply:', error);
    } finally {
      isSubmittingRef.current = false;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && replyContent.trim()) {
      e.preventDefault();
      handleCreateReply();
    }
  };

  const handleDeleteReply = async (commentId: number) => {
    if (deleteCommentMutation.isPending) return;
    if (!globalThis.confirm('답글을 삭제하시겠습니까?')) return;

    try {
      await deleteCommentMutation.mutateAsync({ timeId, postId, commentId });
    } catch (error) {
      console.error('Failed to delete reply:', error);
    }
  };

  const isInstructor = (authorId: number) => instructorIds.includes(authorId);
  const isMyComment = (authorId: number) => currentUserId === authorId;

  return (
    <div className={`mt-3 pt-3 border-t ${isDark ? 'border-white/10' : 'border-gray-100'}`}>
      {/* 대댓글 입력 */}
      <div className="flex items-center gap-2 mb-3">
        <input
          type="text"
          value={replyContent}
          onChange={(e) => setReplyContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="답글을 입력하세요..."
          className={`flex-1 px-3 py-1.5 rounded-full text-xs outline-none border ${
            isDark
              ? 'bg-[#1e1e1e] border-white/10 text-white placeholder:text-gray-500'
              : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400'
          }`}
        />
        <button
          onClick={handleCreateReply}
          disabled={!replyContent.trim() || createCommentMutation.isPending}
          className={`flex items-center justify-center w-7 h-7 rounded-full transition-colors ${
            replyContent.trim() && !createCommentMutation.isPending
              ? 'bg-btn-brand text-white hover:bg-btn-brand/90'
              : isDark
                ? 'bg-white/10 text-gray-500'
                : 'bg-gray-100 text-gray-400'
          }`}
        >
          {createCommentMutation.isPending ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <Send className="w-3 h-3" />
          )}
        </button>
      </div>

      {/* 대댓글 목록 - 최신순 정렬 (역순) */}
      {isLoading ? (
        <div className="space-y-2">
          {[1, 2].map((i) => (
            <div key={i} className="flex gap-2">
              <Skeleton className="w-6 h-6 rounded-full shrink-0" />
              <div className="flex-1">
                <Skeleton className="h-3 w-16 mb-1" />
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : data?.comments && data.comments.length > 0 ? (
        <div className="space-y-2">
          {[...data.comments].reverse().map((comment) => (
            <div key={comment.id} className="flex gap-2 group">
              <Avatar className="w-6 h-6 shrink-0">
                <AvatarFallback className={`text-[10px] ${isDark ? 'bg-white/10 text-white' : ''}`}>
                  {comment.author.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className={`text-xs font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {comment.author.name}
                  </span>
                  {isInstructor(comment.author.id) && (
                    <Badge variant="secondary" className="text-[9px] px-1 py-0 h-4 bg-purple-500/20 text-purple-400 border-0">
                      강사
                    </Badge>
                  )}
                  <span className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    {formatTime(comment.createdAt)}
                  </span>
                  {isMyComment(comment.author.id) && (
                    <button
                      onClick={() => handleDeleteReply(comment.id)}
                      disabled={deleteCommentMutation.isPending}
                      className={`ml-auto opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded ${
                        isDark ? 'hover:bg-white/10 text-gray-500' : 'hover:bg-gray-100 text-gray-400'
                      }`}
                      title="삭제"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {comment.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className={`text-xs text-center py-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          답글이 없습니다
        </p>
      )}
    </div>
  );
}

/** 댓글 아이템 컴포넌트 */
function CommentItem({
  post,
  timeId,
  isDark,
  onLikeToggle,
  onDelete,
  instructorIds = [],
  currentUserId,
}: {
  post: CourseCommunityPost;
  timeId: number;
  isDark: boolean;
  onLikeToggle: (postId: number, isLiked: boolean) => void;
  onDelete: (postId: number) => void;
  instructorIds?: number[];
  currentUserId?: number;
}) {
  const [showReplies, setShowReplies] = useState(false);
  const isInstructor = instructorIds.includes(post.author.id);
  const isMyPost = currentUserId === post.author.id;

  return (
    <div
      className={`p-4 rounded-xl transition-colors group ${
        isDark
          ? 'bg-[#252525] hover:bg-[#2a2a2a]'
          : 'bg-white hover:bg-gray-50'
      }`}
    >
      <div className="flex gap-3">
        {/* 아바타 */}
        <Avatar className="w-9 h-9 shrink-0">
          <AvatarFallback className={`text-xs ${isDark ? 'bg-white/10 text-white' : ''}`}>
            {post.author.name.charAt(0)}
          </AvatarFallback>
        </Avatar>

        {/* 내용 */}
        <div className="flex-1 min-w-0">
          {/* 작성자 + 배지 + 시간 */}
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {post.author.name}
            </span>
            {isInstructor && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5 bg-purple-500/20 text-purple-400 border-0">
                강사
              </Badge>
            )}
            <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              {formatTime(post.createdAt)}
            </span>
            {isMyPost && (
              <button
                onClick={() => onDelete(post.id)}
                className={`ml-auto opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded ${
                  isDark ? 'hover:bg-white/10 text-gray-500' : 'hover:bg-gray-100 text-gray-400'
                }`}
                title="삭제"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* 댓글 내용 */}
          <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            {post.content}
          </p>

          {/* 액션 */}
          <div className="flex items-center gap-4 mt-2">
            <button
              onClick={() => onLikeToggle(post.id, post.isLiked || false)}
              className={`flex items-center gap-1 text-xs transition-colors ${
                post.isLiked
                  ? 'text-blue-500'
                  : isDark
                    ? 'text-gray-500 hover:text-gray-300'
                    : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>{post.likeCount}</span>
            </button>
            <button
              onClick={() => setShowReplies(!showReplies)}
              className={`flex items-center gap-1 text-xs transition-colors ${
                showReplies
                  ? 'text-blue-500'
                  : isDark
                    ? 'text-gray-500 hover:text-gray-300'
                    : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>{post.commentCount}</span>
              {showReplies ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
            </button>
          </div>

          {/* 대댓글 섹션 */}
          {showReplies && (
            <ReplySection
              timeId={timeId}
              postId={post.id}
              isDark={isDark}
              instructorIds={instructorIds}
              currentUserId={currentUserId}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/** 탭별 댓글 목록 */
function TabContent({
  timeId,
  isDark,
  currentItemName,
  postType,
  instructorIds = [],
  sortBy,
  inputRef,
}: {
  timeId: number;
  isDark: boolean;
  currentItemName?: string;
  postType: PostType;
  instructorIds?: number[];
  sortBy: 'latest' | 'popular';
  inputRef?: React.RefObject<HTMLDivElement | null>;
}) {
  const [newContent, setNewContent] = useState('');
  const currentUserId = useAuthStore((state) => state.user?.id);

  const filter: CourseCommunityFilter = {
    type: postType,
    sortBy,
    page: 0,
    pageSize: 20,
  };

  const { data, isLoading, isError } = useCourseCommunityPosts(timeId, filter, !!timeId);
  const likeMutation = useLikeCourseCommunityPost();
  const unlikeMutation = useUnlikeCourseCommunityPost();
  const createPostMutation = useCreateCourseCommunityPost();
  const deletePostMutation = useDeleteCourseCommunityPost();

  const handleLikeToggle = useCallback((postId: number, isLiked: boolean) => {
    if (isLiked) {
      unlikeMutation.mutate({ timeId, postId });
    } else {
      likeMutation.mutate({ timeId, postId });
    }
  }, [timeId, likeMutation, unlikeMutation]);

  const handleDeletePost = useCallback(async (postId: number) => {
    if (deletePostMutation.isPending) return;
    if (!globalThis.confirm('삭제하시겠습니까?')) return;

    try {
      await deletePostMutation.mutateAsync({ timeId, postId });
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  }, [timeId, deletePostMutation]);

  const handleCreatePost = useCallback(async () => {
    if (!newContent.trim()) return;
    if (createPostMutation.isPending) return;

    const title = postType === 'review'
      ? (currentItemName ? `[${currentItemName}] 댓글` : '댓글')
      : (currentItemName ? `[${currentItemName}] 질문` : '질문');

    try {
      await createPostMutation.mutateAsync({
        timeId,
        data: {
          type: postType,
          title,
          content: newContent,
          category: 'general',
        },
      });
      setNewContent('');
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  }, [timeId, newContent, currentItemName, postType, createPostMutation]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && newContent.trim()) {
      e.preventDefault();
      handleCreatePost();
    }
  };

  const posts = data?.posts ?? [];
  const postCount = posts.length;
  const placeholder = postType === 'review' ? '댓글을 입력하세요...' : '질문을 입력하세요...';
  const emptyMessage = postType === 'review' ? '아직 댓글이 없습니다' : '아직 질문이 없습니다';
  const EmptyIcon = MessageCircle;

  return (
    <>
      {/* 입력창 */}
      <div
        ref={inputRef}
        className={`flex items-center gap-3 mb-6 p-3 rounded-full border ${
          isDark ? 'bg-[#252525] border-white/10' : 'bg-white border-gray-200'
        }`}
      >
        <input
          type="text"
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`flex-1 bg-transparent text-sm outline-none ${
            isDark
              ? 'text-white placeholder:text-gray-500'
              : 'text-gray-900 placeholder:text-gray-400'
          }`}
        />
        <button
          onClick={handleCreatePost}
          disabled={!newContent.trim() || createPostMutation.isPending}
          className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
            newContent.trim() && !createPostMutation.isPending
              ? 'bg-btn-brand text-white hover:bg-btn-brand/90'
              : isDark
                ? 'bg-white/10 text-gray-500'
                : 'bg-gray-100 text-gray-400'
          }`}
        >
          {createPostMutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* 댓글 목록 - 최신순 정렬 (역순) */}
      <div className="flex flex-col gap-3 pb-8">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className={`p-4 rounded-xl ${isDark ? 'bg-[#252525]' : 'bg-white'}`}
            >
              <div className="flex gap-3">
                <Skeleton className="w-9 h-9 rounded-full shrink-0" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            </div>
          ))
        ) : isError ? (
          <div className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            데이터를 불러오는데 실패했습니다.
          </div>
        ) : postCount > 0 ? (
          [...posts].reverse().map((post) => (
            <CommentItem
              key={post.id}
              post={post}
              timeId={timeId}
              isDark={isDark}
              onLikeToggle={handleLikeToggle}
              onDelete={handleDeletePost}
              instructorIds={instructorIds}
              currentUserId={currentUserId}
            />
          ))
        ) : (
          <div className={`text-center py-10 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            <EmptyIcon className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p className="text-sm">{emptyMessage}</p>
          </div>
        )}
      </div>
    </>
  );
}

export function B2BCommentSection({
  timeId,
  isDark,
  currentItemName,
  instructorIds = [],
  onExpandChange,
}: B2BCommentSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('review');
  const [sortBy, setSortBy] = useState<'latest' | 'popular'>('latest');
  const sectionRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);

  // 입력창 위치로 스크롤 (댓글 한 개 정도 보이게)
  const scrollToInput = () => {
    // 탭 변경 시 컴포넌트 리마운트로 인해 ref가 업데이트되는 시간 필요
    setTimeout(() => {
      inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  };

  const handleToggle = () => {
    const newExpanded = !isExpanded;
    setIsExpanded(newExpanded);
    onExpandChange?.(newExpanded);

    if (newExpanded) {
      scrollToInput();
    }
  };

  const tabs: { value: TabType; label: string }[] = [
    { value: 'review', label: '댓글' },
    { value: 'question', label: '질문' },
  ];

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    scrollToInput();
  };

  return (
    <div ref={sectionRef} className={`${isDark ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
      {/* 토글 헤더 */}
      <button
        onClick={handleToggle}
        className={`w-full flex items-center justify-between px-6 py-4 transition-colors ${
          isDark
            ? 'hover:bg-white/5'
            : 'hover:bg-gray-100'
        }`}
      >
        <div className="flex items-center gap-2">
          <MessageCircle className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
          <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
            댓글
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
        ) : (
          <ChevronDown className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
        )}
      </button>

      {/* 확장된 콘텐츠 */}
      {isExpanded && (
        <div className={`px-6 pb-6 ${isDark ? 'border-t border-white/10' : 'border-t border-gray-200'}`}>
          {/* 탭 헤더 + 정렬 */}
          <div className="flex items-center justify-between pt-4 mb-4">
            <div className="flex items-center gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => handleTabChange(tab.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeTab === tab.value
                      ? 'bg-btn-brand text-white'
                      : isDark
                        ? 'bg-transparent text-gray-400 hover:bg-white/5 hover:text-white'
                        : 'bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'latest' | 'popular')}
              className={`px-2 py-1.5 rounded border text-sm outline-none ${
                isDark
                  ? 'bg-[#252525] border-white/10 text-white'
                  : 'bg-white border-gray-200 text-gray-900'
              }`}
            >
              <option value="latest">최신순</option>
              <option value="popular">인기순</option>
            </select>
          </div>

          {/* 탭 콘텐츠 */}
          <TabContent
            key={activeTab}
            timeId={timeId}
            isDark={isDark}
            currentItemName={currentItemName}
            postType={activeTab}
            instructorIds={instructorIds}
            sortBy={sortBy}
            inputRef={inputRef}
          />
        </div>
      )}
    </div>
  );
}
