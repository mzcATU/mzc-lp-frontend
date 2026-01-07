import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Heart, ChevronRight, Clock, Loader2 } from 'lucide-react';
import { useThemeStore } from '@/store/common/themeStore';
import { useSubdomainPath } from '@/hooks/common';
import { LandingHeader } from '@/components/landing/LandingHeader';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { useMyWishlist, useRemoveFromWishlist } from '@/hooks/tu/useWishlistQueries';
import { useAuthStore } from '@/store/common/authStore';
import type { WishlistItemResponse } from '@/types/tu/wishlist.types';

// 레벨 라벨 매핑
const LEVEL_LABELS: Record<string, string> = {
  BEGINNER: '입문',
  INTERMEDIATE: '초급',
  ADVANCED: '중급',
  EXPERT: '고급',
};

/**
 * 가격 표시 (유료 → 금액, 무료 → 표시 안함)
 */
function formatPrice(price: string | null | undefined, isFree: boolean): string | null {
  if (isFree) return null; // 무료는 표시 안함
  if (!price) return null;
  const numPrice = parseFloat(price);
  if (isNaN(numPrice) || numPrice === 0) return null;
  return `₩${numPrice.toLocaleString()}`;
}

export function WishlistPage() {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const { prefixPath } = useSubdomainPath();
  const { isAuthenticated } = useAuthStore();

  // 페이징 상태
  const [page, setPage] = useState(0);
  const pageSize = 12;

  // React Query 훅
  const { data: wishlistData, isLoading, error } = useMyWishlist(page, pageSize, isAuthenticated);
  const removeFromWishlistMutation = useRemoveFromWishlist();

  const wishlistItems = wishlistData?.content || [];
  const totalPages = wishlistData?.totalPages || 0;
  const totalElements = wishlistData?.totalElements || 0;

  const removeItem = (courseTimeId: number) => {
    removeFromWishlistMutation.mutate(courseTimeId);
  };

  // 비로그인 상태
  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen ${isDark ? 'landing-dark bg-[#1e1e1e]' : 'landing-light bg-gray-50'}`}>
        <LandingHeader />
        <main className="w-full px-4 md:px-8 lg:px-16 py-12">
          <div className="text-center py-20">
            <Heart className={`w-20 h-20 mx-auto mb-6 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
            <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              로그인이 필요합니다
            </h2>
            <p className={`mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              찜 목록을 보려면 로그인해주세요.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 landing-btn-primary px-6 py-3 rounded-full text-white font-medium"
            >
              로그인하기 <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </main>
        <LandingFooter />
      </div>
    );
  }

  // 로딩 상태
  if (isLoading) {
    return (
      <div className={`min-h-screen ${isDark ? 'landing-dark bg-[#1e1e1e]' : 'landing-light bg-gray-50'}`}>
        <LandingHeader />
        <main className="w-full px-4 md:px-8 lg:px-16 py-12">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#6778ff]" />
            <span className={`ml-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              찜 목록을 불러오는 중...
            </span>
          </div>
        </main>
        <LandingFooter />
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className={`min-h-screen ${isDark ? 'landing-dark bg-[#1e1e1e]' : 'landing-light bg-gray-50'}`}>
        <LandingHeader />
        <main className="w-full px-4 md:px-8 lg:px-16 py-12">
          <div className="text-center py-20">
            <p className={`text-lg ${isDark ? 'text-red-400' : 'text-red-500'}`}>
              찜 목록을 불러오는데 실패했습니다.
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`text-3xl md:text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              찜한 강의
            </h1>
            {totalElements > 0 && (
              <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                총 {totalElements}개의 강의
              </p>
            )}
          </div>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-20">
            <Heart className={`w-20 h-20 mx-auto mb-6 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
            <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              찜한 강의가 없습니다
            </h2>
            <p className={`mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              관심 있는 강의에 하트를 눌러 저장해보세요!
            </p>
            <Link
              to={prefixPath('/tu/b2c/courses')}
              className="inline-flex items-center gap-2 landing-btn-primary px-6 py-3 rounded-full text-white font-medium"
            >
              강의 둘러보기 <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlistItems.map((item: WishlistItemResponse) => (
                <div
                  key={item.id}
                  className={`rounded-2xl overflow-hidden border group ${
                    isDark
                      ? 'glass border-white/10'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  {/* Image */}
                  <Link to={prefixPath(`/tu/b2c/times/${item.courseTimeId}`)} className="block relative">
                    <div className="w-full aspect-video bg-gradient-to-br from-[#6778ff]/20 to-[#a855f7]/20 flex items-center justify-center">
                      {item.thumbnailUrl ? (
                        <img
                          src={item.thumbnailUrl}
                          alt={item.courseTimeTitle || '강의 썸네일'}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <Heart className={`w-12 h-12 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                      )}
                    </div>
                    {item.level && (
                      <span className="absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-bold bg-[#6778ff] text-white">
                        {LEVEL_LABELS[item.level] || item.level}
                      </span>
                    )}
                  </Link>

                  {/* Content */}
                  <div className="p-4">
                    <Link to={prefixPath(`/tu/b2c/times/${item.courseTimeId}`)}>
                      <h3 className={`font-semibold mb-2 line-clamp-2 group-hover:text-[#6778ff] transition-colors ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        {item.courseTimeTitle || '제목 없음'}
                      </h3>
                    </Link>

                    {/* Stats */}
                    <div className={`flex items-center gap-3 mb-4 text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                      {item.estimatedHours && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {item.estimatedHours}시간
                        </span>
                      )}
                      {formatPrice(item.price, item.isFree) && (
                        <span className={`px-2 py-0.5 rounded text-xs ${isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                          {formatPrice(item.price, item.isFree)}
                        </span>
                      )}
                    </div>

                    {/* Added Date */}
                    <p className={`text-xs mb-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                      {new Date(item.addedAt).toLocaleDateString('ko-KR')}에 찜함
                    </p>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Link
                        to={prefixPath(`/tu/b2c/times/${item.courseTimeId}`)}
                        className="flex-1 py-2.5 rounded-lg font-medium text-sm landing-btn-primary text-white flex items-center justify-center gap-2"
                      >
                        상세보기
                      </Link>
                      <button
                        onClick={() => removeItem(item.courseTimeId)}
                        disabled={removeFromWishlistMutation.isPending}
                        className={`p-2.5 rounded-lg transition-colors disabled:opacity-50 ${
                          isDark
                            ? 'bg-white/10 text-gray-400 hover:text-red-400 hover:bg-red-500/10'
                            : 'bg-gray-100 text-gray-500 hover:text-red-500 hover:bg-red-50'
                        }`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors disabled:opacity-50 ${
                    isDark
                      ? 'bg-white/10 text-white hover:bg-white/20 disabled:hover:bg-white/10'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:hover:bg-gray-100'
                  }`}
                >
                  이전
                </button>
                <span className={`px-4 py-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {page + 1} / {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors disabled:opacity-50 ${
                    isDark
                      ? 'bg-white/10 text-white hover:bg-white/20 disabled:hover:bg-white/10'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:hover:bg-gray-100'
                  }`}
                >
                  다음
                </button>
              </div>
            )}
          </>
        )}

        {/* Recommendation Section */}
        {wishlistItems.length > 0 && (
          <div className="mt-16">
            <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              이런 강의는 어떠세요?
            </h2>
            <div className={`rounded-2xl p-8 border text-center ${
              isDark ? 'glass border-white/10' : 'bg-white border-gray-200'
            }`}>
              <p className={`mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                찜한 강의를 기반으로 추천 강의를 준비하고 있어요.
              </p>
              <Link
                to={prefixPath('/tu/b2c/courses')}
                className={`inline-flex items-center gap-2 font-medium transition-colors ${
                  isDark ? 'text-[#6778ff] hover:text-[#8b99ff]' : 'text-[#6778ff] hover:text-[#5566ee]'
                }`}
              >
                더 많은 강의 보러가기 <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </main>

      <LandingFooter />
    </div>
  );
}
