import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { AppHeader } from '../AppHeader';

describe('AppHeader', () => {
  it('渲染 banner 與 h1 標題', () => {
    render(<AppHeader title="附近站牌" />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: '附近站牌' })).toBeInTheDocument();
  });

  it('返回鈕帶 aria-label，點擊會呼叫 onBack', async () => {
    const onBack = vi.fn();
    render(<AppHeader title="附近站牌" backLabel="回上一頁" onBack={onBack} />);
    const back = screen.getByRole('button', { name: '回上一頁' });
    expect(back).toHaveAttribute('type', 'button');
    await userEvent.click(back);
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('預設 backLabel 為「返回」', () => {
    render(<AppHeader title="附近站牌" />);
    expect(screen.getByRole('button', { name: '返回' })).toBeInTheDocument();
  });

  it('showBack=false 時不渲染返回鈕', () => {
    render(<AppHeader title="首頁" showBack={false} />);
    expect(screen.queryByRole('button', { name: '返回' })).not.toBeInTheDocument();
  });

  it('left 有給就覆蓋返回鈕', () => {
    render(<AppHeader title="附近站牌" left={<button type="button">關閉</button>} />);
    expect(screen.getByRole('button', { name: '關閉' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '返回' })).not.toBeInTheDocument();
  });

  it('沒 title 或空字串時不渲染 h1', () => {
    const { rerender } = render(<AppHeader />);
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();

    rerender(<AppHeader title="" />);
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  it('right 會渲染在動作區', () => {
    const { container } = render(<AppHeader title="附近站牌" right={<span>編輯</span>} />);
    const right = container.querySelector('.cl-app-header__right');
    expect(right).toHaveTextContent('編輯');
  });
});
