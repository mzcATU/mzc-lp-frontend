/**
 * useQuestionSection
 * 질문/커뮤니티 섹션 공통 로직 훅
 * - B2B, B2C 모두에서 사용 가능
 * - B2B에서는 댓글(게시글) + 대댓글(게시글의 댓글) 구조
 */
import { useState, useCallback } from 'react';
import {
  useCourseCommunityPosts,
  useLikeCourseCommunityPost,
  useUnlikeCourseCommunityPost,
  useCreateCourseCommunityPost,
} from './useCourseCommunityQueries';
import type { PostType, CourseCommunityFilter } from '@/types/tu/courseCommunity.types';

export type TabType = 'all' | PostType;
export type SortType = 'latest' | 'popular';

interface UseQuestionSectionOptions {
  timeId: number;
  /** 질문만 필터링 (B2B용) */
  questionsOnly?: boolean;
  /** 현재 아이템 이름 (질문 제목에 사용) */
  currentItemName?: string;
}

export function useQuestionSection({
  timeId,
  questionsOnly = false,
  currentItemName,
}: UseQuestionSectionOptions) {
  // 상태
  const [activeTab, setActiveTab] = useState<TabType>(questionsOnly ? 'question' : 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortType>('latest');
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
    // 중복 요청 방지
    if (createPostMutation.isPending) return;

    try {
      await createPostMutation.mutateAsync({
        timeId,
        data: {
          type: 'question',
          title: currentItemName ? `[${currentItemName}] 댓글` : '댓글',
          content: newPostContent,
          category: 'general',
        },
      });
      setNewPostContent('');
      return true;
    } catch (error) {
      console.error('Failed to create post:', error);
      return false;
    }
  }, [timeId, newPostContent, currentItemName, createPostMutation]);

  // 시간 포맷
  const formatTime = useCallback((dateString: string) => {
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
  }, []);

  return {
    // 상태
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    newPostContent,
    setNewPostContent,

    // 데이터
    posts: data?.posts ?? [],
    postCount: data?.posts?.length ?? 0,
    isLoading,
    isError,

    // 뮤테이션 상태
    isCreating: createPostMutation.isPending,
    isLiking: likeMutation.isPending || unlikeMutation.isPending,

    // 액션
    handleLikeToggle,
    handleCreatePost,
    formatTime,
  };
}
