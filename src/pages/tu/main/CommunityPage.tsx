import { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MessageSquare, Loader2, ChevronRight, ChevronLeft, Users, BookOpen, Hash, Sparkles, Heart } from 'lucide-react';
import { useThemeStore } from '@/store/common/themeStore';
import { useSubdomainPath } from '@/hooks/common';
import { LandingHeader } from '@/components/landing/LandingHeader';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { useCommunityPosts, useCommunityCategories, useCreatePost, useMyPosts, useCommentedPosts } from '@/hooks/tu';
import { WritePostModal } from '@/components/domain/community';
import { useAuth } from '@/hooks/common/auth';
import type { CommunityPost, CommunityCategory, CreatePostRequest } from '@/types/tu';

// 환경 설정: true면 API 사용, false면 더미 데이터 사용
const USE_API = true;

// 더미 카테고리 데이터
const MOCK_CATEGORIES: CommunityCategory[] = [
  { id: 'all', name: '전체', count: 15 },
  { id: 'talk', name: '사는 얘기', count: 5 },
  { id: 'ai', name: 'AI', count: 3 },
  { id: 'salary', name: '연봉·단가', count: 2 },
  { id: 'career', name: '취준생', count: 2 },
  { id: 'study', name: '스터디', count: 2 },
  { id: 'project', name: '프로젝트', count: 1 },
  { id: 'mogakco', name: '모각코·모각공', count: 1 },
  { id: 'mentoring', name: '멘토링·튜터링', count: 1 },
  { id: 'meetup', name: '모임·네트워킹', count: 1 },
];

// 더미 인기글 데이터
const MOCK_POPULAR_POSTS = {
  today: [
    { id: 1, title: '퇴사를 마음먹었습니다.', commentCount: 7, category: '사는 얘기' },
    { id: 2, title: '이직하고 싶은 물경력 개발자', commentCount: 15, category: '사는 얘기' },
    { id: 3, title: '승진했습니다', commentCount: 4, category: '사는 얘기' },
    { id: 4, title: '바이브 코딩의 도입의 문제점이 있는것 같아요', commentCount: 11, category: '사는 얘기' },
    { id: 5, title: '4년차의 개발 방향성과 이직 고려', commentCount: 11, category: '사는 얘기' },
  ],
  todayRight: [
    { id: 6, title: '조폭 말투로 AI 쓰면 빡쳐요', commentCount: 2, category: 'AI' },
    { id: 7, title: '커밋이력 없다고 일이 없냐 + 일 하기 싫고 추가 계약...', commentCount: 4, category: '사는 얘기' },
    { id: 8, title: '초보자 PM역할을 맡았습니다. ㅠㅠ 개발자님들 도와주...', commentCount: 4, category: '피드백' },
    { id: 9, title: '동생의 처남 결혼식 참석하는게 맞을까요?', commentCount: 10, category: '사는 얘기' },
    { id: 10, title: '퀀트 개발해도 망할 것 같음..', commentCount: 2, category: '사는 얘기' },
  ],
  week: [
    { id: 11, title: '주니어 개발자가 알아야 할 것들 정리', commentCount: 45, category: '학습 팁' },
    { id: 12, title: 'React vs Vue 2024 비교', commentCount: 32, category: 'AI' },
    { id: 13, title: '면접 후기 공유합니다', commentCount: 28, category: '취준생' },
    { id: 14, title: '재택근무 꿀팁 모음', commentCount: 24, category: '사는 얘기' },
    { id: 15, title: '연봉 협상 성공 후기', commentCount: 67, category: '연봉·단가' },
  ],
  month: [
    { id: 16, title: '비전공자 개발자 취업 성공기', commentCount: 156, category: '취준생' },
    { id: 17, title: '개발자 번아웃 극복 방법', commentCount: 89, category: '사는 얘기' },
    { id: 18, title: '프리랜서 vs 정규직 비교', commentCount: 134, category: '연봉·단가' },
    { id: 19, title: '스타트업 3년차 회고', commentCount: 78, category: '사는 얘기' },
    { id: 20, title: '개발자 커리어 로드맵', commentCount: 201, category: '학습 팁' },
  ],
  notice: [
    { id: 21, title: '[공지] 커뮤니티 이용 가이드라인 업데이트', commentCount: 0, category: '공지사항' },
    { id: 22, title: '[이벤트] 2024년 연말 회고 이벤트', commentCount: 23, category: '공지사항' },
    { id: 23, title: '[안내] 서비스 점검 일정 안내', commentCount: 5, category: '공지사항' },
  ],
};

// 더미 테크 뉴스 데이터
const MOCK_TECH_NEWS = [
  { id: 1, author: 'chancy', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop', title: 'C# 을 사용하여 Excel 문서 인쇄', excerpt: 'Excel에서 표는 각 열에 제목이 있는 구조화된 데이터를 저장합니다. 이번 글에서는 C#을 사용하여...' },
  { id: 2, author: 'devkim', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=100&h=100&fit=crop', title: 'React 19의 새로운 기능 살펴보기', excerpt: 'React 19에서 추가된 새로운 기능들과 변경점을 살펴봅니다. use() 훅과 서버 컴포넌트...' },
  { id: 3, author: 'jsmaster', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop', title: 'TypeScript 5.0 완벽 가이드', excerpt: 'TypeScript 5.0의 새로운 데코레이터와 const type parameters를 알아봅니다...' },
  { id: 4, author: 'backend', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', title: 'Spring Boot 3.2 마이그레이션', excerpt: 'Spring Boot 3.2로 마이그레이션하면서 겪은 이슈들과 해결 방법을 공유합니다...' },
];

// 더미 게시글 데이터
const MOCK_POSTS: CommunityPost[] = [
  {
    id: 101,
    type: 'discussion',
    category: 'talk',
    title: '같이 회사 다니면 출근 좀 덜 싫을 것 같은 연예인',
    content: '1월 2일이라 그런가 출근을 했는데 일 하나도 안잡히네요 아 심심하니 같이 회사 다니면 출근하기 행복할 것 같은 연예인 알려주세요 같은 팀이면 회사',
    author: { id: 1, name: '코코코난', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop' },
    tags: ['커뮤니티', '사는 얘기'],
    viewCount: 234,
    likeCount: 12,
    commentCount: 1,
    createdAt: new Date(Date.now() - 7 * 60000).toISOString(),
  },
  {
    id: 102,
    type: 'question',
    category: 'ai',
    title: 'ChatGPT API 연동 시 토큰 제한 우회 방법',
    content: 'GPT-4 API를 사용하는데 토큰 제한이 너무 빡빡합니다. 긴 문서를 처리해야 하는데 어떻게 해결하셨나요?',
    author: { id: 2, name: 'AI개발자', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=100&h=100&fit=crop' },
    tags: ['AI', 'ChatGPT'],
    viewCount: 567,
    likeCount: 34,
    commentCount: 12,
    createdAt: new Date(Date.now() - 25 * 60000).toISOString(),
  },
  {
    id: 103,
    type: 'tip',
    category: 'salary',
    title: '연봉 협상 시 꼭 알아야 할 5가지',
    content: '이직하면서 연봉 협상을 여러 번 해봤는데요, 제가 느낀 핵심 포인트들을 공유합니다.',
    author: { id: 3, name: '협상의신', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop' },
    tags: ['연봉', '이직'],
    viewCount: 1234,
    likeCount: 89,
    commentCount: 23,
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
  {
    id: 104,
    type: 'discussion',
    category: 'study',
    title: '[모집] 알고리즘 스터디 모집합니다 (주 3회)',
    content: '프로그래머스 Lv.2~3 수준으로 함께 알고리즘 문제를 풀 분들을 모집합니다.',
    author: { id: 4, name: '알고왕', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' },
    tags: ['알고리즘', '스터디'],
    viewCount: 456,
    likeCount: 21,
    commentCount: 8,
    createdAt: new Date(Date.now() - 5 * 3600000).toISOString(),
  },
  {
    id: 105,
    type: 'question',
    category: 'career',
    title: '비전공자 신입 포트폴리오 피드백 부탁드려요',
    content: '국비지원 6개월 과정 수료하고 취준 중인데요, 포트폴리오 방향이 맞는지 모르겠습니다.',
    author: { id: 5, name: '취준생123', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop' },
    tags: ['취업', '포트폴리오'],
    viewCount: 789,
    likeCount: 45,
    commentCount: 31,
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
];

// 상대 시간 포맷
const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return '방금 전';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}일 전`;
  return date.toLocaleDateString('ko-KR');
};

// 마크다운 이미지 문법을 제거하고 "[이미지]"로 대체
const stripMarkdownImages = (content: string): string => {
  // ![alt](url) 패턴을 "[이미지]"로 대체
  return content.replace(/!\[[^\]]*\]\([^)]+\)/g, '[이미지]');
};

// 인기글 탭 타입
type PopularTab = 'today' | 'week' | 'month' | 'notice';

export function CommunityPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery] = useState('');
  const [popularTab, setPopularTab] = useState<PopularTab>('today');
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [pendingTags, setPendingTags] = useState<string[]>([]); // 추가 대기 중인 태그
  const [confirmedTags, setConfirmedTags] = useState<string[]>([]); // 사용자가 확인한 태그
  const [rejectedTags, setRejectedTags] = useState<string[]>([]); // 거절된 태그
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  const { prefixPath } = useSubdomainPath();
  const createPostMutation = useCreatePost();
  const { isAuthenticated } = useAuth();

  // React Query 훅 (API 모드일 때만 활성화)
  const filter = {
    search: searchQuery || undefined,
    category: activeCategory !== 'all' ? activeCategory : undefined,
    sortBy: 'latest' as const,
  };
  const { data: apiPostData, isLoading, error } = useCommunityPosts(filter, USE_API);
  const { data: apiCategoryData } = useCommunityCategories(USE_API);

  // 내 게시글 및 참여한 게시글 (로그인 시에만)
  const { data: myPostsData } = useMyPosts(0, 5, USE_API && isAuthenticated);
  const { data: commentedPostsData } = useCommentedPosts(0, 5, USE_API && isAuthenticated);

  // 사용자의 관심 태그 추출 (내가 쓴 글 + 참여한 글에서 태그 수집)
  const suggestedTags = (() => {
    const tagCount: Record<string, number> = {};

    // 내가 쓴 글의 태그
    myPostsData?.posts?.forEach(post => {
      post.tags?.forEach(tag => {
        tagCount[tag] = (tagCount[tag] || 0) + 2; // 내가 쓴 글은 가중치 2
      });
    });

    // 참여한 글의 태그
    commentedPostsData?.posts?.forEach(post => {
      post.tags?.forEach(tag => {
        tagCount[tag] = (tagCount[tag] || 0) + 1; // 참여한 글은 가중치 1
      });
    });

    // 가중치 높은 순으로 정렬하여 상위 5개 반환
    return Object.entries(tagCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([tag]) => tag);
  })();

  // 추가 대기 중인 태그 업데이트 (새로운 태그가 발견되면)
  useEffect(() => {
    const newTags = suggestedTags.filter(tag =>
      !confirmedTags.includes(tag) &&
      !pendingTags.includes(tag) &&
      !rejectedTags.includes(tag)
    );
    if (newTags.length > 0) {
      setPendingTags(prev => [...prev, ...newTags]);
    }
  }, [suggestedTags, confirmedTags, pendingTags, rejectedTags]);

  // 실제 사용할 관심 태그 (확인된 태그만)
  const userInterestTags = confirmedTags;

  // 태그 추가 확인 핸들러
  const handleConfirmTag = (tag: string) => {
    setConfirmedTags(prev => [...prev, tag]);
    setPendingTags(prev => prev.filter(t => t !== tag));
  };

  // 태그 추가 거절 핸들러
  const handleRejectTag = (tag: string) => {
    setPendingTags(prev => prev.filter(t => t !== tag));
    setRejectedTags(prev => [...prev, tag]);
  };

  // 태그 삭제 핸들러
  const handleRemoveTag = (tag: string) => {
    setConfirmedTags(prev => prev.filter(t => t !== tag));
  };

  // 관심 태그 기반 추천 게시글 필터링
  const recommendedPosts = (() => {
    if (!userInterestTags.length || !apiPostData?.posts) return [];

    // 내가 쓴 글과 참여한 글 ID 제외
    const myPostIds = new Set(myPostsData?.posts?.map(p => p.id) || []);
    const commentedPostIds = new Set(commentedPostsData?.posts?.map(p => p.id) || []);

    return apiPostData.posts
      .filter(post => {
        // 이미 참여한 글 제외
        if (myPostIds.has(post.id) || commentedPostIds.has(post.id)) return false;
        // 관심 태그와 매칭
        return post.tags?.some(tag => userInterestTags.includes(tag));
      })
      .slice(0, 4);
  })();

  // 실제 사용할 데이터 결정
  const categories = USE_API ? (apiCategoryData?.categories || []) : MOCK_CATEGORIES;

  // Mock 모드에서 필터링 적용
  const getFilteredPosts = (): CommunityPost[] => {
    if (USE_API) {
      return apiPostData?.posts || [];
    }

    let filtered = [...MOCK_POSTS];

    if (activeCategory !== 'all') {
      filtered = filtered.filter(post => post.category === activeCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query)
      );
    }

    return filtered;
  };

  const filteredPosts = getFilteredPosts();

  // 인기글 데이터 가져오기
  const getPopularPosts = (tab: PopularTab) => {
    switch (tab) {
      case 'today':
        return { left: MOCK_POPULAR_POSTS.today, right: MOCK_POPULAR_POSTS.todayRight };
      case 'week':
        return { left: MOCK_POPULAR_POSTS.week, right: MOCK_POPULAR_POSTS.todayRight };
      case 'month':
        return { left: MOCK_POPULAR_POSTS.month, right: MOCK_POPULAR_POSTS.todayRight };
      case 'notice':
        return { left: MOCK_POPULAR_POSTS.notice, right: [] };
      default:
        return { left: [], right: [] };
    }
  };

  const popularPosts = getPopularPosts(popularTab);

  // 무한 순환 캐러셀
  const totalItems = MOCK_TECH_NEWS.length;
  const extendedNews = [...MOCK_TECH_NEWS, ...MOCK_TECH_NEWS, ...MOCK_TECH_NEWS]; // 3배로 복제
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isTransitioning, setIsTransitioning] = useState(true);

  // 무한 순환 처리
  useEffect(() => {
    if (carouselIndex < 0) {
      // 왼쪽 끝 -> 오른쪽으로 점프
      setIsTransitioning(false);
      setCarouselIndex(totalItems + carouselIndex);
    } else if (carouselIndex >= totalItems) {
      // 오른쪽 끝 -> 왼쪽으로 점프
      setIsTransitioning(false);
      setCarouselIndex(carouselIndex - totalItems);
    }
  }, [carouselIndex, totalItems]);

  // 트랜지션 복원
  useEffect(() => {
    if (!isTransitioning) {
      const timer = setTimeout(() => setIsTransitioning(true), 50);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  const handlePrev = useCallback(() => {
    setCarouselIndex(prev => prev - 1);
  }, []);

  const handleNext = useCallback(() => {
    setCarouselIndex(prev => prev + 1);
  }, []);

  // 로딩 상태
  if (USE_API && isLoading) {
    return (
      <div className={`min-h-screen dark-scrollbar ${isDark ? 'landing-dark' : 'landing-light'}`}>
        <LandingHeader />
        <main className="w-full px-4 md:px-8 lg:px-16 py-12">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#6778ff]" />
            <span className="ml-3 landing-text-muted">게시글을 불러오는 중...</span>
          </div>
        </main>
        <LandingFooter />
      </div>
    );
  }

  // 에러 상태
  if (USE_API && error) {
    return (
      <div className={`min-h-screen dark-scrollbar ${isDark ? 'landing-dark' : 'landing-light'}`}>
        <LandingHeader />
        <main className="w-full px-4 md:px-8 lg:px-16 py-12">
          <div className="text-center py-20">
            <MessageSquare className="w-16 h-16 mx-auto mb-4 landing-text-muted" />
            <p className="text-lg landing-text-primary mb-4">게시글을 불러오는데 실패했습니다</p>
            <button
              onClick={() => window.location.reload()}
              className="landing-btn-primary px-6 py-2 rounded-xl"
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
    <div className={`min-h-screen dark-scrollbar ${isDark ? 'landing-dark' : 'landing-light'}`}>
      <LandingHeader />

      <main>
        {/* 인기글 섹션 */}
        <section className="w-full px-4 md:px-8 lg:px-16 py-12">
          <div className={`rounded-2xl p-6 md:p-8 border ${
            isDark ? 'glass border-white/10' : 'bg-white border-gray-200'
          }`}>
            {/* 인기글 탭 */}
            <div className={`flex gap-6 mb-6 border-b ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
              {[
                { key: 'today', label: '오늘의 인기글' },
                { key: 'week', label: '이번주 인기글' },
                { key: 'month', label: '이달의 인기글' },
                { key: 'notice', label: '공지사항' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setPopularTab(tab.key as PopularTab)}
                  className={`pb-3 text-sm font-medium transition-colors relative ${
                    popularTab === tab.key
                      ? 'landing-text-primary'
                      : 'landing-text-muted hover:landing-text-secondary'
                  }`}
                >
                  {tab.label}
                  {popularTab === tab.key && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6778ff]" />
                  )}
                </button>
              ))}
            </div>

            {/* 인기글 목록 - 2열 그리드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3">
              {/* 왼쪽 열 */}
              <div className="space-y-3">
                {popularPosts.left.map((post) => (
                  <Link
                    key={post.id}
                    to={prefixPath(`/tu/b2c/community/${post.id}`)}
                    className="flex items-center gap-3 group"
                  >
                    <span className="text-sm landing-text-primary group-hover:text-[#6778ff] transition-colors truncate flex-1">
                      {post.title}
                    </span>
                    {post.commentCount > 0 && (
                      <span className="text-xs font-medium text-red-500">
                        N ({post.commentCount})
                      </span>
                    )}
                    <span className="text-xs landing-text-muted whitespace-nowrap">
                      {post.category}
                    </span>
                  </Link>
                ))}
              </div>

              {/* 오른쪽 열 */}
              {popularPosts.right.length > 0 && (
                <div className="space-y-3">
                  {popularPosts.right.map((post) => (
                    <Link
                      key={post.id}
                      to={prefixPath(`/tu/b2c/community/${post.id}`)}
                      className="flex items-center gap-3 group"
                    >
                      <span className="text-sm landing-text-primary group-hover:text-[#6778ff] transition-colors truncate flex-1">
                        {post.title}
                      </span>
                      {post.commentCount > 0 && (
                        <span className="text-xs font-medium text-red-500">
                          N ({post.commentCount})
                        </span>
                      )}
                      <span className="text-xs landing-text-muted whitespace-nowrap">
                        {post.category}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 나의 커뮤니티 섹션 */}
        {isAuthenticated && (
          <section className="w-full px-4 md:px-8 lg:px-16 py-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-bold landing-text-primary">
                나의 커뮤니티
              </h2>
              <Link
                to={prefixPath('/tu/b2c/mypage/posts')}
                className="text-sm landing-text-secondary hover:opacity-80 flex items-center gap-1 transition-colors"
              >
                더 보기 <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* 내가 쓴 글 */}
              <div className={`rounded-2xl p-6 border ${
                isDark ? 'glass border-white/10' : 'bg-white border-gray-200'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isDark ? 'bg-[#6778ff]/20' : 'bg-[#6778ff]/10'
                    }`}>
                      <BookOpen className="w-5 h-5 text-[#6778ff]" />
                    </div>
                    <h3 className="font-semibold landing-text-primary">내가 쓴 글</h3>
                  </div>
                  <Link
                    to={prefixPath('/tu/b2c/mypage/posts')}
                    className="text-xs landing-text-muted hover:text-[#6778ff] transition-colors flex items-center gap-1"
                  >
                    전체보기 <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
                {myPostsData?.posts && myPostsData.posts.length > 0 ? (
                  <div className="space-y-2">
                    {myPostsData.posts.slice(0, 3).map((post) => (
                      <Link
                        key={post.id}
                        to={prefixPath(`/tu/b2c/community/${post.id}`)}
                        className={`block p-3 rounded-xl transition-colors ${
                          isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm landing-text-primary truncate flex-1 mr-2">
                            {post.title}
                          </span>
                          <span className="text-xs landing-text-muted whitespace-nowrap">
                            {formatRelativeTime(post.createdAt)}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-sm landing-text-muted mb-3">아직 작성한 글이 없어요</p>
                    <button
                      onClick={() => setIsWriteModalOpen(true)}
                      className="text-sm text-[#6778ff] hover:underline"
                    >
                      첫 글 작성하기
                    </button>
                  </div>
                )}
              </div>

              {/* 참여한 글 (댓글 단 게시글) */}
              <div className={`rounded-2xl p-6 border ${
                isDark ? 'glass border-white/10' : 'bg-white border-gray-200'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isDark ? 'bg-[#10b981]/20' : 'bg-[#10b981]/10'
                    }`}>
                      <Users className="w-5 h-5 text-[#10b981]" />
                    </div>
                    <h3 className="font-semibold landing-text-primary">참여한 글</h3>
                  </div>
                  <Link
                    to={prefixPath('/tu/b2c/mypage/comments')}
                    className="text-xs landing-text-muted hover:text-[#10b981] transition-colors flex items-center gap-1"
                  >
                    전체보기 <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
                {commentedPostsData?.posts && commentedPostsData.posts.length > 0 ? (
                  <div className="space-y-2">
                    {commentedPostsData.posts.slice(0, 3).map((post) => (
                      <Link
                        key={post.id}
                        to={prefixPath(`/tu/b2c/community/${post.id}`)}
                        className={`block p-3 rounded-xl transition-colors ${
                          isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm landing-text-primary truncate flex-1 mr-2">
                            {post.title}
                          </span>
                          {post.commentCount > 0 && (
                            <span className="text-xs text-[#10b981] font-medium mr-2">
                              +{post.commentCount}
                            </span>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-sm landing-text-muted mb-3">아직 참여한 글이 없어요</p>
                    <Link
                      to={prefixPath('/tu/b2c/community')}
                      className="text-sm text-[#10b981] hover:underline"
                    >
                      커뮤니티 둘러보기
                    </Link>
                  </div>
                )}
              </div>

              {/* 나의 관심 글 (좋아요한 글) */}
              <div className={`rounded-2xl p-6 border ${
                isDark ? 'glass border-white/10' : 'bg-white border-gray-200'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isDark ? 'bg-[#f43f5e]/20' : 'bg-[#f43f5e]/10'
                    }`}>
                      <Heart className="w-5 h-5 text-[#f43f5e]" />
                    </div>
                    <h3 className="font-semibold landing-text-primary">관심 글</h3>
                  </div>
                  <Link
                    to={prefixPath('/tu/b2c/mypage/posts?tab=liked')}
                    className="text-xs landing-text-muted hover:text-[#f43f5e] transition-colors flex items-center gap-1"
                  >
                    전체보기 <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
                {/* 좋아요한 글 목록 - API 연동 시 데이터 표시 */}
                <div className="text-center py-6">
                  <p className="text-sm landing-text-muted mb-3">좋아요한 글을 모아보세요</p>
                  <Link
                    to={prefixPath('/tu/b2c/community')}
                    className="text-sm text-[#f43f5e] hover:underline"
                  >
                    글 둘러보기
                  </Link>
                </div>
              </div>
            </div>

            {/* 관심 태그 기반 추천 */}
            {(pendingTags.length > 0 || userInterestTags.length > 0 || recommendedPosts.length > 0) && (
              <div className={`mt-6 rounded-2xl p-6 border ${
                isDark ? 'glass border-white/10' : 'bg-gradient-to-r from-[#6778ff]/5 to-[#10b981]/5 border-gray-200'
              }`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isDark ? 'bg-[#f59e0b]/20' : 'bg-[#f59e0b]/10'
                  }`}>
                    <Sparkles className="w-5 h-5 text-[#f59e0b]" />
                  </div>
                  <div>
                    <h3 className="font-semibold landing-text-primary">관심 커뮤니티 추천</h3>
                    <p className="text-xs landing-text-muted">나의 활동 기반 맞춤 추천</p>
                  </div>
                </div>

                {/* 추천 태그 추가 질문 */}
                {pendingTags.length > 0 && (
                  <div className={`mb-4 p-4 rounded-xl border ${
                    isDark ? 'bg-[#f59e0b]/10 border-[#f59e0b]/20' : 'bg-[#f59e0b]/5 border-[#f59e0b]/20'
                  }`}>
                    <p className="text-sm landing-text-primary mb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#f59e0b]" />
                      이 태그를 관심 태그에 추가할까요?
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {pendingTags.map((tag) => (
                        <div
                          key={tag}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium ${
                            isDark ? 'bg-white/10 text-gray-300' : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          <span>#{tag}</span>
                          <button
                            onClick={() => handleConfirmTag(tag)}
                            className={`ml-1 p-0.5 rounded-full transition-colors ${
                              isDark ? 'hover:bg-green-500/30 text-green-400' : 'hover:bg-green-100 text-green-600'
                            }`}
                            title="추가"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleRejectTag(tag)}
                            className={`p-0.5 rounded-full transition-colors ${
                              isDark ? 'hover:bg-red-500/30 text-red-400' : 'hover:bg-red-100 text-red-600'
                            }`}
                            title="거절"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 확인된 관심 태그 */}
                {userInterestTags.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs landing-text-muted mb-2 flex items-center gap-1">
                      <Hash className="w-3 h-3" /> 나의 관심 태그
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {userInterestTags.map((tag) => (
                        <div
                          key={tag}
                          className={`group flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                            isDark
                              ? 'bg-[#6778ff]/20 text-[#6778ff]'
                              : 'bg-[#6778ff]/10 text-[#6778ff]'
                          }`}
                        >
                          <Link to={prefixPath(`/tu/b2c/community?search=${encodeURIComponent(tag)}`)}>
                            #{tag}
                          </Link>
                          <button
                            onClick={() => handleRemoveTag(tag)}
                            className={`opacity-0 group-hover:opacity-100 p-0.5 rounded-full transition-all ${
                              isDark ? 'hover:bg-white/20' : 'hover:bg-[#6778ff]/20'
                            }`}
                            title="삭제"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 추천 게시글 */}
                {recommendedPosts.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-xs landing-text-muted mb-2">이런 글은 어떠세요?</p>
                    {recommendedPosts.map((post) => (
                      <Link
                        key={post.id}
                        to={prefixPath(`/tu/b2c/community/${post.id}`)}
                        className={`block p-3 rounded-xl transition-colors ${
                          isDark ? 'hover:bg-white/5' : 'hover:bg-white'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <span className="text-sm landing-text-primary line-clamp-1">
                              {post.title}
                            </span>
                            <div className="flex items-center gap-2 mt-1">
                              {post.tags?.slice(0, 2).map((tag) => (
                                <span
                                  key={tag}
                                  className={`text-[10px] px-1.5 py-0.5 rounded ${
                                    userInterestTags.includes(tag)
                                      ? isDark ? 'bg-[#6778ff]/20 text-[#6778ff]' : 'bg-[#6778ff]/10 text-[#6778ff]'
                                      : isDark ? 'bg-white/10 text-gray-400' : 'bg-gray-100 text-gray-500'
                                  }`}
                                >
                                  #{tag}
                                </span>
                              ))}
                              <span className="text-[10px] landing-text-muted">
                                댓글 {post.commentCount}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : userInterestTags.length > 0 ? (
                  <p className="text-sm landing-text-muted text-center py-4">
                    관심 태그에 맞는 새 글이 없어요. 첫 글을 작성해보세요!
                  </p>
                ) : null}
              </div>
            )}

          </section>
        )}

        {/* 테크 지식 / 뉴스 섹션 */}
        <section className="landing-section-alt py-16">
          <div className="w-full px-4 md:px-8 lg:px-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold landing-text-primary">
                  지금 가장 뜨거운 이슈
                </h2>
                <p className="landing-text-muted text-sm mt-2">
                  개발자들이 주목하는 최신 트렌드를 확인하세요
                </p>
              </div>
              <Link
                to={prefixPath('/tu/b2c/community?category=tech')}
                className="text-sm landing-text-secondary hover:opacity-80 flex items-center gap-1 transition-colors"
              >
                더 보기 <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* 캐러셀 */}
            <div className="relative">
              {/* 왼쪽 버튼 - 항상 표시 */}
              <button
                onClick={handlePrev}
                className={`absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-colors ${
                  isDark ? 'glass border border-white/10 text-white hover:bg-white/10' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="overflow-hidden" ref={carouselRef}>
                <div
                  className={`flex gap-6 ${isTransitioning ? 'transition-transform duration-500 ease-out' : ''}`}
                  style={{ transform: `translateX(calc(-${carouselIndex + totalItems} * (33.333% + 8px)))` }}
                >
                  {extendedNews.map((news, index) => (
                    <Link
                      key={`${news.id}-${index}`}
                      to={prefixPath(`/tu/b2c/community/${news.id}`)}
                      className={`group block rounded-2xl p-6 transition-all duration-300 border flex-shrink-0 w-[calc(33.333%-16px)] ${
                        isDark
                          ? 'glass border-white/10 hover:border-[#6778ff]/50'
                          : 'bg-white border-gray-200 hover:border-[#6778ff] hover:shadow-lg'
                      }`}
                    >
                      <span className={`inline-block text-xs px-2 py-1 rounded mb-3 ${
                        isDark ? 'bg-white/10 text-gray-400' : 'bg-gray-100 text-gray-500'
                      }`}>
                        Tech 뉴스
                      </span>
                      <div className="flex items-center gap-2 mb-3">
                        <img src={news.avatar} alt={news.author} className="w-8 h-8 rounded-full object-cover" />
                        <span className="text-sm landing-text-secondary">{news.author}</span>
                      </div>
                      <h3 className="font-semibold landing-text-primary mb-2 line-clamp-1 group-hover:text-[#6778ff] transition-colors">
                        {news.title}
                      </h3>
                      <p className="text-sm landing-text-muted line-clamp-2">
                        {news.excerpt}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>

              {/* 오른쪽 버튼 - 항상 표시 */}
              <button
                onClick={handleNext}
                className={`absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-colors ${
                  isDark ? 'glass border border-white/10 text-white hover:bg-white/10' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* 캐러셀 인디케이터 */}
            <div className="flex justify-center gap-2 mt-6">
              {[...Array(totalItems)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCarouselIndex(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    (carouselIndex % totalItems + totalItems) % totalItems === i ? 'bg-[#6778ff]' : isDark ? 'bg-white/20' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* 카테고리 필터 & 게시글 목록 */}
        <section className="w-full px-4 md:px-8 lg:px-16 py-16">
          {/* 카테고리 필터 칩 */}
          <div className="flex flex-wrap items-center gap-3 mb-8">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === cat.id
                    ? 'landing-btn-primary shadow-lg'
                    : 'landing-chip-inactive'
                }`}
              >
                {cat.name}
              </button>
            ))}

            {/* 글쓰기 버튼 */}
            <button
              onClick={() => setIsWriteModalOpen(true)}
              className="ml-auto landing-btn-primary px-5 py-2.5 rounded-full text-sm font-medium flex items-center gap-2 shadow-lg"
            >
              <MessageSquare className="w-4 h-4" />
              글쓰기
            </button>
          </div>

          {/* 게시글 목록 */}
          <div className={`rounded-2xl border overflow-hidden ${
            isDark ? 'glass border-white/10' : 'bg-white border-gray-200'
          }`}>
            {filteredPosts.length > 0 ? (
              <div className={`divide-y ${isDark ? 'divide-white/5' : 'divide-gray-100'}`}>
                {filteredPosts.map((post) => (
                  <Link
                    key={post.id}
                    to={prefixPath(`/tu/b2c/community/${post.id}`)}
                    className={`flex items-start gap-4 px-6 py-5 transition-colors ${
                      isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50'
                    }`}
                  >
                    {/* 카테고리 & 작성자 */}
                    <div className="flex items-center gap-3 min-w-[200px]">
                      <span className={`text-xs px-2 py-1 rounded ${
                        isDark ? 'bg-white/10 text-gray-400' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {categories.find(c => c.id === post.category)?.name || post.category}
                      </span>
                      <span className="text-sm landing-text-muted">
                        {post.author.name}
                      </span>
                      <span className="text-xs landing-text-muted">
                        · {formatRelativeTime(post.createdAt)}
                      </span>
                    </div>

                    {/* 제목 & 내용 */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium landing-text-primary mb-1 line-clamp-1">
                        {post.title}
                        {post.commentCount > 0 && (
                          <span className="text-red-500 text-sm ml-2 font-normal">
                            N ({post.commentCount})
                          </span>
                        )}
                      </h3>
                      <p className="text-sm landing-text-muted line-clamp-1">
                        {stripMarkdownImages(post.content)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 landing-text-muted" />
                <p className="landing-text-muted mb-4">게시글이 없습니다</p>
                <button
                  onClick={() => setIsWriteModalOpen(true)}
                  className="landing-btn-primary px-6 py-2 rounded-xl"
                >
                  첫 번째 글쓰기
                </button>
              </div>
            )}

            {/* 더보기 */}
            {filteredPosts.length > 0 && (
              <div className={`text-center py-4 border-t ${isDark ? 'border-white/10' : 'border-gray-100'}`}>
                <button className="text-sm landing-text-secondary hover:landing-text-primary transition-colors">
                  더보기
                </button>
              </div>
            )}
          </div>
        </section>
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
            navigate(prefixPath(`/tu/b2c/community/${result.id}`));
          } else {
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
