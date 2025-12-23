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
}
