import { useCallback, useEffect, useRef, useState, type ChangeEvent, type CompositionEvent, type KeyboardEvent } from 'react';

export interface UseSearchBarOptions {
  /** 受控值；不給就是非受控，由 hook 自己保存 */
  value?: string;
  defaultValue?: string;
  /** 每次值變動都會呼叫（含輸入法組字結束後） */
  onChange?: (value: string) => void;
  /** debounce 後才觸發，用於打 API */
  onSearch?: (value: string) => void;
  /** debounce 毫秒數，0 表示不 debounce */
  debounceMs?: number;
}

/**
 * 搜尋列的輸入行為。
 *
 * 兩個容易踩的坑，所以抽成 hook 讓所有搜尋列共用同一份實作：
 *
 * 1. **中文輸入法組字**：注音/拼音在組字過程中會不斷觸發 change，
 *    此時送出查詢會打到一堆沒有意義的半成品字串。用 composition 事件擋掉，
 *    組字結束（compositionend）才視為一次真正的輸入。
 * 2. **debounce 的清理**：元件卸載時若沒清掉 timer，會在已卸載的元件上呼叫
 *    setState 或發出請求。
 */
export function useSearchBar(options: UseSearchBarOptions = {}) {
  const { value: controlledValue, defaultValue = '', onChange, onSearch, debounceMs = 300 } = options;

  const isControlled = controlledValue !== undefined;
  const [innerValue, setInnerValue] = useState(defaultValue);
  const value = isControlled ? controlledValue : innerValue;

  const isComposingRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // 卸載時清掉待觸發的 debounce，避免對已卸載元件送出查詢
  useEffect(() => clearTimer, [clearTimer]);

  const emitSearch = useCallback(
    (next: string) => {
      if (!onSearch) return;
      clearTimer();
      if (debounceMs <= 0) {
        onSearch(next);
        return;
      }
      timerRef.current = setTimeout(() => onSearch(next), debounceMs);
    },
    [onSearch, debounceMs, clearTimer],
  );

  const commit = useCallback(
    (next: string) => {
      if (!isControlled) setInnerValue(next);
      onChange?.(next);
      emitSearch(next);
    },
    [isControlled, onChange, emitSearch],
  );

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const next = event.target.value;
      // 組字中：畫面要跟著更新，但不對外送出查詢
      if (isComposingRef.current) {
        if (!isControlled) setInnerValue(next);
        return;
      }
      commit(next);
    },
    [commit, isControlled],
  );

  const handleCompositionStart = useCallback(() => {
    isComposingRef.current = true;
  }, []);

  const handleCompositionEnd = useCallback(
    (event: CompositionEvent<HTMLInputElement>) => {
      isComposingRef.current = false;
      commit((event.target as HTMLInputElement).value);
    },
    [commit],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      // 組字中的 Enter 是在選字，不是送出
      if (event.key === 'Enter' && !isComposingRef.current) {
        clearTimer();
        onSearch?.(value);
      }
    },
    [onSearch, value, clearTimer],
  );

  const clear = useCallback(() => {
    clearTimer();
    if (!isControlled) setInnerValue('');
    onChange?.('');
    onSearch?.('');
  }, [isControlled, onChange, onSearch, clearTimer]);

  return {
    value,
    hasValue: value.length > 0,
    handleChange,
    handleCompositionStart,
    handleCompositionEnd,
    handleKeyDown,
    clear,
  };
}
