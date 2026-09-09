import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Loading } from '../Loading';

describe('Loading', () => {
  it('root 帶 role=status 與 aria-live=polite，載入結束時螢幕閱讀器才補播報', () => {
    render(<Loading />);
    const root = screen.getByRole('status');
    expect(root).toHaveAttribute('aria-live', 'polite');
    expect(root.className).toContain('cl-loading');
  });

  it('預設顯示「載入中…」', () => {
    render(<Loading />);
    expect(screen.getByText('載入中…')).toBeInTheDocument();
  });

  it('size 反映在 modifier class 上，預設 md', () => {
    const { rerender } = render(<Loading />);
    expect(screen.getByRole('status').className).toContain('cl-loading--md');

    rerender(<Loading size="lg" />);
    const root = screen.getByRole('status');
    expect(root.className).toContain('cl-loading--lg');
    expect(root.className).not.toContain('cl-loading--md');
  });

  it('overlay 時 root 加上 is-overlay', () => {
    const { rerender } = render(<Loading />);
    expect(screen.getByRole('status').className).not.toContain('is-overlay');

    rerender(<Loading overlay />);
    expect(screen.getByRole('status').className).toContain('is-overlay');
  });

  it('text 給空字串就不渲染文字節點', () => {
    const { container } = render(<Loading text="" />);
    expect(container.querySelector('.cl-loading__text')).toBeNull();
    // spinner 仍在，且對輔助科技隱藏
    expect(container.querySelector('.cl-loading__spinner')).toHaveAttribute('aria-hidden', 'true');
  });
});
