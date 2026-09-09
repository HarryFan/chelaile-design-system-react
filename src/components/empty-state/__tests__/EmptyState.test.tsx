import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { EmptyState } from '../EmptyState';

describe('EmptyState', () => {
  it('預設渲染「暫無資料」並帶 role=status', () => {
    render(<EmptyState />);
    const root = screen.getByRole('status');
    expect(root).toHaveTextContent('暫無資料');
    expect(root.className).toContain('cl-empty-state');
  });

  it('沒給 description 就不渲染那個節點', () => {
    const { container, rerender } = render(<EmptyState title="附近沒有站牌" />);
    expect(container.querySelector('.cl-empty-state__desc')).toBeNull();

    rerender(<EmptyState title="附近沒有站牌" description="試著放大地圖範圍" />);
    expect(screen.getByText('試著放大地圖範圍')).toBeInTheDocument();
  });

  it('有 actionText 才顯示按鈕，點擊會回呼 onAction', async () => {
    const onAction = vi.fn();
    const { rerender } = render(<EmptyState onAction={onAction} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();

    rerender(<EmptyState actionText="去搜尋路線" onAction={onAction} />);
    const btn = screen.getByRole('button', { name: '去搜尋路線' });
    expect(btn.className).toContain('cl-button--primary');
    expect(btn.className).toContain('cl-button--sm');
    expect(btn.className).toContain('cl-button--round');

    await userEvent.click(btn);
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it('icon 渲染成 Remix Icon class，且對輔助科技隱藏', () => {
    const { container } = render(<EmptyState icon="ri-bus-line" />);
    const icon = container.querySelector('.cl-empty-state__icon');
    expect(icon?.tagName).toBe('I');
    expect(icon).toHaveClass('cl-icon', 'ri-bus-line');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
    expect(icon).toBeEmptyDOMElement();
  });

  it('預設 icon 為 ri-inbox-line', () => {
    const { container } = render(<EmptyState />);
    expect(container.querySelector('.cl-empty-state__icon')).toHaveClass('ri-inbox-line');
  });

  it('className 會合併到 root 上，讓使用端可覆寫樣式', () => {
    render(<EmptyState className="custom" />);
    expect(screen.getByRole('status').className).toContain('custom');
  });
});
