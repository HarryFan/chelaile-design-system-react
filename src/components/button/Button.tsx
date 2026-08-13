import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { useButton, type ButtonSize, type ButtonVariant } from './useButton';
import './button.css';

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  /** 視覺樣式 */
  variant?: ButtonVariant;
  /** 尺寸 */
  size?: ButtonSize;
  /** 膠囊圓角 */
  round?: boolean;
  /** 撐滿容器寬度 */
  block?: boolean;
  /** 載入中：顯示 spinner 並擋掉點擊，但保留可聚焦 */
  loading?: boolean;
  /** 原生 button type，預設 button 而非 submit，避免在表單內誤送出 */
  htmlType?: 'button' | 'submit' | 'reset';
  children?: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  round = false,
  block = false,
  loading = false,
  disabled = false,
  htmlType = 'button',
  className,
  onClick,
  children,
  ...rest
}: ButtonProps) {
  const { rootClassName, handleClick, ariaBusy, ariaDisabled } = useButton({
    variant,
    size,
    round,
    block,
    loading,
    disabled,
    className,
    onClick,
  });

  return (
    <button
      {...rest}
      type={htmlType}
      className={rootClassName}
      // 只在真的 disabled 時設 disabled attribute；loading 用 aria-disabled，
      // 這樣按鈕仍可被 Tab 聚焦，使用者才感知得到「正在處理」。
      disabled={disabled || undefined}
      aria-busy={ariaBusy}
      aria-disabled={ariaDisabled}
      onClick={handleClick}
    >
      {loading && <span className="cl-button__spinner" aria-hidden="true" />}
      <span className="cl-button__label">{children}</span>
    </button>
  );
}
