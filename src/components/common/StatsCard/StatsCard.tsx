"use client";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

import { cn } from '@/utils/cn';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/Card';
import type { StatsCardProps, StatsGridProps, MiniStatsProps } from './StatsCard.types';

function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
  valueClassName,
}: StatsCardProps) {
  const getTrendIcon = () => {
    if (!trend) return null;
    if (trend.value > 0) return <TrendingUp className="h-4 w-4" />;
    if (trend.value < 0) return <TrendingDown className="h-4 w-4" />;
    return <Minus className="h-4 w-4" />;
  };

  const getTrendColor = () => {
    if (!trend) return "";
    if (trend.value > 0) return "text-status-success";
    if (trend.value < 0) return "text-status-error";
    return "text-text-secondary";
  };

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-text-secondary" />}
      </CardHeader>
      <CardContent>
        <div className={cn("text-2xl font-bold", valueClassName)}>{value}</div>
        {(description || trend) && (
          <div className="flex items-center gap-2 text-xs text-text-secondary mt-1">
            {trend && (
              <span className={cn("flex items-center gap-1", getTrendColor())}>
                {getTrendIcon()}
                {trend.value > 0 ? "+" : ""}
                {trend.value}%
              </span>
            )}
            {description && <span>{description}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Stats card grid for dashboard
function StatsGrid({ children, columns = 4, className }: StatsGridProps) {
  const gridCols = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={cn("grid gap-4", gridCols[columns], className)}>
      {children}
    </div>
  );
}

// Mini stats for inline display
function MiniStats({ label, value, trend, className }: MiniStatsProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      <span className="text-xs text-text-secondary">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-lg font-semibold">{value}</span>
        {trend !== undefined && (
          <span
            className={cn(
              "text-xs flex items-center",
              trend > 0 ? "text-status-success" : trend < 0 ? "text-status-error" : "text-text-secondary"
            )}
          >
            {trend > 0 ? (
              <TrendingUp className="h-3 w-3 mr-0.5" />
            ) : trend < 0 ? (
              <TrendingDown className="h-3 w-3 mr-0.5" />
            ) : null}
            {trend > 0 ? "+" : ""}
            {trend}%
          </span>
        )}
      </div>
    </div>
  );
}

export { StatsCard, StatsGrid, MiniStats };
