import type { ReactNode } from 'react';
import { Button } from '../button';
import { useStatusCard, type StatusTone } from './useStatusCard';
import './status-card.css';

export interface StatusCardProps {
  /** 語意色調，同時決定螢幕閱讀器的播報優先度 */
  tone?: StatusTone;
  title: string;
  /** 狀態說明。父層若可能拿到空值，請自行擋掉再傳入 */
  description?: ReactNode;
  /** 有給 actionText 才會顯示按鈕 */
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export function StatusCard({
  tone = 'info',
  title,
  description,
  actionText,
  onAction,
  className,
}: StatusCardProps) {
  const { icon, role, ariaLive, toneClassName } = useStatusCard(tone);

  return (
    <div
      className={['cl-status-card', toneClassName, className].filter(Boolean).join(' ')}
      role={role}
      aria-live={ariaLive}
    >
      <span className="cl-status-card__icon" aria-hidden="true">
        {icon}
      </span>

      <div className="cl-status-card__body">
        <h3 className="cl-status-card__title">{title}</h3>
        {description !== undefined && description !== null && description !== '' && (
          <p className="cl-status-card__desc">{description}</p>
        )}
      </div>

      {actionText && (
        <Button variant="secondary" size="sm" round onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
}
