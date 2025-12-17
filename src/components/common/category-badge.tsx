"use client";

import { cn } from "./utils";

interface CategoryBadgeProps {
  category: string;
  className?: string;
}

const categoryColors: Record<string, { bg: string; text: string }> = {
  '프로그래밍': { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300' },
  '백엔드': { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-300' },
  '개발 도구': { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-300' },
  '프론트엔드': { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-300' },
  '데이터베이스': { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-300' },
  '클라우드': { bg: 'bg-cyan-100 dark:bg-cyan-900/30', text: 'text-cyan-700 dark:text-cyan-300' },
  'DevOps': { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-300' },
};

const defaultColors = { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-700 dark:text-gray-300' };

function CategoryBadge({ category, className }: CategoryBadgeProps) {
  const colors = categoryColors[category] || defaultColors;

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium",
        colors.bg,
        colors.text,
        className
      )}
    >
      {category}
    </span>
  );
}

export { CategoryBadge };
export type { CategoryBadgeProps };
