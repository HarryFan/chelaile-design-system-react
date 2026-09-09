import { Button } from '../button';
import { useEmptyState } from './useEmptyState';
import './empty-state.css';

export interface EmptyStateProps {
  /** 主標題 */
  title?: string;
  /** 補充說明。父層若可能拿到空值，請自行擋掉再傳入 */
  description?: string;
  /** 裝飾用圖示（emoji 或單一字元），對輔助科技隱藏 */
  icon?: string;
  /** 有給 actionText 才會顯示按鈕 */
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  title = '暫無資料',
  description,
  icon = '📭',
  actionText,
  onAction,
  className,
}: EmptyStateProps) {
  const { rootClassName, hasDescription, hasAction } = useEmptyState({
    description,
    actionText,
    className,
  });

  return (
    // role="status"：列表從「有資料」變成「沒資料」時，螢幕閱讀器會在當前朗讀結束後補上
    <div className={rootClassName} role="status">
      <span className="cl-empty-state__icon" aria-hidden="true">
        {icon}
      </span>

      <p className="cl-empty-state__title">{title}</p>

      {hasDescription && <p className="cl-empty-state__desc">{description}</p>}

      {hasAction && (
        <Button variant="primary" size="sm" round onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
}
