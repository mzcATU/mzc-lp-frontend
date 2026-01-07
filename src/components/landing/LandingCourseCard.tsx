import { Link, useNavigate } from 'react-router-dom';
import { Star, Heart, Loader2, Calendar, Users } from 'lucide-react';
import { useAuthStore } from '@/store/common/authStore';
import { useSubdomainPath } from '@/hooks/common';
import { useCheckWishlistStatus, useToggleWishlist } from '@/hooks/tu';
import { toast } from 'sonner';

interface LandingCourseCardProps {
  id: number;
  title: string;
  instructor: string;
  price: string | null; // null이면 표시 안함 (무료)
  rating: number;
  reviewCount: number; // 리뷰 수
  studentCount: number; // 참여자 수
  image: string;
  tags: string[];
  category: string;
  // 추가 정보
  deliveryType?: string; // 운영 방식 (온라인, 오프라인 등)
  level?: string; // 레벨 (입문, 초급 등)
  classStartDate?: string; // 개강일
  availableSeats?: number | null; // 잔여석
  isOnDemand?: boolean; // 상시모집 여부
}

/**
 * 날짜 포맷팅 (M/D)
 */
function formatShortDate(dateString: string): string {
  const date = new Date(dateString);
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

export function LandingCourseCard({
  id,
  title,
  instructor,
  price,
  rating,
  reviewCount,
  studentCount,
  image,
  tags,
  deliveryType,
  level,
  classStartDate,
  availableSeats,
  isOnDemand,
}: LandingCourseCardProps) {
  const navigate = useNavigate();
  const { prefixPath } = useSubdomainPath();
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
      navigate('/login', { state: { from: prefixPath(`/tu/b2c/courses/${id}`) } });
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

  // 태그 스타일 매핑
  const getTagStyle = (tag: string) => {
    switch (tag) {
      case '상시모집':
        return 'bg-gradient-to-r from-[#70f2a0] to-[#6bc2f0]';
      case '모집중':
        return 'bg-gradient-to-r from-[#6778ff] to-[#a855f7]';
      case '진행중':
        return 'bg-gray-500';
      case 'NEW':
        return 'bg-gradient-to-r from-[#70f2a0] to-[#6bc2f0]';
      case '베스트':
        return 'bg-gradient-to-r from-[#6778ff] to-[#a855f7]';
      default:
        return 'bg-gradient-to-r from-[#ff7867] to-[#ff9a5a]';
    }
  };

  return (
    <Link to={prefixPath(`/tu/b2c/courses/${id}`)} className="group block h-full">
      <div className="h-full card-hover rounded-xl overflow-hidden landing-card-bg border landing-card-border">
        {/* 썸네일 영역 */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* 좌측 상단: 상태 뱃지 */}
          {tags.length > 0 && (
            <div className="absolute top-3 left-3 flex gap-1.5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className={`text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg ${getTagStyle(tag)}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* 우측 상단: 찜 버튼 */}
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

        {/* 정보 영역 */}
        <div className="p-4 space-y-2">
          {/* 제목 (2줄 말줄임) */}
          <h3 className="font-bold landing-text-primary line-clamp-2 text-[15px] group-hover:text-[#6778ff] transition-colors h-11">
            {title}
          </h3>

          {/* 강사명 */}
          <div className="text-xs landing-text-muted">{instructor}</div>

          {/* 별점 + 리뷰 수 (항상 표시) */}
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

          {/* 메타 정보 (운영방식 · 레벨) */}
          <div className="flex items-center gap-2 text-xs">
            {deliveryType && (
              <span className="landing-badge-bg landing-text-muted px-2 py-0.5 rounded">
                {deliveryType}
              </span>
            )}
            {level && (
              <span className="landing-text-muted">{level}</span>
            )}
          </div>

          {/* 개강일 및 잔여석 (상시모집이 아닌 경우만) */}
          {!isOnDemand && classStartDate && (
            <div className="flex items-center gap-1 text-xs landing-text-muted">
              <Calendar className="w-3 h-3" />
              <span>{formatShortDate(classStartDate)} 개강</span>
              {availableSeats !== null && availableSeats !== undefined && (
                <span className="ml-2 text-orange-500 font-medium">
                  잔여 {availableSeats}석
                </span>
              )}
            </div>
          )}
        </div>

        {/* 하단 푸터 (가격 + 참여자 수) */}
        <div className="px-4 pb-4 flex items-center justify-between">
          {price ? (
            <span className="font-bold text-[#6778ff] text-lg">{price}</span>
          ) : (
            <span />
          )}
          <div className="flex items-center gap-1 text-xs landing-text-muted">
            <Users className="w-3.5 h-3.5" />
            <span>{studentCount.toLocaleString()}명</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
