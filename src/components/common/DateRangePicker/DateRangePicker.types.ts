import type { DateRange } from 'react-day-picker';

export interface DateRangePickerProps {
  className?: string;
  date?: DateRange;
  onDateChange?: (date: DateRange | undefined) => void;
  placeholder?: string;
  align?: 'start' | 'center' | 'end';
  disabled?: boolean;
}

export interface DatePickerProps {
  className?: string;
  date?: Date;
  onDateChange?: (date: Date | undefined) => void;
  placeholder?: string;
  align?: 'start' | 'center' | 'end';
  disabled?: boolean;
  /** 이 날짜 이전은 선택 불가 (이 날짜 포함 선택 가능) */
  fromDate?: Date;
  /** 이 날짜 이후는 선택 불가 (이 날짜 포함 선택 가능) */
  toDate?: Date;
}
