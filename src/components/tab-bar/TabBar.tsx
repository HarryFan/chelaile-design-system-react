import { cn } from '../../utils/cn';
import { useTabBar, type TabBarItem } from './useTabBar';
import './tab-bar.css';

export interface TabBarProps {
  items: TabBarItem[];
  /** 目前選中的 tab key */
  active: string;
  /** 切換到其他 tab 時呼叫；點擊已選中的 tab 不會觸發 */
  onChange?: (key: string) => void;
  /** tablist 的無障礙名稱 */
  label?: string;
  className?: string;
}

export function TabBar({ items, active, onChange, label = '主要導覽', className }: TabBarProps) {
  const { rootClassName, getItemProps } = useTabBar({ items, active, onChange, className });

  return (
    <nav className={rootClassName} aria-label={label}>
      <div className="cl-tab-bar__list" role="tablist">
        {items.map((item) => {
          const { badgeText, isActive, ...buttonProps } = getItemProps(item);
          return (
            <button key={item.key} {...buttonProps} data-key={item.key}>
              {item.icon && <i className={cn('cl-icon', 'cl-tab-bar__icon', item.icon)} aria-hidden="true" />}
              <span className="cl-tab-bar__label">{item.label}</span>
              {badgeText && (
                <span className="cl-tab-bar__badge" aria-label={`${badgeText} 則未讀`}>
                  {badgeText}
                </span>
              )}
              {/* 目前選中的 tab 用視覺以外的方式再提示一次；aria-selected 已足夠給輔助技術 */}
              {isActive && <span className="cl-tab-bar__indicator" aria-hidden="true" />}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
