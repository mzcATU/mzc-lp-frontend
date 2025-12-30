import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingCart, ChevronRight, Tag, Loader2 } from 'lucide-react';
import { useThemeStore } from '@/store/common/themeStore';
import { LandingHeader } from '@/components/landing/LandingHeader';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { useCart, useRemoveFromCart, useApplyCoupon } from '@/hooks/tu';
import type { CartItem } from '@/types/tu';

// 환경 설정: true면 API 사용, false면 더미 데이터 사용
const USE_API = false;

// 더미 장바구니 데이터
const MOCK_CART_ITEMS: CartItem[] = [
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
    totalHours: 32,
    isSelected: true,
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
    totalHours: 28,
    isSelected: true,
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
    totalHours: 24,
    isSelected: true,
  },
];

export function CartPage() {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  // React Query 훅 (API 모드일 때만 활성화)
  const { data: apiCartData, isLoading, error } = useCart(USE_API);
  const removeFromCartMutation = useRemoveFromCart();
  const applyCouponMutation = useApplyCoupon();

  // 로컬 상태 (Mock 모드에서 사용)
  const [mockCartItems, setMockCartItems] = useState(MOCK_CART_ITEMS);
  const [couponCode, setCouponCode] = useState('');

  // 실제 사용할 데이터 결정
  const cartItems = USE_API ? (apiCartData?.items || []) : mockCartItems;

  // 선택 상태 관리
  const [selectedItems, setSelectedItems] = useState<number[]>(() =>
    cartItems.map(item => item.id)
  );

  // 선택된 아이템 동기화
  useMemo(() => {
    if (cartItems.length > 0 && selectedItems.length === 0) {
      setSelectedItems(cartItems.map(item => item.id));
    }
  }, [cartItems, selectedItems.length]);

  const toggleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map(item => item.id));
    }
  };

  const toggleSelectItem = (id: number) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(itemId => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const removeItem = (id: number) => {
    if (USE_API) {
      removeFromCartMutation.mutate({ itemIds: [id] });
    } else {
      setMockCartItems(mockCartItems.filter(item => item.id !== id));
    }
    setSelectedItems(selectedItems.filter(itemId => itemId !== id));
  };

  const removeSelectedItems = () => {
    if (USE_API) {
      removeFromCartMutation.mutate({ itemIds: selectedItems });
    } else {
      setMockCartItems(mockCartItems.filter(item => !selectedItems.includes(item.id)));
    }
    setSelectedItems([]);
  };

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;

    if (USE_API) {
      applyCouponMutation.mutate({ couponCode: couponCode.trim() });
    } else {
      // Mock 모드에서는 알림만 표시
      alert(`쿠폰 코드 "${couponCode}" 적용 (데모)`);
    }
  };

  // 가격 계산
  const selectedCartItems = cartItems.filter(item => selectedItems.includes(item.id));
  const totalOriginalPrice = selectedCartItems.reduce((sum, item) => sum + item.originalPrice, 0);
  const totalPrice = selectedCartItems.reduce((sum, item) => sum + item.price, 0);
  const totalDiscount = totalOriginalPrice - totalPrice;

  // 로딩 상태
  if (USE_API && isLoading) {
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
  if (USE_API && error) {
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

  return (
    <div className={`min-h-screen ${isDark ? 'landing-dark bg-[#1e1e1e]' : 'landing-light bg-gray-50'}`}>
      <LandingHeader />

      <main className="w-full px-4 md:px-8 lg:px-16 py-12">
        <h1 className={`text-3xl md:text-4xl font-bold mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          장바구니
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingCart className={`w-20 h-20 mx-auto mb-6 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
            <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              장바구니가 비어있습니다
            </h2>
            <p className={`mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              관심 있는 강의를 담아보세요!
            </p>
            <Link
              to="/tu/main/courses"
              className="inline-flex items-center gap-2 landing-btn-primary px-6 py-3 rounded-full text-white font-medium"
            >
              강의 둘러보기 <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="flex-1">
              {/* Select All */}
              <div className={`flex items-center justify-between mb-4 pb-4 border-b ${
                isDark ? 'border-white/10' : 'border-gray-200'
              }`}>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === cartItems.length}
                    onChange={toggleSelectAll}
                    className="w-5 h-5 rounded border-gray-300 text-[#6778ff] focus:ring-[#6778ff]"
                  />
                  <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    전체 선택 ({selectedItems.length}/{cartItems.length})
                  </span>
                </label>
                <button
                  onClick={removeSelectedItems}
                  disabled={selectedItems.length === 0 || removeFromCartMutation.isPending}
                  className={`text-sm transition-colors disabled:opacity-50 ${
                    isDark ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-500'
                  }`}
                >
                  선택 삭제
                </button>
              </div>

              {/* Items List */}
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className={`rounded-xl p-4 flex gap-4 border ${
                      isDark
                        ? 'glass border-white/10'
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => toggleSelectItem(item.id)}
                      className="w-5 h-5 rounded border-gray-300 text-[#6778ff] focus:ring-[#6778ff] mt-1"
                    />
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-32 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-semibold mb-1 line-clamp-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {item.title}
                      </h3>
                      <p className={`text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {item.instructor}
                      </p>
                      <div className="flex items-center gap-2">
                        {item.discount > 0 && (
                          <>
                            <span className="text-[#6778ff] font-bold">{item.discount}%</span>
                            <span className={`line-through text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                              {item.originalPrice.toLocaleString()}원
                            </span>
                          </>
                        )}
                        <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {item.price.toLocaleString()}원
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      disabled={removeFromCartMutation.isPending}
                      className={`p-2 transition-colors disabled:opacity-50 ${
                        isDark ? 'text-gray-400 hover:text-red-400' : 'text-gray-400 hover:text-red-500'
                      }`}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:w-96">
              <div className={`rounded-2xl p-6 sticky top-24 border ${
                isDark
                  ? 'glass border-white/10'
                  : 'bg-white border-gray-200'
              }`}>
                <h2 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  결제 정보
                </h2>

                {/* Coupon */}
                <div className="mb-6">
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    쿠폰 코드
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <Tag className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                        isDark ? 'text-gray-500' : 'text-gray-400'
                      }`} />
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="쿠폰 코드 입력"
                        className={`w-full rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#6778ff] ${
                          isDark
                            ? 'bg-white/5 border border-white/10 text-white placeholder-gray-500'
                            : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400'
                        }`}
                      />
                    </div>
                    <button
                      onClick={handleApplyCoupon}
                      disabled={applyCouponMutation.isPending}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
                        isDark
                          ? 'bg-white/10 text-white hover:bg-white/20'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {applyCouponMutation.isPending ? '적용 중...' : '적용'}
                    </button>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className={`space-y-3 mb-6 pb-6 border-b ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                  <div className={`flex justify-between ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    <span>선택 강의 ({selectedItems.length}개)</span>
                    <span>{totalOriginalPrice.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between text-[#6778ff]">
                    <span>할인 금액</span>
                    <span>-{totalDiscount.toLocaleString()}원</span>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center mb-6">
                  <span className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    총 결제 금액
                  </span>
                  <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {totalPrice.toLocaleString()}원
                  </span>
                </div>

                {/* Checkout Button */}
                <button
                  disabled={selectedItems.length === 0}
                  className="w-full landing-btn-primary py-4 rounded-xl text-white font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {selectedItems.length > 0 ? `${selectedItems.length}개 강의 결제하기` : '강의를 선택해주세요'}
                </button>

                <p className={`text-center text-xs mt-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  결제 시 이용약관 및 환불 정책에 동의하게 됩니다.
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
