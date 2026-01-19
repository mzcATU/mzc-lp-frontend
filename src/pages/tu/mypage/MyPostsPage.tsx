/**
 * MyPostsPage
 * 내 게시글 목록 페이지
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Heart,
  MessageSquare,
  Eye,
  Clock,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ArrowRight,
} from 'lucide-react';
import { useThemeStore } from '@/store/common/themeStore';
import { useMyPosts } from '@/hooks/tu/useCommunityQueries';
import { Badge, Button } from '@/components/common';
import { POST_TYPE_LABELS } from '@/types/tu/community.types';

const PAGE_SIZE = 10;

export function MyPostsPage() {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const [page, setPage] = useState(0);

  const { data, isLoading } = useMyPosts(page, PAGE_SIZE);

  const posts = data?.posts || [];
  const totalPages = data?.totalPages || 0;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMins = Math.floor(diffMs / (1000 * 60));
        return diffMins <= 0 ? '방금 전' : `${diffMins}분 전`;
      }
      return `${diffHours}시간 전`;
    }
    if (diffDays < 7) return `${diffDays}일 전`;

    return date.toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric',
    });
  };

  const stripMarkdownImages = (content: string): string => {
    return content.replace(/!\[[^\]]*\]\([^)]+\)/g, '').replace(/\n/g, ' ').trim();
  };

  return (
    <div className={`min-h-full p-6 sm:p-8 ${isDark ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            내 게시글
          </h1>
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            내가 작성한 커뮤니티 게시글을 관리하세요
          </p>
        </div>

      {/* 게시글 목록 */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2
            className={`w-8 h-8 animate-spin ${isDark ? 'text-[#6778ff]' : 'text-blue-600'}`}
          />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20">
          <FileText className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
          <h3 className={`text-lg font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            아직 작성한 게시글이 없어요
          </h3>
          <p className={`mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            커뮤니티에서 다른 개발자들과 지식을 나누고 소통해보세요
          </p>
        </div>
      ) : (
        <div
          className={`rounded-2xl overflow-hidden ${
            isDark ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-200'
          }`}
        >
          <div className={`divide-y ${isDark ? 'divide-white/5' : 'divide-gray-100'}`}>
            {posts.map((post) => (
              <Link
                key={post.id}
                to={`/tu/b2c/community/${post.id}`}
                className={`block p-5 transition-all group ${
                  isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    {/* 타입 & 카테고리 */}
                    <div className="flex items-center gap-2 mb-2">
                      <Badge
                        variant="blue"
                        className={`text-xs ${isDark ? 'bg-[#6778ff]/20 text-[#8b9aff]' : ''}`}
                      >
                        {POST_TYPE_LABELS[post.type] || post.type}
                      </Badge>
                      {post.category && (
                        <Badge
                          variant="gray"
                          className={`text-xs ${isDark ? 'bg-white/10 text-gray-400' : ''}`}
                        >
                          {post.category}
                        </Badge>
                      )}
                    </div>

                    {/* 제목 */}
                    <h3
                      className={`font-semibold mb-2 line-clamp-1 transition-colors ${
                        isDark
                          ? 'text-white group-hover:text-[#8b9aff]'
                          : 'text-gray-900 group-hover:text-[#6778ff]'
                      }`}
                    >
                      {post.title}
                    </h3>

                    {/* 내용 미리보기 */}
                    <p
                      className={`text-sm line-clamp-1 mb-3 ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}
                    >
                      {stripMarkdownImages(post.content)}
                    </p>

                    {/* 메타 정보 */}
                    <div className="flex items-center gap-4">
                      <span
                        className={`flex items-center gap-1.5 text-xs ${
                          isDark ? 'text-gray-500' : 'text-gray-500'
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5" />
                        {formatDate(post.createdAt)}
                      </span>
                      <span
                        className={`flex items-center gap-1.5 text-xs ${
                          isDark ? 'text-gray-500' : 'text-gray-500'
                        }`}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        {post.viewCount?.toLocaleString()}
                      </span>
                      <span
                        className={`flex items-center gap-1.5 text-xs ${
                          isDark ? 'text-gray-500' : 'text-gray-500'
                        }`}
                      >
                        <Heart className="w-3.5 h-3.5" />
                        {post.likeCount}
                      </span>
                      <span
                        className={`flex items-center gap-1.5 text-xs ${
                          isDark ? 'text-gray-500' : 'text-gray-500'
                        }`}
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        {post.commentCount}
                      </span>
                    </div>
                  </div>

                  {/* 화살표 */}
                  <ArrowRight
                    className={`w-5 h-5 flex-shrink-0 mt-1 transition-transform group-hover:translate-x-1 ${
                      isDark ? 'text-gray-600' : 'text-gray-400'
                    }`}
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className={`${
              isDark
                ? 'border-white/20 text-white hover:bg-white/10 disabled:opacity-30'
                : 'disabled:opacity-30'
            }`}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            이전
          </Button>
          <div className="flex items-center gap-2">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = Math.max(0, Math.min(page - 2, totalPages - 5)) + i;
              if (pageNum >= totalPages) return null;
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                    page === pageNum
                      ? 'bg-[#6778ff] text-white'
                      : isDark
                        ? 'text-gray-400 hover:bg-white/10'
                        : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {pageNum + 1}
                </button>
              );
            })}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className={`${
              isDark
                ? 'border-white/20 text-white hover:bg-white/10 disabled:opacity-30'
                : 'disabled:opacity-30'
            }`}
          >
            다음
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}
      </div>
    </div>
  );
}

export default MyPostsPage;
