"use client";

import * as React from "react";
import { type LucideIcon } from "lucide-react";

import { cn } from "./utils";

interface TimelineItemProps {
  title: string;
  description?: string;
  time?: string;
  icon?: LucideIcon;
  iconClassName?: string;
  isLast?: boolean;
  children?: React.ReactNode;
}

function TimelineItem({
  title,
  description,
  time,
  icon: Icon,
  iconClassName,
  isLast = false,
  children,
}: TimelineItemProps) {
  return (
    <div className="relative flex gap-4 pb-8 last:pb-0">
      {/* Line */}
      {!isLast && (
        <div className="absolute left-[15px] top-[30px] h-[calc(100%-30px)] w-[2px] bg-border" />
      )}

      {/* Icon */}
      <div
        className={cn(
          "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 bg-background",
          iconClassName
        )}
      >
        {Icon && <Icon className="h-4 w-4" />}
      </div>

      {/* Content */}
      <div className="flex-1 pt-0.5">
        <div className="flex items-center justify-between gap-2">
          <h4 className="text-sm font-medium">{title}</h4>
          {time && (
            <time className="text-xs text-muted-foreground">{time}</time>
          )}
        </div>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
        {children && <div className="mt-2">{children}</div>}
      </div>
    </div>
  );
}

interface TimelineProps {
  children: React.ReactNode;
  className?: string;
}

function Timeline({ children, className }: TimelineProps) {
  const items = React.Children.toArray(children);

  return (
    <div className={cn("space-y-0", className)}>
      {items.map((child, index) => {
        if (React.isValidElement<TimelineItemProps>(child)) {
          return React.cloneElement(child, {
            isLast: index === items.length - 1,
          });
        }
        return child;
      })}
    </div>
  );
}

// Horizontal timeline variant
interface HorizontalTimelineItemProps {
  title: string;
  description?: string;
  isActive?: boolean;
  isCompleted?: boolean;
  isLast?: boolean;
}

function HorizontalTimelineItem({
  title,
  description,
  isActive = false,
  isCompleted = false,
  isLast = false,
}: HorizontalTimelineItemProps) {
  return (
    <div className="flex-1 flex flex-col items-center">
      <div className="relative flex items-center w-full">
        {/* Line before */}
        <div
          className={cn(
            "flex-1 h-[2px]",
            isCompleted || isActive ? "bg-primary" : "bg-border"
          )}
        />

        {/* Circle */}
        <div
          className={cn(
            "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
            isCompleted
              ? "border-primary bg-primary text-primary-foreground"
              : isActive
              ? "border-primary bg-background"
              : "border-border bg-background"
          )}
        >
          {isCompleted ? (
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : null}
        </div>

        {/* Line after */}
        {!isLast && (
          <div
            className={cn(
              "flex-1 h-[2px]",
              isCompleted ? "bg-primary" : "bg-border"
            )}
          />
        )}
        {isLast && <div className="flex-1" />}
      </div>

      {/* Label */}
      <div className="mt-3 text-center">
        <p
          className={cn(
            "text-sm font-medium",
            isActive && "text-primary"
          )}
        >
          {title}
        </p>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
    </div>
  );
}

interface HorizontalTimelineProps {
  children: React.ReactNode;
  className?: string;
}

function HorizontalTimeline({ children, className }: HorizontalTimelineProps) {
  const items = React.Children.toArray(children);

  return (
    <div className={cn("flex", className)}>
      {items.map((child, index) => {
        if (React.isValidElement<HorizontalTimelineItemProps>(child)) {
          return React.cloneElement(child, {
            isLast: index === items.length - 1,
          });
        }
        return child;
      })}
    </div>
  );
}

export {
  Timeline,
  TimelineItem,
  HorizontalTimeline,
  HorizontalTimelineItem,
};
export type {
  TimelineProps,
  TimelineItemProps,
  HorizontalTimelineProps,
  HorizontalTimelineItemProps,
};
