import { useId } from 'react';
import { useSearchBar, type UseSearchBarOptions } from './useSearchBar';
import './search-bar.css';

export interface SearchBarProps extends UseSearchBarOptions {
  /** 無障礙標籤，視覺上隱藏 */
  label?: string;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
  disabled?: boolean;
}

export function SearchBar({
  label = '搜尋',
  placeholder = '搜尋站牌或路線',
  className,
  autoFocus,
  disabled,
  ...options
}: SearchBarProps) {
  const inputId = useId();
  const { value, hasValue, handleChange, handleCompositionStart, handleCompositionEnd, handleKeyDown, clear } =
    useSearchBar(options);

  return (
    <div className={['cl-search-bar', disabled && 'is-disabled', className].filter(Boolean).join(' ')}>
      <label className="cl-search-bar__label" htmlFor={inputId}>
        {label}
      </label>
      <i className="cl-icon cl-search-bar__icon ri-search-line" aria-hidden="true" />
      <input
        id={inputId}
        className="cl-search-bar__input"
        type="search"
        role="searchbox"
        value={value}
        placeholder={placeholder}
        autoFocus={autoFocus}
        disabled={disabled}
        onChange={handleChange}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        onKeyDown={handleKeyDown}
      />
      {hasValue && !disabled && (
        <button type="button" className="cl-search-bar__clear" onClick={clear} aria-label="清除搜尋">
          <i className="cl-icon ri-close-circle-fill" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
