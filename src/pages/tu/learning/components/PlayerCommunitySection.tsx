/**
 * PlayerCommunitySection (B2C 전용)
 * 플레이어 페이지 내 커뮤니티 섹션
 * - 게시글 목록 (질문, 팁, 후기, 토론)
 * - 검색, 필터, 정렬
 * - 좋아요 기능
 *
 * Note: B2B는 B2BQuestionSection 사용
 */
import { useState, useCallback } from 'react';
import { Search, ThumbsUp, MessageCircle, Send, Loader2 } from 'lucide-react';
import { Button, Input, Avatar, AvatarFallback, Skeleton } from '@/components/common';
import {
  useCourseCommunityPosts,
  useLikeCourseCommunityPost,
  useUnlikeCourseCommunityPost,
  useCreateCourseCommunityPost,
} from '@/hooks/tu';
import type { PostType, CourseCommunityFilter } from '@/types/tu/courseCommunity.types';

interface PlayerCommunitySectionProps {
  timeId: number;
  isDark: boolean;
  currentItemName?: string;
}

type TabType = 'all' | PostType;

const TABS: { value: TabType; labelKey: string }[] = [
  { value: 'all', labelKey: 'all' },
  { value: 'question', labelKey: 'question' },
  { value: 'tip', labelKey: 'tip' },
  { value: 'review', labelKey: 'review' },
  { value: 'discussion', labelKey: 'discussion' },
];

const TAB_LABELS: Record<TabType, string> = {
  all: '전체',
  question: '질문',
  tip: '팁',
  review: '후기',
  discussion: '토론',
  announcement: '공지',
};

export function PlayerCommunitySection({
  timeId,
  isDark,
  currentItemName,
}: PlayerCommunitySectionProps) {
  // 상태
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'latest' | 'popular'>('latest');
  const [isWriting, setIsWriting] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');

  // 필터 구성
  const filter: CourseCommunityFilter = {
    search: searchQuery || undefined,
    type: activeTab,
    sortBy,
    page: 0,
    pageSize: 20,
  };

  // API 훅
  const { data, isLoading, isError } = useCourseCommunityPosts(timeId, filter, !!timeId);
  const likeMutation = useLikeCourseCommunityPost();
  const unlikeMutation = useUnlikeCourseCommunityPost();
  const createPostMutation = useCreateCourseCommunityPost();

  // 좋아요 토글
  const handleLikeToggle = useCallback((postId: number, isLiked: boolean) => {
    if (isLiked) {
      unlikeMutation.mutate({ timeId, postId });
    } else {
      likeMutation.mutate({ timeId, postId });
    }
  }, [timeId, likeMutation, unlikeMutation]);

  // 게시글 작성
  const handleCreatePost = useCallback(async () => {
    if (!newPostContent.trim()) return;

    try {
      await createPostMutation.mutateAsync({
        timeId,
        data: {
          type: 'question',
          title: currentItemName ? `[${currentItemName}] 질문` : '질문',
          content: newPostContent,
          category: 'general',
        },
      });
      setNewPostContent('');
      setIsWriting(false);
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  }, [timeId, newPostContent, currentItemName, createPostMutation]);

  // 검색 핸들러
  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
  }, []);

  // 시간 포맷
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

  return (
    <div className={`min-h-[400px] p-6 ${isDark ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
      {/* 섹션 헤더 */}
      {currentItemName && (
        <div className="mb-5">
          <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {currentItemName}
          </h2>
        </div>
      )}

      {/* 검색 및 작성 버튼 */}
      <div className="flex gap-3 mb-5">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <Search
            className={`absolute left-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}
          />
          <Input
            type="text"
            placeholder="검색어를 입력하세요"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`pl-10 ${
              isDark
                ? 'bg-[#252525] border-white/10 text-white placeholder:text-gray-500'
                : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-400'
            }`}
          />
        </form>
        <Button
          onClick={() => setIsWriting(!isWriting)}
          className="landing-btn-primary text-white shrink-0"
        >
          질문 작성
        </Button>
      </div>

      {/* 작성 폼 */}
      {isWriting && (
        <div className={`mb-5 p-4 rounded-lg border ${
          isDark ? 'bg-[#252525] border-white/10' : 'bg-white border-gray-200'
        }`}>
          <textarea
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            placeholder="질문 내용을 입력하세요..."
            rows={3}
            className={`w-full p-3 rounded-lg border resize-none ${
              isDark
                ? 'bg-[#1e1e1e] border-white/10 text-white placeholder:text-gray-500'
                : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400'
            }`}
          />
          <div className="flex justify-end gap-2 mt-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsWriting(false);
                setNewPostContent('');
              }}
              className={isDark ? 'text-gray-400 hover:text-white' : ''}
            >
              취소
            </Button>
            <Button
              size="sm"
              onClick={handleCreatePost}
              disabled={!newPostContent.trim() || createPostMutation.isPending}
              className="landing-btn-primary text-white"
            >
              {createPostMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4 mr-1" />
                  등록
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* 탭 및 정렬 */}
      <div className="flex justify-between items-center mb-5">
        <div className="flex gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === tab.value
                  ? 'landing-btn-primary text-white'
                  : isDark
                    ? 'bg-transparent text-gray-400 hover:bg-white/5 hover:text-white'
                    : 'bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              {TAB_LABELS[tab.value]}
            </button>
          ))}
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'latest' | 'popular')}
          className={`w-28 px-3 py-2 rounded-lg border text-sm outline-none ${
            isDark
              ? 'bg-[#252525] border-white/10 text-white'
              : 'bg-white border-gray-200 text-gray-900'
          }`}
        >
          <option value="latest">최신순</option>
          <option value="popular">인기순</option>
        </select>
      </div>

      {/* 게시글 목록 */}
      <div className="flex flex-col gap-4">
        {isLoading ? (
          // 로딩 스켈레톤
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className={`p-4 rounded-lg border ${
                isDark ? 'bg-[#252525] border-white/10' : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-24 mb-1" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))
        ) : isError ? (
          <div className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            게시글을 불러오는데 실패했습니다.
          </div>
        ) : data?.posts && data.posts.length > 0 ? (
          data.posts.map((post) => (
            <div
              key={post.id}
              className={`p-4 rounded-lg border transition-colors ${
                isDark
                  ? 'bg-[#252525] border-white/10 hover:border-white/20'
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* 게시글 헤더 */}
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className={isDark ? 'bg-white/10 text-white' : ''}>
                    {post.author.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium truncate ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      {post.author.name}
                    </span>
                    {post.type !== 'question' && post.type in TAB_LABELS && (
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        isDark
                          ? 'bg-btn-brand/20 text-purple-300'
                          : 'bg-btn-brand/10 text-btn-brand'
                      }`}>
                        {TAB_LABELS[post.type as TabType]}
                      </span>
                    )}
                  </div>
                  <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    {formatTime(post.createdAt)}
                  </div>
                </div>
              </div>

              {/* 게시글 제목 */}
              <h3 className={`text-sm font-medium mb-2 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {post.title}
              </h3>

              {/* 게시글 내용 */}
              <p className={`text-sm leading-relaxed mb-3 line-clamp-2 ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {post.excerpt || post.content}
              </p>

              {/* 게시글 액션 */}
              <div className="flex gap-4">
                <button
                  onClick={() => handleLikeToggle(post.id, post.isLiked || false)}
                  disabled={likeMutation.isPending || unlikeMutation.isPending}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded text-sm transition-colors ${
                    post.isLiked
                      ? 'text-blue-500'
                      : isDark
                        ? 'text-gray-400 hover:text-white'
                        : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>{post.likeCount}</span>
                </button>
                <button
                  className={`flex items-center gap-1.5 px-2 py-1 rounded text-sm transition-colors ${
                    isDark
                      ? 'text-gray-400 hover:text-white'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{post.commentCount}</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>아직 게시글이 없습니다.</p>
            <p className="text-sm mt-1">첫 번째 질문을 남겨보세요!</p>
          </div>
        )}
      </div>
    </div>
  );
}
