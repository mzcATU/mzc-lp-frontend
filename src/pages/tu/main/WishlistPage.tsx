import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Heart, ChevronRight, ShoppingCart, Star, Clock, Users, Loader2 } from 'lucide-react';
import { useThemeStore } from '@/store/common/themeStore';
import { LandingHeader } from '@/components/landing/LandingHeader';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { useWishlist, useWishlistRemoveItem, useAddAllToCart, useCartAddItem } from '@/hooks/tu';
import type { WishlistItem } from '@/types/tu';

// 환경 설정: true면 API 사용, false면 더미 데이터 사용
const USE_API = false;

// 더미 찜 목록 데이터
const MOCK_WISHLIST_ITEMS: WishlistItem[] = [
  {
    id: 1,
    courseId: 101,
    title: '실전! Next.js 15 완벽 마스터',
    instructor: '김개발',
    originalPrice: 129000,
    price: 89000,
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop',
    discount: 31,
    rating: 4.9,
    reviewCount: 1234,
    studentCount: 5678,
    totalHours: 32,
  },
  {
    id: 2,
    courseId: 102,
    title: 'ChatGPT API 활용 실무 프로젝트',
    instructor: '이에이아이',
    originalPrice: 150000,
    price: 120000,
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop',
    discount: 20,
    rating: 4.8,
    reviewCount: 892,
    studentCount: 3421,
    totalHours: 28,
  },
  {
    id: 3,
    courseId: 103,
    title: 'AWS 클라우드 실무',
    instructor: '윤클라우드',
    originalPrice: 130000,
    price: 110000,
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=250&fit=crop',
    discount: 15,
    rating: 4.7,
    reviewCount: 567,
    studentCount: 2341,
    totalHours: 24,
  },
  {
    id: 4,
    courseId: 104,
    title: 'React Native로 앱 개발하기',
    instructor: '박모바일',
    originalPrice: 99000,
    price: 79000,
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=250&fit=crop',
    discount: 20,
    rating: 4.6,
    reviewCount: 423,
    studentCount: 1876,
    totalHours: 22,
  },
];

export function WishlistPage() {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  // React Query 훅 (API 모드일 때만 활성화)
  const { data: apiWishlistData, isLoading, error } = useWishlist(USE_API);
  const removeFromWishlistMutation = useWishlistRemoveItem();
  const addAllToCartMutation = useAddAllToCart();
  const addToCartMutation = useCartAddItem();

  // 로컬 상태 (Mock 모드에서 사용)
  const [mockWishlistItems, setMockWishlistItems] = useState(MOCK_WISHLIST_ITEMS);

  // 실제 사용할 데이터 결정
  const wishlistItems = USE_API ? (apiWishlistData?.items || []) : mockWishlistItems;

  const removeItem = (id: number) => {
    if (USE_API) {
      removeFromWishlistMutation.mutate({ itemIds: [id] });
    } else {
      setMockWishlistItems(mockWishlistItems.filter(item => item.id !== id));
    }
  };

  const addToCart = (item: WishlistItem) => {
    if (USE_API) {
      addToCartMutation.mutate({ courseId: item.courseId });
    } else {
      alert('장바구니에 추가되었습니다. (데모)');
    }
  };

  const handleAddAllToCart = () => {
    if (USE_API) {
      addAllToCartMutation.mutate({ itemIds: wishlistItems.map(item => item.id) });
    } else {
      alert(`${wishlistItems.length}개 강의가 장바구니에 추가되었습니다. (데모)`);
    }
  };

  // 로딩 상태
  if (USE_API && isLoading) {
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
  if (USE_API && error) {
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
          <h1 className={`text-3xl md:text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            찜한 강의
          </h1>
          {wishlistItems.length > 0 && (
            <button
              onClick={handleAddAllToCart}
              disabled={addAllToCartMutation.isPending}
              className="landing-btn-primary px-6 py-2.5 rounded-full text-white font-medium text-sm flex items-center gap-2 disabled:opacity-50"
            >
              {addAllToCartMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ShoppingCart className="w-4 h-4" />
              )}
              전체 장바구니 담기
            </button>
          )}
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
              to="/tu/main/courses"
              className="inline-flex items-center gap-2 landing-btn-primary px-6 py-3 rounded-full text-white font-medium"
            >
              강의 둘러보기 <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <div
                key={item.id}
                className={`rounded-2xl overflow-hidden border group ${
                  isDark
                    ? 'glass border-white/10'
                    : 'bg-white border-gray-200'
                }`}
              >
                {/* Image */}
                <Link to={`/tu/main/courses/${item.courseId}`} className="block relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {item.discount > 0 && (
                    <span className="absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-bold bg-[#6778ff] text-white">
                      {item.discount}% 할인
                    </span>
                  )}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      removeItem(item.id);
                    }}
                    disabled={removeFromWishlistMutation.isPending}
                    className="absolute top-3 right-3 p-2 rounded-full bg-black/50 text-white hover:bg-red-500 transition-colors disabled:opacity-50"
                  >
                    <Heart className="w-4 h-4 fill-current" />
                  </button>
                </Link>

                {/* Content */}
                <div className="p-4">
                  <Link to={`/tu/main/courses/${item.courseId}`}>
                    <h3 className={`font-semibold mb-1 line-clamp-2 group-hover:text-[#6778ff] transition-colors ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      {item.title}
                    </h3>
                  </Link>
                  <p className={`text-sm mb-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {item.instructor}
                  </p>

                  {/* Stats */}
                  <div className={`flex items-center gap-3 mb-3 text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                      {item.rating}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {item.studentCount.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {item.totalHours}시간
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-4">
                    {item.discount > 0 && (
                      <span className={`line-through text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        {item.originalPrice.toLocaleString()}원
                      </span>
                    )}
                    <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {item.price.toLocaleString()}원
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => addToCart(item)}
                      disabled={addToCartMutation.isPending}
                      className="flex-1 py-2.5 rounded-lg font-medium text-sm landing-btn-primary text-white flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {addToCartMutation.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <ShoppingCart className="w-4 h-4" />
                      )}
                      장바구니
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
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
                to="/tu/main/courses"
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
