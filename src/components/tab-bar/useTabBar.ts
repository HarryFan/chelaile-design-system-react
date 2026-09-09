import { useCallback, useMemo, type KeyboardEvent } from 'react';
import { cn } from '../../utils/cn';

export interface TabBarItem {
  key: string;
  label: string;
  /** emoji 或文字，先不綁 icon 庫 */
  icon?: string;
  /** 未讀數；0 或未給不顯示，大於 99 顯示 `99+` */
  badge?: number;
}

export interface UseTabBarOptions {
  items: TabBarItem[];
  active: string;
  onChange?: (key: string) => void;
  className?: string;
}

/** 徽章文字：> 99 顯示 `99+`；0 / 未給回傳 undefined 表示不渲染 */
export function formatBadge(badge?: number): string | undefined {
  if (badge === undefined || badge <= 0) return undefined;
  return badge > 99 ? '99+' : String(badge);
}

/**
 * TabBar 的選取與鍵盤行為。
 *
 * 兩條容易被漏掉的規則集中在這裡：
 *
 * 1. **點擊已選中的 tab 不發 change**：否則父層會因為同值更新而多跑一次路由或請求。
 * 2. **roving tabindex**：只有選中的 tab 可被 Tab 鍵聚焦，←/→ 在 tab 之間循環切換。
 *    這是 WAI-ARIA tabs pattern 的要求，沒做的話鍵盤使用者要按很多次 Tab 才能離開列表。
 */
export function useTabBar(options: UseTabBarOptions) {
  const { items, active, onChange, className } = options;

  const rootClassName = useMemo(() => cn('cl-tab-bar', className), [className]);

  const select = useCallback(
    (key: string) => {
      if (key === active) return;
      onChange?.(key);
    },
    [active, onChange],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      if (items.length === 0) return;
      event.preventDefault();

      const currentIndex = Math.max(
        0,
        items.findIndex((item) => item.key === active),
      );
      const delta = event.key === 'ArrowRight' ? 1 : -1;
      // 循環：最後一個往右回到第一個，第一個往左跳到最後一個
      const nextIndex = (currentIndex + delta + items.length) % items.length;
      const next = items[nextIndex];

      select(next.key);

      // 焦點跟著移到新 tab，否則 tabindex 變成 -1 後焦點會卡在舊 tab 上
      const siblings = event.currentTarget.parentElement?.children;
      const target = siblings?.[nextIndex];
      if (target instanceof HTMLElement) target.focus();
    },
    [items, active, select],
  );

  const getItemProps = useCallback(
    (item: TabBarItem) => {
      const isActive = item.key === active;
      return {
        role: 'tab' as const,
        type: 'button' as const,
        'aria-selected': isActive,
        tabIndex: isActive ? 0 : -1,
        className: cn('cl-tab-bar__item', isActive && 'is-active'),
        badgeText: formatBadge(item.badge),
        isActive,
        onClick: () => select(item.key),
        onKeyDown: handleKeyDown,
      };
    },
    [active, select, handleKeyDown],
  );

  return { rootClassName, getItemProps };
}
