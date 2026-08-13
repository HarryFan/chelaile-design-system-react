import { useCallback, useMemo, type MouseEvent } from 'react';
import { cn } from '../../utils/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface UseButtonOptions {
  variant: ButtonVariant;
  size: ButtonSize;
  round: boolean;
  block: boolean;
  loading: boolean;
  disabled: boolean;
  className?: string;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

/**
 * Button 的行為與樣式推導。
 *
 * 抽成 hook 的理由：`loading` 期間要擋掉點擊，這條規則在多個地方會被忘記寫，
 * 放在元件裡就會被複製到下一個按鈕元件。抽出來之後，行為只有一份。
 */
export function useButton(options: UseButtonOptions) {
  const { variant, size, round, block, loading, disabled, className, onClick } = options;

  // loading 也視為不可互動，但語意上仍是 button 而非 disabled attribute，
  // 否則螢幕閱讀器會直接跳過，使用者不知道正在處理中。
  const isInteractive = !disabled && !loading;

  const rootClassName = useMemo(
    () =>
      cn(
        'cl-button',
        `cl-button--${variant}`,
        `cl-button--${size}`,
        round && 'cl-button--round',
        block && 'cl-button--block',
        loading && 'is-loading',
        disabled && 'is-disabled',
        className,
      ),
    [variant, size, round, block, loading, disabled, className],
  );

  const handleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      if (!isInteractive) {
        event.preventDefault();
        return;
      }
      onClick?.(event);
    },
    [isInteractive, onClick],
  );

  return {
    rootClassName,
    handleClick,
    isInteractive,
    ariaBusy: loading || undefined,
    ariaDisabled: disabled || loading || undefined,
  };
}
