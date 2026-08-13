import { useMemo } from 'react';

export type StatusTone = 'success' | 'warning' | 'danger' | 'info';

const TONE_ICON: Record<StatusTone, string> = {
  success: '✓',
  warning: '!',
  danger: '×',
  info: 'i',
};

/**
 * 狀態卡的語意推導。
 *
 * 重點在 role：danger 用 `alert`（螢幕閱讀器會立刻打斷並朗讀），
 * 其餘用 `status`（等使用者當前朗讀結束才補上）。
 * 全部都設成 alert 會讓使用者被不重要的訊息一直打斷。
 */
export function useStatusCard(tone: StatusTone) {
  return useMemo(
    () => ({
      icon: TONE_ICON[tone],
      role: tone === 'danger' ? ('alert' as const) : ('status' as const),
      ariaLive: tone === 'danger' ? ('assertive' as const) : ('polite' as const),
      toneClassName: `cl-status-card--${tone}`,
    }),
    [tone],
  );
}
