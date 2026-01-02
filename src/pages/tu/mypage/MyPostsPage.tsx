/**
 * MyPostsPage
 * 내 게시글 목록 페이지
 */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  Heart,
  MessageSquare,
  Eye,
  Clock,
  ChevronLeft,
  ChevronRight,
  Loader2,
  PenSquare,
} from 'lucide-react';
import { useThemeStore } from '@/store/common/themeStore';
import { useMyPosts } from '@/hooks/tu/useCommunityQueries';
import { Badge, Button } from '@/components/common';
import { POST_TYPE_LABELS } from '@/types/tu/community.types';

const PAGE_SIZE = 10;

export function MyPostsPage() {
  const navigate = useNavigate();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const [page, setPage] = useState(0);

  const { data, isLoading } = useMyPosts(page, PAGE_SIZE);

  const posts = data?.posts || [];
  const totalPages = data?.totalPages || 0;
  const totalCount = data?.totalCount || 0;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const stripMarkdownImages = (content: string): string => {
    return content.replace(/!\[[^\]]*\]\([^)]+\)/g, '[이미지]');
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            내 게시글
          </h1>
          <p className={`mt-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            내가 작성한 커뮤니티 게시글을 확인하세요
          </p>
        </div>
        <Button onClick={() => navigate('/tu/community')}>
          <PenSquare className="w-4 h-4 mr-2" />
          글 작성하기
        </Button>
      </div>

      {/* 게시글 통계 */}
      <div
        className={`p-4 rounded-xl ${
          isDark ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-200'
        }`}
      >
        <div className="flex items-center gap-2">
          <FileText className={`w-5 h-5 ${isDark ? 'text-[#6778ff]' : 'text-blue-600'}`} />
          <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
            총 <strong>{totalCount}</strong>개의 게시글
          </span>
        </div>
      </div>

      {/* 게시글 목록 */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className={`w-8 h-8 animate-spin ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
        </div>
      ) : posts.length === 0 ? (
        <div
          className={`text-center py-20 rounded-xl ${
            isDark ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-200'
          }`}
        >
          <FileText className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
          <h3 className={`font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            작성한 게시글이 없습니다
          </h3>
          <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            커뮤니티에서 첫 게시글을 작성해보세요
          </p>
          <Button onClick={() => navigate('/tu/community')}>커뮤니티 가기</Button>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <Link
              key={post.id}
              to={`/tu/community/${post.id}`}
              className={`block p-4 rounded-xl transition-all ${
                isDark
                  ? 'bg-white/5 border border-white/10 hover:bg-white/10'
                  : 'bg-white border border-gray-200 hover:shadow-md'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  {/* 타입 & 카테고리 */}
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="blue" className="text-xs">
                      {POST_TYPE_LABELS[post.type] || post.type}
                    </Badge>
                    {post.category && (
                      <Badge variant="gray" className="text-xs">
                        {post.category}
                      </Badge>
                    )}
                  </div>

                  {/* 제목 */}
                  <h3
                    className={`font-medium mb-2 line-clamp-1 ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {post.title}
                  </h3>

                  {/* 내용 미리보기 */}
                  <p
                    className={`text-sm line-clamp-2 mb-3 ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    {stripMarkdownImages(post.content)}
                  </p>

                  {/* 메타 정보 */}
                  <div className={`flex items-center gap-4 text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {formatDate(post.createdAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      {post.viewCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5" />
                      {post.likeCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5" />
                      {post.commentCount}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className={isDark ? 'border-white/20 text-white hover:bg-white/10' : ''}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className={`px-4 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {page + 1} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className={isDark ? 'border-white/20 text-white hover:bg-white/10' : ''}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

export default MyPostsPage;
