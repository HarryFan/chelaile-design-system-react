import { useMemo } from 'react';
import { cn } from '../../utils/cn';

export type LoadingSize = 'sm' | 'md' | 'lg';

export interface UseLoadingOptions {
  size: LoadingSize;
  overlay: boolean;
  className?: string;
  text?: string;
}

/**
 * Loading 的樣式與顯示推導。
 *
 * size / overlay 對應的 class 只在這裡組一次；
 * `text` 給空字串時不渲染文字節點——只有轉圈的情境（例如按鈕旁的小 spinner）
 * 不該留一個空的 <span> 佔位。
 */
export function useLoading(options: UseLoadingOptions) {
  const { size, overlay, className, text } = options;

  const rootClassName = useMemo(
    () => cn('cl-loading', `cl-loading--${size}`, overlay && 'is-overlay', className),
    [size, overlay, className],
  );

  const hasText = Boolean(text);

  return { rootClassName, hasText };
}
