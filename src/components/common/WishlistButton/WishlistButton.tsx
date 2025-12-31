/**
 * 찜 버튼 컴포넌트
 */

import { Heart } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useCheckWishlistStatus, useToggleWishlist } from '@/hooks/tu/useWishlistQueries';
import { useAuthStore } from '@/store/common/authStore';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/common';

interface WishlistButtonProps {
  courseId: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
  onToggle?: (isWishlisted: boolean) => void;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
};

const iconSizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

export function WishlistButton({
  courseId,
  className,
  size = 'md',
  showTooltip = true,
  onToggle,
}: WishlistButtonProps) {
  const { isAuthenticated } = useAuthStore();
  const { data: isWishlisted = false, isLoading: isChecking } = useCheckWishlistStatus(
    courseId,
    isAuthenticated
  );
  const { toggle, isLoading: isToggling } = useToggleWishlist();

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      return;
    }

    try {
      await toggle(courseId, isWishlisted);
      onToggle?.(!isWishlisted);
    } catch (error) {
      console.error('Failed to toggle wishlist:', error);
    }
  };

  const isLoading = isChecking || isToggling;

  const button = (
    <button
      onClick={handleClick}
      disabled={isLoading || !isAuthenticated}
      className={cn(
        'flex items-center justify-center rounded-full transition-all duration-200',
        'hover:scale-110 active:scale-95',
        'focus:outline-none focus:ring-2 focus:ring-primary/50',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
        isWishlisted
          ? 'bg-red-50 dark:bg-red-500/20 text-red-500'
          : 'bg-gray-100 dark:bg-white/10 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400',
        sizeClasses[size],
        className
      )}
      aria-label={isWishlisted ? '찜 해제' : '찜하기'}
    >
      <Heart
        className={cn(
          iconSizeClasses[size],
          'transition-all duration-200',
          isWishlisted && 'fill-current'
        )}
      />
    </button>
  );

  if (!showTooltip) {
    return button;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent>
          <p>{!isAuthenticated ? '로그인이 필요합니다' : isWishlisted ? '찜 해제' : '찜하기'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
