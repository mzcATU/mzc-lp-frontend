"use client";

import * as React from "react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { cn } from '@/utils/cn';
import { Button } from '@/components/common/Button';
import { Calendar } from '@/components/common/Calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/common/Popover';
import type { DateRangePickerProps, DatePickerProps } from './DateRangePicker.types';

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
  const [internalDate, setInternalDate] = React.useState<Date | undefined>(
    date
  );

  const currentDate = date ?? internalDate;
  const handleDateChange = onDateChange ?? setInternalDate;

  // 날짜 제한 Matcher 배열 생성
  const getDisabledMatchers = () => {
    const matchers: Array<{ before: Date } | { after: Date }> = [];
    if (fromDate) matchers.push({ before: fromDate });
    if (toDate) matchers.push({ after: toDate });
    return matchers.length > 0 ? matchers : undefined;
  };

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
        <Calendar
          mode="single"
          selected={currentDate}
          onSelect={handleDateChange}
          initialFocus
          weekStartsOn={1}
          disabled={getDisabledMatchers()}
        />
      </PopoverContent>
    </Popover>
  );
}

export { DateRangePicker, DatePicker };
