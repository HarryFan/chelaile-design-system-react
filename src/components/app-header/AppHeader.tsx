import type { ReactNode } from 'react';
import { useAppHeader } from './useAppHeader';
import './app-header.css';

export interface AppHeaderProps {
  /** 頁面標題；空字串或未給就不渲染 h1 */
  title?: string;
  /** 是否顯示返回鈕，預設 true */
  showBack?: boolean;
  /** 返回鈕的無障礙標籤 */
  backLabel?: string;
  onBack?: () => void;
  /** 左側自訂內容，有給就覆蓋返回鈕 */
  left?: ReactNode;
  /** 右側動作區 */
  right?: ReactNode;
  className?: string;
}

export function AppHeader({
  title,
  showBack = true,
  backLabel = '返回',
  onBack,
  left,
  right,
  className,
}: AppHeaderProps) {
  const { rootClassName, hasLeft, showBackButton, hasTitle } = useAppHeader({
    title,
    showBack,
    left,
    className,
  });

  return (
    <header className={rootClassName} role="banner">
      <div className="cl-app-header__left">
        {hasLeft && left}
        {showBackButton && (
          <button type="button" className="cl-app-header__back" aria-label={backLabel} onClick={onBack}>
            <span aria-hidden="true">‹</span>
          </button>
        )}
      </div>

      {hasTitle && <h1 className="cl-app-header__title">{title}</h1>}

      <div className="cl-app-header__right">{right}</div>
    </header>
  );
}
