import { Link, useNavigate } from 'react-router-dom';
import { Star, Heart, Loader2 } from 'lucide-react';
import { useTranslation } from '@/store/common/languageStore';
import { useAuthStore } from '@/store/common/authStore';
import { useCheckWishlistStatus, useToggleWishlist } from '@/hooks/tu';
import { toast } from 'sonner';

interface LandingCourseCardProps {
  id: number;
  title: string;
  instructor: string;
  price: string;
  rating: number;
  reviewCount: number;
  image: string;
  tags: string[];
  category: string;
}

export function LandingCourseCard({
  id,
  title,
  instructor,
  price,
  rating,
  reviewCount,
  image,
  tags,
}: LandingCourseCardProps) {
  const { t, language } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  // 찜 상태 확인 및 토글
  const { data: isWishlisted = false, isLoading: isWishlistChecking } = useCheckWishlistStatus(
    id,
    isAuthenticated
  );
  const { toggle: toggleWishlist, isLoading: isWishlistToggling } = useToggleWishlist();

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('로그인이 필요합니다.');
      navigate('/auth/login', { state: { from: `/tu/b2c/times/${id}` } });
      return;
    }

    try {
      await toggleWishlist(id, isWishlisted);
      toast.success(isWishlisted ? '찜 목록에서 제거되었습니다.' : '찜 목록에 추가되었습니다.');
    } catch {
      toast.error('찜 목록 변경에 실패했습니다.');
    }
  };

  const isWishlistLoading = isWishlistChecking || isWishlistToggling;

  // 태그 번역 매핑
  const getTagLabel = (tag: string) => {
    if (tag === 'NEW') return t.landing.tagNew;
    if (tag === '베스트') return t.landing.tagBest;
    if (tag === '할인중') return t.landing.tagSale;
    if (tag === '상시모집') return '상시모집';
    if (tag === '모집중') return '모집중';
    if (tag === '무료') return '무료';
    return tag;
  };

  // 수강생 수 포맷
  const formatStudentCount = (count: number) => {
    const displayCount = count > 100 ? '100+' : count.toString();
    return language === 'ko' ? `+${displayCount}명` : `${displayCount}+ students`;
  };

  return (
    <Link to={`/tu/b2c/courses/${id}`} className="group block h-full">
      <div className="h-full card-hover rounded-xl overflow-hidden landing-card-bg border landing-card-border">
        {/* Image Container */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          {tags.length > 0 && (
            <div className="absolute top-3 left-3 flex gap-1.5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className={`text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg ${
                    tag === 'NEW'
                      ? 'bg-gradient-to-r from-[#70f2a0] to-[#6bc2f0]'
                      : tag === '베스트'
                        ? 'bg-gradient-to-r from-[#6778ff] to-[#a855f7]'
                        : tag === '상시모집'
                          ? 'bg-gradient-to-r from-[#70f2a0] to-[#6bc2f0]'
                          : tag === '모집중'
                            ? 'bg-gradient-to-r from-[#6778ff] to-[#a855f7]'
                            : tag === '무료'
                              ? 'bg-gradient-to-r from-[#ff7867] to-[#ff9a5a]'
                              : 'bg-gradient-to-r from-[#ff7867] to-[#ff9a5a]'
                  }`}
                >
                  {getTagLabel(tag)}
                </span>
              ))}
            </div>
          )}
          {/* 찜 버튼 */}
          <button
            onClick={handleWishlistToggle}
            disabled={isWishlistLoading}
            className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-300 disabled:opacity-50 ${
              isWishlisted
                ? 'bg-red-500 text-white'
                : 'bg-black/50 text-white hover:bg-red-500'
            }`}
            aria-label={isWishlisted ? '찜 해제' : '찜하기'}
          >
            {isWishlistLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
            )}
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-2">
          <h3 className="font-bold landing-text-primary line-clamp-2 text-[15px] group-hover:text-[#6778ff] transition-colors h-11">
            {title}
          </h3>

          <div className="text-xs landing-text-muted">{instructor}</div>

          <div className="flex items-center gap-1.5 text-xs">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'landing-text-muted'}`}
                />
              ))}
            </div>
            <span className="font-bold landing-text-primary">{rating}</span>
            <span className="landing-text-muted">({reviewCount.toLocaleString()})</span>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="font-bold text-[#6778ff] text-lg">{price}</span>
            <div className="flex gap-1.5">
              <span className="landing-badge-bg landing-text-muted text-[10px] px-2 py-1 rounded-full">
                {formatStudentCount(reviewCount)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
