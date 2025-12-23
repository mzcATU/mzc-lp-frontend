/**
 * Form 컴포넌트 공통 스타일
 * Input, Textarea, NativeSelect, TagInput 등에서 사용
 */

export const formStyles = {
  /** 입력 필드 기본 스타일 */
  input:
    'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base bg-input-background transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',

  /** Textarea 전용 (input + 높이 조절) */
  textarea:
    'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex w-full min-w-0 rounded-md border px-3 py-2 text-base bg-input-background transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive min-h-[100px] resize-y h-auto',

  /** 라벨 스타일 */
  label: 'block text-sm font-medium text-text-primary mb-1',

  /** 에러 메시지 스타일 */
  error: 'text-sm text-status-error mt-1',

  /** 힌트 텍스트 스타일 */
  hint: 'text-sm text-text-secondary mb-2',

  /** 에러 상태 테두리 */
  errorBorder: 'border-status-error',
};
