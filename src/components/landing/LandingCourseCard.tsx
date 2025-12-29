import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, Video, BookOpen, FileText, Clock, Users } from 'lucide-react';
import { useTranslation } from '@/store/common/languageStore';

type ContentType = 'VOD' | 'EBOOK' | 'DOCUMENT';

interface LandingCourseCardProps {
  id: number;
  title: string;
  image: string;
  tags?: string[];
  category?: string;

  // 조건부 표시 (값 있으면 표시)
  instructor?: string;
  price?: string;              // B2C
  rating?: number;             // B2C
  reviewCount?: number;        // B2C
  contentType?: ContentType;   // B2B - 콘텐츠 유형 아이콘
  duration?: number;           // B2B - 학습 시간 (분)
  enrollmentCount?: number;    // B2B - 수강생 수

  // 태그 스타일
  tagStyle?: 'BADGE' | 'HASHTAG';
}

// 콘텐츠 유형 아이콘 매핑
const ContentTypeIcon = ({ type }: { type: ContentType }) => {
  const iconClass = 'w-5 h-5 text-white drop-shadow-md';
  switch (type) {
    case 'VOD':
      return <Video className={iconClass} />;
    case 'EBOOK':
      return <BookOpen className={iconClass} />;
    case 'DOCUMENT':
      return <FileText className={iconClass} />;
  }
};

export function LandingCourseCard({
  id,
  title,
  image,
  tags = [],
  instructor,
  price,
  rating,
  reviewCount,
  contentType,
  duration,
  enrollmentCount,
  tagStyle = 'BADGE',
}: LandingCourseCardProps) {
  const { t, language } = useTranslation();
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    // TODO: API 연동 시 실제 찜 추가/삭제 로직 구현
  };

  // 태그 번역 매핑 (BADGE 스타일용)
  const getTagLabel = (tag: string) => {
    if (tag === 'NEW') return t.landing.tagNew;
    if (tag === '베스트') return t.landing.tagBest;
    if (tag === '할인중') return t.landing.tagSale;
    return tag;
  };

  // 수강생 수 포맷
  const formatStudentCount = (count: number) => {
    const displayCount = count > 100 ? '100+' : count.toString();
    return language === 'ko' ? `+${displayCount}명` : `${displayCount}+ students`;
  };

  // 학습 시간 포맷 (분 → 시간/분)
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (language === 'ko') {
      return hours > 0 ? `${hours}시간 ${mins}분` : `${mins}분`;
    }
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  // BADGE 스타일 태그 색상
  const getBadgeStyle = (tag: string) => {
    if (tag === 'NEW') return 'bg-gradient-to-r from-[#70f2a0] to-[#6bc2f0]';
    if (tag === '베스트') return 'bg-gradient-to-r from-[#6778ff] to-[#a855f7]';
    return 'bg-gradient-to-r from-[#ff7867] to-[#ff9a5a]';
  };

  return (
    <Link to={`/tu/main/courses/${id}`} className="group block h-full">
      <div className="h-full card-hover rounded-xl overflow-hidden landing-card-bg border landing-card-border">
        {/* Image Container */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* 콘텐츠 유형 아이콘 (B2B) */}
          {contentType && (
            <div className="absolute top-3 right-3 bg-black/50 rounded-full p-1.5">
              <ContentTypeIcon type={contentType} />
            </div>
          )}

          {/* BADGE 스타일 태그 (B2C) - 이미지 위 */}
          {tagStyle === 'BADGE' && tags.length > 0 && (
            <div className="absolute top-3 left-3 flex gap-1.5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className={`text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg ${getBadgeStyle(tag)}`}
                >
                  {getTagLabel(tag)}
                </span>
              ))}
            </div>
          )}
          {/* 찜 버튼 */}
          <button
            onClick={handleWishlistToggle}
            className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-300 ${
              isWishlisted
                ? 'bg-red-500 text-white'
                : 'bg-black/50 text-white hover:bg-red-500'
            }`}
            aria-label={isWishlisted ? '찜 해제' : '찜하기'}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-2">
          {/* HASHTAG 스타일 태그 (B2B) - 콘텐츠 영역 상단 */}
          {tagStyle === 'HASHTAG' && tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] text-[#6778ff] landing-badge-bg px-2 py-0.5 rounded"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <h3 className="font-bold landing-text-primary line-clamp-2 text-[15px] group-hover:text-[#6778ff] transition-colors h-11">
            {title}
          </h3>

          {instructor && (
            <div className="text-xs landing-text-muted">{instructor}</div>
          )}

          {/* 평점 (B2C) */}
          {rating !== undefined && (
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
              {reviewCount !== undefined && (
                <span className="landing-text-muted">({reviewCount.toLocaleString()})</span>
              )}
            </div>
          )}

          {/* 학습 시간 & 수강생 수 (B2B) */}
          {(duration !== undefined || enrollmentCount !== undefined) && (
            <div className="flex items-center gap-3 text-xs landing-text-muted">
              {duration !== undefined && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {formatDuration(duration)}
                </span>
              )}
              {enrollmentCount !== undefined && (
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  {enrollmentCount.toLocaleString()}{language === 'ko' ? '명' : ''}
                </span>
              )}
            </div>
          )}

          {/* 가격 & 수강생 수 (B2C) */}
          {price && (
            <div className="pt-2 flex items-center justify-between">
              <span className="font-bold text-[#6778ff] text-lg">{price}</span>
              {reviewCount !== undefined && (
                <div className="flex gap-1.5">
                  <span className="landing-badge-bg landing-text-muted text-[10px] px-2 py-1 rounded-full">
                    {formatStudentCount(reviewCount)}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
