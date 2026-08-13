import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { StatusCard } from '../StatusCard';

describe('StatusCard', () => {
  it('渲染標題與說明', () => {
    render(<StatusCard title="定位成功" description="台北市信義區" />);
    expect(screen.getByRole('heading', { name: '定位成功' })).toBeInTheDocument();
    expect(screen.getByText('台北市信義區')).toBeInTheDocument();
  });

  it('danger 用 role=alert，其餘用 role=status', () => {
    const { unmount } = render(<StatusCard tone="danger" title="定位失敗" />);
    expect(screen.getByRole('alert')).toHaveAttribute('aria-live', 'assertive');
    unmount();

    render(<StatusCard tone="success" title="定位成功" />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
  });

  it('沒給 description 就不渲染那個節點', () => {
    const { container } = render(<StatusCard title="已在最近站牌" />);
    expect(container.querySelector('.cl-status-card__desc')).toBeNull();
  });

  it('有 actionText 才顯示按鈕，點擊會回呼', async () => {
    const onAction = vi.fn();
    const { rerender } = render(<StatusCard title="無法定位" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();

    rerender(<StatusCard title="無法定位" actionText="重新定位" onAction={onAction} />);
    await userEvent.click(screen.getByRole('button', { name: '重新定位' }));
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it('tone 反映在 class 上', () => {
    const { container } = render(<StatusCard tone="warning" title="精度較低" />);
    expect(container.firstElementChild?.className).toContain('cl-status-card--warning');
  });
});
