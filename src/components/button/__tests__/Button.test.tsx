import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from '../Button';

describe('Button', () => {
  it('渲染文字並預設為 type=button，避免在表單內誤送出', () => {
    render(<Button>送出</Button>);
    const btn = screen.getByRole('button', { name: '送出' });
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveAttribute('type', 'button');
  });

  it('點擊會呼叫 onClick', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>送出</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('loading 時擋掉點擊，但保留可聚焦與 aria-busy', async () => {
    const onClick = vi.fn();
    render(<Button loading onClick={onClick}>查詢中</Button>);
    const btn = screen.getByRole('button');

    await userEvent.click(btn);
    expect(onClick).not.toHaveBeenCalled();

    expect(btn).toHaveAttribute('aria-busy', 'true');
    expect(btn).toHaveAttribute('aria-disabled', 'true');
    // 沒有 disabled attribute，否則使用者無法聚焦、也不知道正在處理
    expect(btn).not.toBeDisabled();
  });

  it('disabled 時擋掉點擊並帶上 disabled attribute', async () => {
    const onClick = vi.fn();
    render(<Button disabled onClick={onClick}>不可用</Button>);
    const btn = screen.getByRole('button');
    await userEvent.click(btn);
    expect(onClick).not.toHaveBeenCalled();
    expect(btn).toBeDisabled();
  });

  it('variant 與 size 反映在 class 上，讓使用端可覆寫樣式', () => {
    render(<Button variant="danger" size="lg" round block className="custom">刪除</Button>);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('cl-button--danger');
    expect(btn.className).toContain('cl-button--lg');
    expect(btn.className).toContain('cl-button--round');
    expect(btn.className).toContain('cl-button--block');
    expect(btn.className).toContain('custom');
  });
});
