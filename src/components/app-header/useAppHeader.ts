import { useMemo, type ReactNode } from 'react';
import { cn } from '../../utils/cn';

export interface UseAppHeaderOptions {
  title?: string;
  showBack: boolean;
  left?: ReactNode;
  className?: string;
}

/**
 * AppHeader 的顯示推導。
 *
 * 規則只有三條，但「left 覆蓋返回鈕」這條很容易被寫成「兩個都顯示」，
 * 抽出來讓判斷只有一份：
 *
 * - `left` 有給 → 渲染 left，不渲染返回鈕（即使 showBack 為 true）
 * - `left` 沒給且 `showBack` → 渲染返回鈕
 * - `title` 非空字串才渲染 h1，空值占位由父層決定
 */
export function useAppHeader(options: UseAppHeaderOptions) {
  const { title, showBack, left, className } = options;

  const hasLeft = left !== undefined && left !== null && left !== false;
  const showBackButton = showBack && !hasLeft;
  const hasTitle = typeof title === 'string' && title.trim() !== '';

  const rootClassName = useMemo(() => cn('cl-app-header', className), [className]);

  return { rootClassName, hasLeft, showBackButton, hasTitle };
}
