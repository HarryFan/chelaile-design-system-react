import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SearchBar } from '../SearchBar';

describe('SearchBar', () => {
  it('輸入時觸發 onChange', async () => {
    const onChange = vi.fn();
    render(<SearchBar onChange={onChange} debounceMs={0} />);
    await userEvent.type(screen.getByRole('searchbox'), 'bus');
    expect(onChange).toHaveBeenLastCalledWith('bus');
  });

  it('中文輸入法組字期間不觸發 onSearch，組字結束才送出', () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} debounceMs={0} />);
    const input = screen.getByRole('searchbox') as HTMLInputElement;

    fireEvent.compositionStart(input);
    fireEvent.change(input, { target: { value: 'ㄋㄢ' } });
    expect(onSearch).not.toHaveBeenCalled();

    fireEvent.compositionEnd(input, { target: { value: '南京' } });
    expect(onSearch).toHaveBeenCalledWith('南京');
  });

  it('debounce：連續輸入只在停止後觸發一次', async () => {
    vi.useFakeTimers();
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} debounceMs={300} />);
    const input = screen.getByRole('searchbox');

    fireEvent.change(input, { target: { value: 'a' } });
    fireEvent.change(input, { target: { value: 'ab' } });
    fireEvent.change(input, { target: { value: 'abc' } });
    expect(onSearch).not.toHaveBeenCalled();

    vi.advanceTimersByTime(300);
    expect(onSearch).toHaveBeenCalledTimes(1);
    expect(onSearch).toHaveBeenCalledWith('abc');
    vi.useRealTimers();
  });

  it('有值才出現清除鈕，按下後清空並送出空查詢', async () => {
    const onSearch = vi.fn();
    render(<SearchBar defaultValue="板橋" onSearch={onSearch} debounceMs={0} />);

    const clearBtn = screen.getByRole('button', { name: '清除搜尋' });
    await userEvent.click(clearBtn);

    expect((screen.getByRole('searchbox') as HTMLInputElement).value).toBe('');
    expect(onSearch).toHaveBeenCalledWith('');
    expect(screen.queryByRole('button', { name: '清除搜尋' })).not.toBeInTheDocument();
  });

  it('Enter 會立即查詢，不等 debounce', () => {
    const onSearch = vi.fn();
    render(<SearchBar defaultValue="信義路" onSearch={onSearch} debounceMs={5000} />);
    fireEvent.keyDown(screen.getByRole('searchbox'), { key: 'Enter' });
    expect(onSearch).toHaveBeenCalledWith('信義路');
  });
});
