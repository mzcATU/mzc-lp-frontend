import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

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
  return (
    <Link to={`/tu/catalog/${id}`} className="group block h-full">
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
                        : 'bg-gradient-to-r from-[#ff7867] to-[#ff9a5a]'
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
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
                +{reviewCount > 100 ? '100' : reviewCount}명
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
