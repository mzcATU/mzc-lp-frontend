"use client";

import * as React from "react";
import {
  format,
  setMonth as setMonthFn,
  setYear as setYearFn,
  getMonth,
  getYear,
} from "date-fns";
import { ko } from "date-fns/locale";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { cn } from '@/utils/cn';
import { Button } from '@/components/common/Button';
import { Calendar } from '@/components/common/Calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/common/Popover';
import type { DateRangePickerProps, DatePickerProps } from './DateRangePicker.types';

const MONTHS_KO = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

function DateRangePicker({
  className,
  date,
  onDateChange,
  placeholder = "Pick a date range",
  align = "start",
  disabled = false,
}: DateRangePickerProps) {
  const [internalDate, setInternalDate] = React.useState<DateRange | undefined>(
    date
  );

  const currentDate = date ?? internalDate;
  const handleDateChange = onDateChange ?? setInternalDate;

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            disabled={disabled}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !currentDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {currentDate?.from ? (
              currentDate.to ? (
                <>
                  {format(currentDate.from, "yyyy년 M월 d일", { locale: ko })} -{" "}
                  {format(currentDate.to, "yyyy년 M월 d일", { locale: ko })}
                </>
              ) : (
                format(currentDate.from, "yyyy년 M월 d일", { locale: ko })
              )
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align={align}>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={currentDate?.from}
            selected={currentDate}
            onSelect={handleDateChange}
            numberOfMonths={2}
            weekStartsOn={1}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

// 월 선택 그리드 컴포넌트
function MonthPicker({
  currentMonth,
  onMonthSelect,
  onClose,
}: {
  currentMonth: Date;
  onMonthSelect: (date: Date) => void;
  onClose: () => void;
}) {
  const [viewYear, setViewYear] = React.useState(getYear(currentMonth));
  const currentMonthIndex = getMonth(currentMonth);
  const currentYear = getYear(currentMonth);

  const handleMonthClick = (monthIndex: number) => {
    const newDate = setMonthFn(setYearFn(currentMonth, viewYear), monthIndex);
    onMonthSelect(newDate);
    onClose(); // 월 선택 후 달력으로 돌아가기
  };

  return (
    <div className="p-3 min-w-[252px]">
      {/* 헤더 - 뒤로가기 버튼 */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b">
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-md hover:bg-accent transition-colors"
          aria-label="달력으로 돌아가기"
        >
          <ChevronLeft className="size-4" />
        </button>
        <span className="text-sm font-medium">월 선택</span>
        <div className="size-6" /> {/* 균형을 위한 빈 공간 */}
      </div>

      {/* 연도 네비게이션 */}
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={() => setViewYear(viewYear - 1)}
          className="p-1 rounded-md hover:bg-accent transition-colors"
        >
          <ChevronLeft className="size-4" />
        </button>
        <span className="text-sm font-semibold">{viewYear}년</span>
        <button
          type="button"
          onClick={() => setViewYear(viewYear + 1)}
          className="p-1 rounded-md hover:bg-accent transition-colors"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      {/* 월 그리드 */}
      <div className="grid grid-cols-3 gap-2">
        {MONTHS_KO.map((month, index) => {
          const isSelected = index === currentMonthIndex && viewYear === currentYear;
          return (
            <button
              key={month}
              type="button"
              onClick={() => handleMonthClick(index)}
              className={cn(
                "px-3 py-2 text-sm rounded-md transition-colors",
                isSelected
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent"
              )}
            >
              {month}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Single date picker for convenience
function DatePicker({
  className,
  date,
  onDateChange,
  placeholder = "Pick a date",
  align = "start",
  disabled = false,
  fromDate,
  toDate,
}: DatePickerProps) {
  const [internalDate, setInternalDate] = React.useState<Date | undefined>(date);
  const [displayMonth, setDisplayMonth] = React.useState<Date>(date || new Date());
  const [showMonthPicker, setShowMonthPicker] = React.useState(false);

  const currentDate = date ?? internalDate;
  const handleDateChange = onDateChange ?? setInternalDate;

  // 날짜 제한 Matcher 배열 생성
  const getDisabledMatchers = () => {
    const matchers: Array<{ before: Date } | { after: Date }> = [];
    if (fromDate) matchers.push({ before: fromDate });
    if (toDate) matchers.push({ after: toDate });
    return matchers.length > 0 ? matchers : undefined;
  };

  // date prop 변경 시 displayMonth도 업데이트
  React.useEffect(() => {
    if (date) {
      setDisplayMonth(date);
    }
  }, [date]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-[200px] justify-start text-left font-normal",
            !currentDate && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {currentDate ? format(currentDate, "yyyy년 M월 d일", { locale: ko }) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align={align}>
        {showMonthPicker ? (
          <MonthPicker
            currentMonth={displayMonth}
            onMonthSelect={(newMonth) => {
              setDisplayMonth(newMonth);
              setShowMonthPicker(false);
            }}
            onClose={() => setShowMonthPicker(false)}
          />
        ) : (
          <div className="relative">
            {/* 월 선택 오버레이 버튼 - 캘린더 헤더 위에 위치 */}
            <button
              type="button"
              onClick={() => setShowMonthPicker(true)}
              className="absolute top-[12px] left-1/2 -translate-x-1/2 z-50 text-sm font-medium hover:text-primary transition-colors flex items-center gap-1 px-2 py-1 rounded hover:bg-accent/50"
            >
              {format(displayMonth, "yyyy년 M월", { locale: ko })}
              <ChevronDown className="size-3" />
            </button>
            <Calendar
              mode="single"
              month={displayMonth}
              onMonthChange={setDisplayMonth}
              selected={currentDate}
              onSelect={handleDateChange}
              initialFocus
              weekStartsOn={1}
              disabled={getDisabledMatchers()}
              classNames={{
                month_caption: "invisible h-7",
              }}
            />
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

export { DateRangePicker, DatePicker };
