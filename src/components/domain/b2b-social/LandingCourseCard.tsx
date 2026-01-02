import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Video, BookOpen, FileText, Clock, Users } from 'lucide-react';
import { useTranslation } from '@/store/common/languageStore';

type ContentType = 'VOD' | 'EBOOK' | 'DOCUMENT';

interface LandingCourseCardProps {
  id: number;
  title: string;
  image: string;
  tags?: string[];
  instructor?: string;
  contentType?: ContentType;
  duration?: number; // 학습 시간 (분)
  enrollmentCount?: number; // 수강생 수
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

export const LandingCourseCard = ({
  id,
  title,
  image,
  tags = [],
  instructor,
  contentType,
  duration,
  enrollmentCount,
}: LandingCourseCardProps) {
  const { language } = useTranslation();
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
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

          {/* 콘텐츠 유형 아이콘 */}
          {contentType && (
            <div className="absolute top-3 left-3 bg-black/50 rounded-full p-1.5">
              <ContentTypeIcon type={contentType} />
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
          {/* 해시태그 스타일 태그 */}
          {tags.length > 0 && (
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

          {/* 학습 시간 & 수강생 수 */}
          {(duration !== undefined || enrollmentCount !== undefined) && (
            <div className="flex items-center gap-3 text-xs landing-text-muted pt-1">
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
        </div>
      </div>
    </Link>
  );
}
