import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingCart, ChevronRight, Loader2, Heart, Plus, Check } from 'lucide-react';
import { useThemeStore } from '@/store/common/themeStore';
import { LandingHeader } from '@/components/landing/LandingHeader';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { useCart, useRemoveFromCart, useRemoveFromCartBulk, useAddToCart, useMyWishlist } from '@/hooks/tu';
import type { CartItemResponse } from '@/types/tu/cart.types';
import type { WishlistItemResponse } from '@/types/tu/wishlist.types';

export function CartPage() {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  // Cart React Query 훅
  const { data: cartItems = [], isLoading: isCartLoading, error: cartError } = useCart();
  const removeFromCartMutation = useRemoveFromCart();
  const removeFromCartBulkMutation = useRemoveFromCartBulk();
  const addToCartMutation = useAddToCart();

  // Wishlist React Query 훅
  const { data: wishlistData, isLoading: isWishlistLoading } = useMyWishlist();
  const wishlistItems = wishlistData?.content || [];

  // 선택 상태 관리
  const [selectedCourseTimeIds, setSelectedCourseTimeIds] = useState<number[]>([]);

  // 장바구니에 있는 courseTimeId Set
  const cartCourseTimeIds = useMemo(() => new Set(cartItems.map(item => item.courseTimeId)), [cartItems]);

  // 찜 목록 중 장바구니에 없는 아이템만 표시
  const availableWishlistItems = useMemo(() =>
    wishlistItems.filter(item => !cartCourseTimeIds.has(item.courseTimeId)),
    [wishlistItems, cartCourseTimeIds]
  );

  // 장바구니 아이템이 로드되면 전체 선택
  useEffect(() => {
    if (cartItems.length > 0 && selectedCourseTimeIds.length === 0) {
      setSelectedCourseTimeIds(cartItems.map(item => item.courseTimeId));
    }
  }, [cartItems, selectedCourseTimeIds.length]);

  const toggleSelectAll = () => {
    if (selectedCourseTimeIds.length === cartItems.length) {
      setSelectedCourseTimeIds([]);
    } else {
      setSelectedCourseTimeIds(cartItems.map(item => item.courseTimeId));
    }
  };

  const toggleSelectItem = (courseTimeId: number) => {
    if (selectedCourseTimeIds.includes(courseTimeId)) {
      setSelectedCourseTimeIds(selectedCourseTimeIds.filter(id => id !== courseTimeId));
    } else {
      setSelectedCourseTimeIds([...selectedCourseTimeIds, courseTimeId]);
    }
  };

  const removeItem = (courseTimeId: number) => {
    removeFromCartMutation.mutate(courseTimeId, {
      onSuccess: () => {
        setSelectedCourseTimeIds(selectedCourseTimeIds.filter(id => id !== courseTimeId));
      }
    });
  };

  const removeSelectedItems = () => {
    if (selectedCourseTimeIds.length === 0) return;

    removeFromCartBulkMutation.mutate({ courseTimeIds: selectedCourseTimeIds }, {
      onSuccess: () => {
        setSelectedCourseTimeIds([]);
      }
    });
  };

  const addFromWishlist = (courseTimeId: number) => {
    addToCartMutation.mutate({ courseTimeId }, {
      onSuccess: () => {
        // 추가된 아이템을 자동으로 선택
        setSelectedCourseTimeIds(prev => [...prev, courseTimeId]);
      }
    });
  };

  // 선택된 아이템들
  const selectedCartItems = useMemo(() =>
    cartItems.filter(item => selectedCourseTimeIds.includes(item.courseTimeId)),
    [cartItems, selectedCourseTimeIds]
  );

  // 로딩 상태
  if (isCartLoading) {
    return (
      <div className={`min-h-screen ${isDark ? 'landing-dark bg-[#1e1e1e]' : 'landing-light bg-gray-50'}`}>
        <LandingHeader />
        <main className="w-full px-4 md:px-8 lg:px-16 py-12">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#6778ff]" />
            <span className={`ml-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              장바구니를 불러오는 중...
            </span>
          </div>
        </main>
        <LandingFooter />
      </div>
    );
  }

  // 에러 상태
  if (cartError) {
    return (
      <div className={`min-h-screen ${isDark ? 'landing-dark bg-[#1e1e1e]' : 'landing-light bg-gray-50'}`}>
        <LandingHeader />
        <main className="w-full px-4 md:px-8 lg:px-16 py-12">
          <div className="text-center py-20">
            <p className={`text-lg ${isDark ? 'text-red-400' : 'text-red-500'}`}>
              장바구니를 불러오는데 실패했습니다.
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

  const isRemoving = removeFromCartMutation.isPending || removeFromCartBulkMutation.isPending;
  const isAdding = addToCartMutation.isPending;

  return (
    <div className={`min-h-screen ${isDark ? 'landing-dark bg-[#1e1e1e]' : 'landing-light bg-gray-50'}`}>
      <LandingHeader />

      <main className="w-full px-4 md:px-8 lg:px-16 py-12">
        <h1 className={`text-3xl md:text-4xl font-bold mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          장바구니
        </h1>

        {cartItems.length === 0 && availableWishlistItems.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingCart className={`w-20 h-20 mx-auto mb-6 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
            <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              장바구니가 비어있습니다
            </h2>
            <p className={`mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              관심 있는 강의를 담아보세요!
            </p>
            <Link
              to="/tu/b2c/courses"
              className="inline-flex items-center gap-2 landing-btn-primary px-6 py-3 rounded-full text-white font-medium"
            >
              강의 둘러보기 <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - Cart Items & Wishlist */}
            <div className="flex-1 space-y-8">
              {/* Cart Items Section */}
              <div>
                {cartItems.length > 0 && (
                  <>
                    {/* Select All */}
                    <div className={`flex items-center justify-between mb-4 pb-4 border-b ${
                      isDark ? 'border-white/10' : 'border-gray-200'
                    }`}>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedCourseTimeIds.length === cartItems.length && cartItems.length > 0}
                          onChange={toggleSelectAll}
                          className="w-5 h-5 rounded border-gray-300 text-[#6778ff] focus:ring-[#6778ff]"
                        />
                        <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          전체 선택 ({selectedCourseTimeIds.length}/{cartItems.length})
                        </span>
                      </label>
                      <button
                        onClick={removeSelectedItems}
                        disabled={selectedCourseTimeIds.length === 0 || isRemoving}
                        className={`text-sm transition-colors disabled:opacity-50 ${
                          isDark ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-500'
                        }`}
                      >
                        {isRemoving ? '삭제 중...' : '선택 삭제'}
                      </button>
                    </div>

                    {/* Cart Items List */}
                    <div className="space-y-4">
                      {cartItems.map((item: CartItemResponse) => (
                        <div
                          key={item.cartItemId}
                          className={`rounded-xl p-4 flex gap-4 border ${
                            isDark
                              ? 'glass border-white/10'
                              : 'bg-white border-gray-200'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedCourseTimeIds.includes(item.courseTimeId)}
                            onChange={() => toggleSelectItem(item.courseTimeId)}
                            className="w-5 h-5 rounded border-gray-300 text-[#6778ff] focus:ring-[#6778ff] mt-1"
                          />
                          <img
                            src={item.thumbnailUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop'}
                            alt={item.courseTimeTitle}
                            className="w-32 h-20 object-cover rounded-lg"
                          />
                          <div className="flex-1 min-w-0">
                            <Link
                              to={`/tu/b2c/times/${item.courseTimeId}`}
                              className={`font-semibold mb-1 line-clamp-1 hover:text-[#6778ff] transition-colors block ${isDark ? 'text-white' : 'text-gray-900'}`}
                            >
                              {item.courseTimeTitle}
                            </Link>
                            <div className="flex items-center gap-2 flex-wrap">
                              {item.level && (
                                <span className={`text-xs px-2 py-0.5 rounded ${
                                  isDark ? 'bg-white/10 text-gray-300' : 'bg-gray-100 text-gray-600'
                                }`}>
                                  {item.level}
                                </span>
                              )}
                              {item.estimatedHours && (
                                <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                  {item.estimatedHours}시간
                                </span>
                              )}
                              {item.isFree ? (
                                <span className={`text-xs px-2 py-0.5 rounded ${
                                  isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-600'
                                }`}>
                                  무료
                                </span>
                              ) : item.price && (
                                <span className={`text-xs font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                  {item.price}
                                </span>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => removeItem(item.courseTimeId)}
                            disabled={isRemoving}
                            className={`p-2 transition-colors disabled:opacity-50 ${
                              isDark ? 'text-gray-400 hover:text-red-400' : 'text-gray-400 hover:text-red-500'
                            }`}
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {cartItems.length === 0 && (
                  <div className={`text-center py-12 rounded-xl border ${
                    isDark ? 'glass border-white/10' : 'bg-white border-gray-200'
                  }`}>
                    <ShoppingCart className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      장바구니가 비어있습니다
                    </p>
                    <p className={`text-sm mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                      아래 찜 목록에서 강의를 추가해보세요!
                    </p>
                  </div>
                )}
              </div>

              {/* Wishlist Section */}
              {availableWishlistItems.length > 0 && (
                <div>
                  <div className={`flex items-center gap-2 mb-4 pb-4 border-b ${
                    isDark ? 'border-white/10' : 'border-gray-200'
                  }`}>
                    <Heart className={`w-5 h-5 ${isDark ? 'text-pink-400' : 'text-pink-500'}`} fill="currentColor" />
                    <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      찜 목록에서 추가하기
                    </h2>
                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      ({availableWishlistItems.length}개)
                    </span>
                  </div>

                  {isWishlistLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-[#6778ff]" />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {availableWishlistItems.map((item: WishlistItemResponse) => (
                        <div
                          key={item.id}
                          className={`rounded-xl p-4 flex gap-4 border ${
                            isDark
                              ? 'glass border-white/10'
                              : 'bg-white border-gray-200'
                          }`}
                        >
                          <img
                            src={item.thumbnailUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop'}
                            alt={item.courseTimeTitle || ''}
                            className="w-28 h-18 object-cover rounded-lg"
                          />
                          <div className="flex-1 min-w-0">
                            <Link
                              to={`/tu/b2c/times/${item.courseTimeId}`}
                              className={`font-semibold mb-1 line-clamp-1 hover:text-[#6778ff] transition-colors block ${isDark ? 'text-white' : 'text-gray-900'}`}
                            >
                              {item.courseTimeTitle}
                            </Link>
                            <div className="flex items-center gap-2 flex-wrap mt-1">
                              {item.level && (
                                <span className={`text-xs px-2 py-0.5 rounded ${
                                  isDark ? 'bg-white/10 text-gray-300' : 'bg-gray-100 text-gray-600'
                                }`}>
                                  {item.level}
                                </span>
                              )}
                              {item.estimatedHours && (
                                <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                  {item.estimatedHours}시간
                                </span>
                              )}
                              {item.isFree ? (
                                <span className={`text-xs px-2 py-0.5 rounded ${
                                  isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-600'
                                }`}>
                                  무료
                                </span>
                              ) : item.price && (
                                <span className={`text-xs font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                  {item.price}
                                </span>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => addFromWishlist(item.courseTimeId)}
                            disabled={isAdding || cartCourseTimeIds.has(item.courseTimeId)}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50 ${
                              cartCourseTimeIds.has(item.courseTimeId)
                                ? isDark
                                  ? 'bg-green-500/20 text-green-400'
                                  : 'bg-green-100 text-green-600'
                                : 'landing-btn-primary text-white'
                            }`}
                          >
                            {cartCourseTimeIds.has(item.courseTimeId) ? (
                              <>
                                <Check className="w-4 h-4" />
                                추가됨
                              </>
                            ) : (
                              <>
                                <Plus className="w-4 h-4" />
                                담기
                              </>
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:w-96">
              <div className={`rounded-2xl p-6 sticky top-24 border ${
                isDark
                  ? 'glass border-white/10'
                  : 'bg-white border-gray-200'
              }`}>
                <h2 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  선택한 강의
                </h2>

                {/* Selected Items Summary */}
                <div className={`space-y-3 mb-6 pb-6 border-b ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                  <div className={`flex justify-between ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    <span>선택 강의</span>
                    <span>{selectedCartItems.length}개</span>
                  </div>
                  {selectedCartItems.length > 0 && (
                    <div className={`text-sm space-y-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                      {selectedCartItems.slice(0, 3).map(item => (
                        <p key={item.cartItemId} className="truncate">
                          • {item.courseTimeTitle}
                        </p>
                      ))}
                      {selectedCartItems.length > 3 && (
                        <p>• 외 {selectedCartItems.length - 3}개</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Checkout Button */}
                <button
                  disabled={selectedCourseTimeIds.length === 0}
                  className="w-full landing-btn-primary py-4 rounded-xl text-white font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {selectedCourseTimeIds.length > 0 ? `${selectedCourseTimeIds.length}개 강의 수강신청` : '강의를 선택해주세요'}
                </button>

                <p className={`text-center text-xs mt-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  수강신청 시 이용약관에 동의하게 됩니다.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <LandingFooter />
    </div>
  );
}
