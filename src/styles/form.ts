import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Form 컴포넌트 공통 스타일 (CVA 패턴)
 * Input, Textarea, NativeSelect, TagInput 등에서 사용
 */

/** 입력 필드 공통 기본 스타일 */
const inputBase =
  'file:text-foreground placeholder:text-text-placeholder selection:bg-action-primary selection:text-white border-border flex w-full min-w-0 rounded-md border text-base bg-bg-default transition-[color,box-shadow] outline-none focus:outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus:ring-2 focus:ring-action-primary';

/** Input 필드 variants */
export const inputVariants = cva(
  [inputBase, 'h-9 px-3 py-1 file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium'],
  {
    variants: {
      state: {
        default: '',
        error: 'border-status-error ring-status-error/20',
      },
    },
    defaultVariants: {
      state: 'default',
    },
  }
);

/** Textarea variants */
export const textareaVariants = cva([inputBase, 'px-3 py-2 min-h-[100px] resize-y h-auto'], {
  variants: {
    state: {
      default: '',
      error: 'border-status-error ring-status-error/20',
    },
  },
  defaultVariants: {
    state: 'default',
  },
});

/** Select variants */
export const selectVariants = cva([inputBase, 'h-9 px-3 py-1 cursor-pointer'], {
  variants: {
    state: {
      default: '',
      error: 'border-status-error ring-status-error/20',
    },
  },
  defaultVariants: {
    state: 'default',
  },
});

/** 라벨 스타일 */
export const labelStyles = 'block text-sm font-medium text-text-primary mb-1';

/** 에러 메시지 스타일 */
export const errorStyles = 'text-sm text-status-error mt-1';

/** 힌트 텍스트 스타일 */
export const hintStyles = 'text-sm text-text-secondary mb-2';

/** Type exports */
export type InputVariants = VariantProps<typeof inputVariants>;
export type TextareaVariants = VariantProps<typeof textareaVariants>;
export type SelectVariants = VariantProps<typeof selectVariants>;

/**
 * @deprecated formStyles는 CVA variants로 대체되었습니다.
 * - input → inputVariants
 * - textarea → textareaVariants
 * - select → selectVariants
 * - label → labelStyles
 * - error → errorStyles
 * - hint → hintStyles
 */
export const formStyles = {
  input: inputVariants({ state: 'default' }),
  textarea: textareaVariants({ state: 'default' }),
  label: labelStyles,
  error: errorStyles,
  hint: hintStyles,
  errorBorder: 'border-status-error',
};
