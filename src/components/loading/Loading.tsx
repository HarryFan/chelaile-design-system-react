import { useLoading, type LoadingSize } from './useLoading';
import './loading.css';

export interface LoadingProps {
  /** 提示文字；給空字串就只顯示 spinner */
  text?: string;
  /** spinner 尺寸：sm 16px / md 24px / lg 32px */
  size?: LoadingSize;
  /** 全螢幕半透明遮罩，擋住底下內容的互動 */
  overlay?: boolean;
  className?: string;
}

export function Loading({
  text = '載入中…',
  size = 'md',
  overlay = false,
  className,
}: LoadingProps) {
  const { rootClassName, hasText } = useLoading({ size, overlay, className, text });

  return (
    // aria-live="polite"：載入開始 / 結束時螢幕閱讀器會在當前朗讀結束後播報，
    // 不用 assertive，否則每次翻頁都會打斷使用者。
    <div className={rootClassName} role="status" aria-live="polite">
      <span className="cl-loading__spinner" aria-hidden="true" />
      {hasText && <span className="cl-loading__text">{text}</span>}
    </div>
  );
}
