/**
 * TimePicker 컴포넌트
 *
 * Shadcn UI 스타일의 시간 선택 컴포넌트
 * - 키보드 직접 입력 지원 (HH:MM 형식)
 * - 드롭다운에서 빠른 선택 가능
 * - 입력 중 자동 포맷팅 (숫자만 입력하면 자동으로 : 삽입)
 *
 * @example
 * ```tsx
 * <TimePicker
 *   value="14:30"
 *   onChange={(time) => console.log(time)}
 *   placeholder="시간 선택"
 * />
 * ```
 */

"use client";

import * as React from "react";
import { Clock, ChevronDown } from "lucide-react";

import { cn } from "@/utils/cn";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/common/Popover";
import { ScrollArea } from "@/components/common/ScrollArea";

export interface TimePickerProps {
  /** 선택된 시간 (HH:mm 형식) */
  value?: string;
  /** 시간 변경 콜백 */
  onChange?: (time: string) => void;
  /** placeholder 텍스트 */
  placeholder?: string;
  /** 비활성화 여부 */
  disabled?: boolean;
  /** 추가 클래스명 */
  className?: string;
  /** 드롭다운 시간 간격 (분 단위, 기본 30분) */
  interval?: 15 | 30 | 60;
  /** 시작 시간 (기본 "00:00") */
  minTime?: string;
  /** 종료 시간 (기본 "23:59") */
  maxTime?: string;
}

// 시간 옵션 생성 함수
function generateTimeOptions(
  interval: number,
  minTime: string,
  maxTime: string
): string[] {
  const options: string[] = [];
  const [minHour, minMinute] = minTime.split(":").map(Number);
  const [maxHour, maxMinute] = maxTime.split(":").map(Number);

  const minTotalMinutes = minHour * 60 + minMinute;
  const maxTotalMinutes = maxHour * 60 + maxMinute;

  for (let minutes = minTotalMinutes; minutes <= maxTotalMinutes; minutes += interval) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours < 24) {
      options.push(
        `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`
      );
    }
  }

  return options;
}

// 시간을 보기 좋게 포맷 (24시간 -> 오전/오후)
function formatTimeDisplay(time: string): string {
  if (!time || !time.includes(":")) return time;
  const [hours, minutes] = time.split(":").map(Number);
  if (isNaN(hours) || isNaN(minutes)) return time;
  const period = hours < 12 ? "오전" : "오후";
  const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  return `${period} ${displayHour}:${minutes.toString().padStart(2, "0")}`;
}

// 입력값을 HH:mm 형식으로 정규화
function normalizeTimeInput(input: string): string {
  // 숫자만 추출
  const digits = input.replace(/\D/g, "");

  if (digits.length === 0) return "";
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) {
    const hours = digits.slice(0, 2);
    const minutes = digits.slice(2);
    return `${hours}:${minutes}`;
  }
  // 4자리 초과시 앞 4자리만 사용
  const hours = digits.slice(0, 2);
  const minutes = digits.slice(2, 4);
  return `${hours}:${minutes}`;
}

// 유효한 시간인지 확인
function isValidTime(time: string): boolean {
  if (!time || !time.includes(":")) return false;
  const [hours, minutes] = time.split(":").map(Number);
  return !isNaN(hours) && !isNaN(minutes) &&
         hours >= 0 && hours <= 23 &&
         minutes >= 0 && minutes <= 59;
}

// 시간을 HH:mm 형식으로 패딩
function padTime(time: string): string {
  if (!time.includes(":")) return time;
  const [hours, minutes] = time.split(":");
  const h = hours.padStart(2, "0");
  const m = (minutes || "00").padStart(2, "0");
  return `${h}:${m}`;
}

export function TimePicker({
  value,
  onChange,
  placeholder = "HH:MM",
  disabled = false,
  className,
  interval = 30,
  minTime = "00:00",
  maxTime = "23:30",
}: TimePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(value || "");
  const [isEditing, setIsEditing] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const timeOptions = React.useMemo(
    () => generateTimeOptions(interval, minTime, maxTime),
    [interval, minTime, maxTime]
  );

  // 외부 value 변경 시 inputValue 동기화 (편집 중이 아닐 때만)
  React.useEffect(() => {
    if (value !== undefined && !isEditing) {
      setInputValue(value);
    }
  }, [value, isEditing]);

  // 선택된 시간으로 스크롤
  React.useEffect(() => {
    if (open && value && scrollRef.current) {
      // 정확히 일치하는 시간 또는 가장 가까운 시간으로 스크롤
      const exactMatch = scrollRef.current.querySelector(`[data-time="${value}"]`);
      if (exactMatch) {
        exactMatch.scrollIntoView({ block: "center" });
      } else if (value) {
        // 가장 가까운 시간 찾기
        const [hours] = value.split(":").map(Number);
        const nearestTime = timeOptions.find((t) => {
          const [h] = t.split(":").map(Number);
          return h >= hours;
        });
        if (nearestTime) {
          const nearestEl = scrollRef.current.querySelector(`[data-time="${nearestTime}"]`);
          nearestEl?.scrollIntoView({ block: "center" });
        }
      }
    }
  }, [open, value, timeOptions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const normalized = normalizeTimeInput(raw);
    setInputValue(normalized);
    setIsEditing(true);
  };

  const handleInputFocus = () => {
    if (disabled) return;
    setIsEditing(true);
    // 값이 있으면 전체 선택하여 바로 새 값 입력 가능하게
    if (inputRef.current && inputValue) {
      inputRef.current.select();
    }
  };

  const handleInputBlur = () => {
    setIsEditing(false);
    if (inputValue && isValidTime(inputValue)) {
      const padded = padTime(inputValue);
      setInputValue(padded);
      onChange?.(padded);
    } else if (inputValue && !isValidTime(inputValue)) {
      // 유효하지 않으면 이전 값으로 복원
      setInputValue(value || "");
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (inputValue && isValidTime(inputValue)) {
        const padded = padTime(inputValue);
        setInputValue(padded);
        onChange?.(padded);
        setOpen(false);
        setIsEditing(false);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      setIsEditing(false);
      setInputValue(value || "");
      inputRef.current?.blur();
    } else if (e.key === "ArrowDown" && !open) {
      setOpen(true);
    }
  };

  const handleSelect = (time: string) => {
    setInputValue(time);
    onChange?.(time);
    setOpen(false);
    setIsEditing(false);
  };

  const handleDropdownToggle = () => {
    if (!disabled) {
      setOpen(!open);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div
        className={cn(
          "flex items-center h-9 w-full rounded-md border border-border bg-bg-default px-3",
          "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
          "transition-colors",
          disabled && "cursor-not-allowed opacity-50",
          className
        )}
      >
        <Clock className="mr-2 h-4 w-4 text-text-secondary flex-shrink-0" />
        <PopoverTrigger asChild>
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onKeyDown={handleInputKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              "flex-1 bg-transparent text-sm outline-none cursor-text",
              "placeholder:text-text-placeholder",
              disabled && "cursor-not-allowed"
            )}
            autoComplete="off"
          />
        </PopoverTrigger>
        <button
          type="button"
          onClick={handleDropdownToggle}
          disabled={disabled}
          className="ml-1 text-text-secondary hover:text-text-primary transition-colors"
          tabIndex={-1}
        >
          <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
        </button>
      </div>
      <PopoverContent className="w-[240px] p-0" align="start">
        {/* 직접 입력 안내 */}
        <div className="px-3 py-2 border-b border-border bg-bg-secondary">
          <p className="text-xs text-text-secondary whitespace-nowrap">
            직접 입력하거나 아래에서 선택하세요
          </p>
        </div>
        <ScrollArea className="h-[180px]" ref={scrollRef}>
          <div className="p-1">
            {timeOptions.map((time) => (
              <button
                key={time}
                data-time={time}
                type="button"
                onClick={() => handleSelect(time)}
                className={cn(
                  "w-full px-3 py-2 text-sm text-left rounded-md transition-colors",
                  "hover:bg-bg-secondary focus:bg-bg-secondary focus:outline-none",
                  value === time && "bg-action-primary text-white hover:bg-action-primary/90"
                )}
              >
                {formatTimeDisplay(time)}
              </button>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}

TimePicker.displayName = "TimePicker";
