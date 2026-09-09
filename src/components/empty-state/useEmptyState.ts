import { useMemo } from 'react';
import { cn } from '../../utils/cn';

export interface UseEmptyStateOptions {
  description?: string;
  actionText?: string;
  className?: string;
}

/**
 * EmptyState 的推導邏輯。
 *
 * 「有沒有說明」「有沒有按鈕」這兩條判斷只在這裡寫一次；
 * 元件本身只負責照著 hasDescription / hasAction 渲染，
 * 之後若要改成「空字串也算沒有」之類的規則，不用碰 JSX。
 */
export function useEmptyState(options: UseEmptyStateOptions) {
  const { description, actionText, className } = options;

  const rootClassName = useMemo(() => cn('cl-empty-state', className), [className]);

  // 空字串視為沒給，父層擋不到的空值在這裡收掉，不渲染空的 <p>
  const hasDescription = Boolean(description);
  const hasAction = Boolean(actionText);

  return { rootClassName, hasDescription, hasAction };
}
