/**
 * 별점 입력/표시 컴포넌트
 */

import { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  /** 현재 별점 값 (1-5) */
  value: number;
  /** 별점 변경 시 호출 (readonly가 아닐 때) */
  onChange?: (rating: number) => void;
  /** 읽기 전용 여부 */
  readonly?: boolean;
  /** 별 크기 */
  size?: 'sm' | 'md' | 'lg';
  /** 다크모드 여부 */
  isDark?: boolean;
  /** 별점 숫자 표시 여부 */
  showValue?: boolean;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

const textSizeClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

export function StarRating({
  value,
  onChange,
  readonly = false,
  size = 'md',
  isDark = false,
  showValue = false,
}: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const displayValue = hoverValue ?? value;

  const handleClick = (rating: number) => {
    if (!readonly && onChange) {
      onChange(rating);
    }
  };

  const handleMouseEnter = (rating: number) => {
    if (!readonly) {
      setHoverValue(rating);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverValue(null);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            type="button"
            onClick={() => handleClick(rating)}
            onMouseEnter={() => handleMouseEnter(rating)}
            onMouseLeave={handleMouseLeave}
            disabled={readonly}
            className={`${
              readonly ? 'cursor-default' : 'cursor-pointer'
            } transition-transform ${!readonly && 'hover:scale-110'}`}
          >
            <Star
              className={`${sizeClasses[size]} ${
                rating <= displayValue
                  ? 'fill-yellow-400 text-yellow-400'
                  : isDark
                    ? 'text-gray-600'
                    : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
      {showValue && (
        <span
          className={`${textSizeClasses[size]} font-medium ml-1 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}
        >
          {value.toFixed(1)}
        </span>
      )}
    </div>
  );
}
