/**
 * 코스 커뮤니티 섹션 컴포넌트
 * 강의 상세 페이지에 통합되는 커뮤니티 탭/섹션
 */

import { useState } from 'react';
import { Plus, Search, MessageSquare, Loader2 } from 'lucide-react';
import {
  useCourseCommunityPosts,
  useCreateCourseCommunityPost,
  useUpdateCourseCommunityPost,
  useDeleteCourseCommunityPost,
} from '@/hooks/tu/useCourseCommunityQueries';
import type {
  CourseCommunityFilter,
  PostType,
  CreateCourseCommunityPostRequest,
  CourseCommunityPost,
} from '@/types/tu/courseCommunity.types';
import { POST_TYPE_LABELS, COMMUNITY_SORT_OPTIONS } from '@/types/tu/courseCommunity.types';
import { CourseCommunityPostCard } from './CourseCommunityPostCard';
import { CourseCommunityWritePostModal } from './CourseCommunityWritePostModal';
import { CourseCommunityPostDetail } from './CourseCommunityPostDetail';

interface CourseCommunitySectionProps {
  timeId: number;
  isDark: boolean;
  canWrite?: boolean;
}

const POST_TYPE_FILTERS: { value: PostType | 'all'; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'question', label: POST_TYPE_LABELS.question },
  { value: 'tip', label: POST_TYPE_LABELS.tip },
  { value: 'review', label: POST_TYPE_LABELS.review },
  { value: 'discussion', label: POST_TYPE_LABELS.discussion },
];

export function CourseCommunitySection({
  timeId,
  isDark,
  canWrite = true,
}: CourseCommunitySectionProps) {
  const [filter, setFilter] = useState<CourseCommunityFilter>({
    type: 'all',
    sortBy: 'latest',
    page: 0,
    pageSize: 10,
  });
  const [searchInput, setSearchInput] = useState('');
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<CourseCommunityPost | null>(null);
  const [editPost, setEditPost] = useState<CourseCommunityPost | null>(null);

  const { data, isLoading, isFetching } = useCourseCommunityPosts(timeId, filter);
  const createPost = useCreateCourseCommunityPost();
  const updatePost = useUpdateCourseCommunityPost();
  const deletePost = useDeleteCourseCommunityPost();

  const handleSearch = () => {
    setFilter((prev) => ({
      ...prev,
      search: searchInput || undefined,
      page: 0,
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleTypeFilter = (type: PostType | 'all') => {
    setFilter((prev) => ({
      ...prev,
      type,
      page: 0,
    }));
  };

  const handleSortChange = (sortBy: CourseCommunityFilter['sortBy']) => {
    setFilter((prev) => ({
      ...prev,
      sortBy,
      page: 0,
    }));
  };

  const handleCreatePost = async (postData: CreateCourseCommunityPostRequest) => {
    await createPost.mutateAsync({ timeId, data: postData });
    setIsWriteModalOpen(false);
  };

  const handleUpdatePost = async (postData: CreateCourseCommunityPostRequest) => {
    if (!editPost) return;
    await updatePost.mutateAsync({
      timeId,
      postId: editPost.id,
      data: postData,
    });
    setEditPost(null);
    setIsWriteModalOpen(false);
  };

  const handleDeletePost = async (postId: number) => {
    if (!window.confirm('게시글을 삭제하시겠습니까?')) return;
    await deletePost.mutateAsync({ timeId, postId });
    setSelectedPost(null);
  };

  const handleEditClick = (post: CourseCommunityPost) => {
    setEditPost(post);
    setSelectedPost(null);
    setIsWriteModalOpen(true);
  };

  const handlePageChange = (page: number) => {
    setFilter((prev) => ({
      ...prev,
      page,
    }));
  };

  const posts = data?.posts || [];
  const totalPages = data?.totalPages || 0;
  const currentPage = filter.page || 0;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3
          className={`text-lg font-semibold flex items-center gap-2 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          강의 커뮤니티
        </h3>
        {canWrite && (
          <button
            onClick={() => {
              setEditPost(null);
              setIsWriteModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#6778ff] to-[#a855f7] text-white text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            글쓰기
          </button>
        )}
      </div>

      {/* Search & Filter */}
      <div className="space-y-3">
        {/* Search */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search
              className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                isDark ? 'text-gray-500' : 'text-gray-400'
              }`}
            />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="검색어를 입력하세요"
              className={`w-full rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6778ff] ${
                isDark
                  ? 'bg-white/5 border border-white/10 text-white placeholder-gray-500'
                  : 'bg-white border border-gray-200 text-gray-900 placeholder-gray-400'
              }`}
            />
          </div>
          <button
            onClick={handleSearch}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isDark
                ? 'bg-white/10 text-white hover:bg-white/20'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            검색
          </button>
        </div>

        {/* Type Filter & Sort */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex gap-1 flex-wrap">
            {POST_TYPE_FILTERS.map((type) => (
              <button
                key={type.value}
                onClick={() => handleTypeFilter(type.value)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  filter.type === type.value
                    ? 'bg-gradient-to-r from-[#6778ff] to-[#a855f7] text-white'
                    : isDark
                      ? 'bg-white/5 text-gray-400 hover:bg-white/10'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
          <select
            value={filter.sortBy}
            onChange={(e) =>
              handleSortChange(e.target.value as CourseCommunityFilter['sortBy'])
            }
            className={`rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#6778ff] ${
              isDark
                ? 'bg-white/5 border border-white/10 text-white'
                : 'bg-white border border-gray-200 text-gray-700'
            }`}
            style={isDark ? { colorScheme: 'dark' } : undefined}
          >
            {COMMUNITY_SORT_OPTIONS.map((option) => (
              <option
                key={option.value}
                value={option.value}
                className={isDark ? 'bg-[#2a2a2a]' : ''}
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Post List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[#6778ff]" />
          </div>
        ) : posts.length === 0 ? (
          <div
            className={`text-center py-12 rounded-xl ${
              isDark ? 'bg-white/5' : 'bg-gray-50'
            }`}
          >
            <MessageSquare
              className={`w-12 h-12 mx-auto mb-3 ${
                isDark ? 'text-gray-600' : 'text-gray-300'
              }`}
            />
            <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
              {filter.search
                ? '검색 결과가 없습니다.'
                : '아직 게시글이 없습니다.'}
            </p>
            {canWrite && !filter.search && (
              <button
                onClick={() => {
                  setEditPost(null);
                  setIsWriteModalOpen(true);
                }}
                className="mt-3 text-[#6778ff] text-sm font-medium hover:underline"
              >
                첫 번째 글을 작성해보세요!
              </button>
            )}
          </div>
        ) : (
          <>
            {posts.map((post) => (
              <CourseCommunityPostCard
                key={post.id}
                post={post}
                isDark={isDark}
                onClick={() => setSelectedPost(post)}
              />
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors disabled:opacity-50 ${
                    isDark
                      ? 'bg-white/10 text-white hover:bg-white/20'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  이전
                </button>
                <span
                  className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                >
                  {currentPage + 1} / {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages - 1}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors disabled:opacity-50 ${
                    isDark
                      ? 'bg-white/10 text-white hover:bg-white/20'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  다음
                </button>
              </div>
            )}
          </>
        )}

        {isFetching && !isLoading && (
          <div className="flex items-center justify-center py-2">
            <Loader2 className="w-5 h-5 animate-spin text-[#6778ff]" />
          </div>
        )}
      </div>

      {/* Write/Edit Modal */}
      <CourseCommunityWritePostModal
        isOpen={isWriteModalOpen}
        onClose={() => {
          setIsWriteModalOpen(false);
          setEditPost(null);
        }}
        onSubmit={editPost ? handleUpdatePost : handleCreatePost}
        isDark={isDark}
        isSubmitting={createPost.isPending || updatePost.isPending}
        editPost={editPost}
      />

      {/* Post Detail Modal */}
      {selectedPost && (
        <CourseCommunityPostDetail
          timeId={timeId}
          postId={selectedPost.id}
          isDark={isDark}
          onClose={() => setSelectedPost(null)}
          onEdit={() => handleEditClick(selectedPost)}
          onDelete={() => handleDeletePost(selectedPost.id)}
        />
      )}
    </div>
  );
}
