import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MessageSquare, Heart, Eye, Clock, TrendingUp, HelpCircle, Lightbulb, Users, Loader2, Search, User } from 'lucide-react';
import { useThemeStore } from '@/store/common/themeStore';
import { LandingHeader } from '@/components/landing/LandingHeader';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { useCommunityPosts, useCommunityCategories, useCreatePost } from '@/hooks/tu';
import { WritePostModal } from '@/components/domain/community';
import type { CommunityPost, CommunityCategory, CreatePostRequest } from '@/types/tu';

// 환경 설정: true면 API 사용, false면 더미 데이터 사용
const USE_API = true;

// 카테고리 아이콘 매핑
const getCategoryIcon = (categoryId: string) => {
  switch (categoryId) {
    case 'qna':
    case 'question': return HelpCircle;
    case 'tips':
    case 'tip': return Lightbulb;
    case 'review': return TrendingUp;
    case 'study':
    case 'discussion': return Users;
    default: return MessageSquare;
  }
};

// 더미 카테고리 데이터
const MOCK_CATEGORIES: CommunityCategory[] = [
  { id: 'all', name: '전체', count: 6 },
  { id: 'question', name: 'Q&A', count: 2 },
  { id: 'tip', name: '학습 팁', count: 2 },
  { id: 'review', name: '강의 후기', count: 1 },
  { id: 'discussion', name: '스터디 모집', count: 1 },
];

// 더미 게시글 데이터
const MOCK_POSTS: CommunityPost[] = [
  {
    id: 1,
    type: 'question',
    category: 'question',
    title: 'React useEffect에서 비동기 처리 시 클린업 함수 질문드립니다',
    content: 'useEffect 안에서 API 호출을 할 때 컴포넌트가 언마운트되면 어떻게 처리해야 하나요? AbortController를 사용해야 한다고 들었는데...',
    author: {
      id: 1,
      name: '코딩초보',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
    },
    tags: ['React', 'JavaScript'],
    viewCount: 234,
    likeCount: 12,
    commentCount: 8,
    createdAt: '2024-12-30T08:00:00Z',
    isSolved: true,
  },
  {
    id: 2,
    type: 'tip',
    category: 'tip',
    title: '개발 공부 3개월 만에 취업 성공한 방법 공유합니다',
    content: '비전공자로 시작해서 3개월 만에 스타트업에 프론트엔드 개발자로 취업했습니다. 제가 했던 공부 방법과 포트폴리오 준비 과정을 공유드려요.',
    author: {
      id: 2,
      name: '취준성공',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=100&h=100&fit=crop',
    },
    tags: ['취업', '포트폴리오'],
    viewCount: 1523,
    likeCount: 187,
    commentCount: 45,
    createdAt: '2024-12-30T05:00:00Z',
    isPinned: true,
  },
  {
    id: 3,
    type: 'review',
    category: 'review',
    title: '[후기] Next.js 15 완벽 마스터 강의 솔직 리뷰',
    content: '김개발님의 Next.js 강의를 완강했습니다. App Router부터 서버 컴포넌트까지 정말 깊이있게 다뤄주셔서 실무에 바로 적용할 수 있었어요.',
    author: {
      id: 3,
      name: '프론트마스터',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    },
    tags: ['Next.js', '강의후기'],
    viewCount: 892,
    likeCount: 56,
    commentCount: 23,
    createdAt: '2024-12-29T10:00:00Z',
  },
  {
    id: 4,
    type: 'discussion',
    category: 'discussion',
    title: '[모집] 알고리즘 스터디 모집합니다 (주 3회)',
    content: '프로그래머스 Lv.2~3 수준으로 함께 알고리즘 문제를 풀 분들을 모집합니다. 디스코드로 진행하며, 주 3회 저녁 9시에 모여서 풀이 공유해요.',
    author: {
      id: 4,
      name: '알고왕',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    },
    tags: ['알고리즘', '스터디'],
    viewCount: 456,
    likeCount: 34,
    commentCount: 67,
    createdAt: '2024-12-27T10:00:00Z',
  },
  {
    id: 5,
    type: 'question',
    category: 'question',
    title: 'Spring Boot에서 JWT 토큰 재발급 로직 구현 방법',
    content: 'Access Token이 만료되었을 때 Refresh Token으로 재발급하는 로직을 어디서 처리해야 할까요? 필터에서 처리하는 게 맞나요?',
    author: {
      id: 5,
      name: '백엔드지망',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    },
    tags: ['Spring', 'JWT'],
    viewCount: 345,
    likeCount: 21,
    commentCount: 15,
    createdAt: '2024-12-29T10:00:00Z',
  },
  {
    id: 6,
    type: 'tip',
    category: 'tip',
    title: 'VSCode 생산성 높이는 단축키 & 확장 프로그램 추천',
    content: '개발할 때 유용한 VSCode 단축키와 꼭 설치해야 할 확장 프로그램들을 정리해봤습니다. 특히 Vim 모드 쓰시는 분들 참고하세요!',
    author: {
      id: 6,
      name: '생산성덕후',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    },
    tags: ['VSCode', '개발도구'],
    viewCount: 2341,
    likeCount: 234,
    commentCount: 56,
    createdAt: '2024-12-28T10:00:00Z',
    isPinned: true,
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

// 마크다운 이미지 문법을 제거하고 "[이미지]"로 대체
const stripMarkdownImages = (content: string): string => {
  // ![alt](url) 패턴을 "[이미지]"로 대체
  return content.replace(/!\[[^\]]*\]\([^)]+\)/g, '[이미지]');
};

interface PostCardProps {
  post: CommunityPost;
  isDark: boolean;
  categories: CommunityCategory[];
}

function PostCard({ post, isDark, categories }: PostCardProps) {
  const isHot = post.likeCount > 100;
  const isRecruiting = post.type === 'discussion' && !post.isSolved;

  return (
    <Link
      to={`/tu/main/community/${post.id}`}
      className={`block rounded-xl p-6 transition-all cursor-pointer border ${
        isDark
          ? 'glass border-white/10 hover:bg-white/5'
          : 'bg-white border-gray-200 hover:bg-gray-50'
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Author Image */}
        <div className="hidden sm:block">
          {getImageUrl(post.author.avatar) ? (
            <img
              src={getImageUrl(post.author.avatar)!}
              alt={post.author.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isDark ? 'bg-white/10' : 'bg-gray-200'
            }`}>
              <User className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            {isHot && (
              <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs font-bold rounded">
                HOT
              </span>
            )}
            {post.isSolved && (
              <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs font-bold rounded">
                해결됨
              </span>
            )}
            {isRecruiting && (
              <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs font-bold rounded">
                모집중
              </span>
            )}
            <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              {categories.find((c) => c.id === post.category)?.name || post.category}
            </span>
          </div>

          {/* Title */}
          <h3 className={`text-lg font-semibold mb-2 transition-colors line-clamp-1 ${
            isDark
              ? 'text-white hover:text-[#6778ff]'
              : 'text-gray-900 hover:text-[#6778ff]'
          }`}>
            {post.title}
          </h3>

          {/* Preview */}
          <p className={`text-sm mb-3 line-clamp-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {stripMarkdownImages(post.excerpt || post.content)}
          </p>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className={`px-2 py-1 rounded text-xs ${
                    isDark
                      ? 'bg-white/5 text-gray-400'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Meta */}
          <div className={`flex items-center gap-4 text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            <span>{post.author.name}</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatRelativeTime(post.createdAt)}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {post.viewCount}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-3 h-3" />
              {post.likeCount}
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="w-3 h-3" />
              {post.commentCount}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function CommunityPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'most_commented' | 'most_liked'>('latest');
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  const createPostMutation = useCreatePost();

  // React Query 훅 (API 모드일 때만 활성화)
  const filter = {
    search: searchQuery || undefined,
    category: activeCategory !== 'all' ? activeCategory : undefined,
    sortBy,
  };
  const { data: apiPostData, isLoading, error } = useCommunityPosts(filter, USE_API);
  const { data: apiCategoryData } = useCommunityCategories(USE_API);

  // 실제 사용할 데이터 결정
  const categories = USE_API ? (apiCategoryData?.categories || []) : MOCK_CATEGORIES;

  // Mock 모드에서 필터링 및 정렬 적용
  const getFilteredPosts = (): CommunityPost[] => {
    if (USE_API) {
      return apiPostData?.posts || [];
    }

    let filtered = [...MOCK_POSTS];

    // 카테고리 필터
    if (activeCategory !== 'all') {
      filtered = filtered.filter(post => post.category === activeCategory);
    }

    // 검색어 필터
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query)
      );
    }

    // 정렬
    switch (sortBy) {
      case 'popular':
        filtered.sort((a, b) => b.viewCount - a.viewCount);
        break;
      case 'most_commented':
        filtered.sort((a, b) => b.commentCount - a.commentCount);
        break;
      case 'most_liked':
        filtered.sort((a, b) => b.likeCount - a.likeCount);
        break;
      case 'latest':
      default:
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    return filtered;
  };

  const filteredPosts = getFilteredPosts();

  // 로딩 상태
  if (USE_API && isLoading) {
    return (
      <div className={`min-h-screen ${isDark ? 'landing-dark bg-[#1e1e1e]' : 'landing-light bg-gray-50'}`}>
        <LandingHeader />
        <main className="w-full px-4 md:px-8 lg:px-16 py-12">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#6778ff]" />
            <span className={`ml-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              게시글을 불러오는 중...
            </span>
          </div>
        </main>
        <LandingFooter />
      </div>
    );
  }

  // 에러 상태
  if (USE_API && error) {
    return (
      <div className={`min-h-screen ${isDark ? 'landing-dark bg-[#1e1e1e]' : 'landing-light bg-gray-50'}`}>
        <LandingHeader />
        <main className="w-full px-4 md:px-8 lg:px-16 py-12">
          <div className="text-center py-20">
            <p className={`text-lg ${isDark ? 'text-red-400' : 'text-red-500'}`}>
              게시글을 불러오는데 실패했습니다.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 landing-btn-primary rounded-full text-white"
            >
              다시 시도
            </button>
          </div>
        </main>
        <LandingFooter />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'landing-dark bg-[#1e1e1e]' : 'landing-light bg-gray-50'}`}>
      <LandingHeader />

      <main className="w-full px-4 md:px-8 lg:px-16 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            <span className="gradient-text">커뮤니티</span>
          </h1>
          <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            함께 성장하는 공간, 질문하고 나누고 연결하세요.
          </p>
        </div>

        {/* Search & Sort */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="게시글 검색"
              className={`w-full rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6778ff] focus:border-transparent transition-all ${
                isDark
                  ? 'bg-white/5 border border-white/10 text-white placeholder-gray-500'
                  : 'bg-white border border-gray-200 text-gray-900 placeholder-gray-400'
              }`}
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className={`rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6778ff] cursor-pointer ${
              isDark
                ? 'bg-[#2a2a2a] border border-white/10 text-white'
                : 'bg-white border border-gray-200 text-gray-900'
            }`}
            style={isDark ? { colorScheme: 'dark' } : undefined}
          >
            <option value="latest" className={isDark ? 'bg-[#2a2a2a] text-white' : ''}>최신순</option>
            <option value="popular" className={isDark ? 'bg-[#2a2a2a] text-white' : ''}>조회순</option>
            <option value="most_commented" className={isDark ? 'bg-[#2a2a2a] text-white' : ''}>댓글순</option>
            <option value="most_liked" className={isDark ? 'bg-[#2a2a2a] text-white' : ''}>좋아요순</option>
          </select>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-3 mb-8">
          {categories.map((cat) => {
            const IconComponent = getCategoryIcon(cat.id);
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === cat.id
                    ? 'bg-gradient-to-r from-[#6778ff] to-[#a855f7] text-white shadow-lg shadow-[#6778ff]/25'
                    : isDark
                      ? 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                      : 'bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-gray-200'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Write Button */}
        <div className="flex justify-between items-center mb-6">
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            총 <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{filteredPosts.length}</span>개의 게시글
          </p>
          <button
            onClick={() => setIsWriteModalOpen(true)}
            className="landing-btn-primary px-6 py-3 rounded-xl text-white font-medium flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            글쓰기
          </button>
        </div>

        {/* Posts List */}
        {filteredPosts.length > 0 ? (
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} isDark={isDark} categories={categories} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <MessageSquare className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
            <p className={isDark ? 'text-gray-500' : 'text-gray-400'}>
              게시글이 없습니다.
            </p>
          </div>
        )}

        {/* Load More */}
        {filteredPosts.length > 0 && (
          <div className="text-center mt-10">
            <button className={`px-8 py-3 rounded-full font-medium border transition-colors ${
              isDark
                ? 'border-white/30 text-white hover:bg-white/10'
                : 'border-gray-300 text-gray-700 hover:bg-gray-100'
            }`}>
              더보기
            </button>
          </div>
        )}
      </main>

      <LandingFooter />

      {/* Write Post Modal */}
      <WritePostModal
        isOpen={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)}
        onSubmit={async (data: CreatePostRequest) => {
          if (USE_API) {
            const result = await createPostMutation.mutateAsync(data);
            setIsWriteModalOpen(false);
            navigate(`/tu/main/community/${result.id}`);
          } else {
            // Mock 모드: 새 게시글을 추가하는 시뮬레이션
            console.log('New post data:', data);
            setIsWriteModalOpen(false);
            alert('게시글이 작성되었습니다. (Mock 모드)');
          }
        }}
        categories={categories}
        isDark={isDark}
        isSubmitting={createPostMutation.isPending}
      />
    </div>
  );
}
