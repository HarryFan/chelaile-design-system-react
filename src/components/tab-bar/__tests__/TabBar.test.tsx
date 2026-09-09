import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { TabBar } from '../TabBar';
import { formatBadge, type TabBarItem } from '../useTabBar';

const items: TabBarItem[] = [
  { key: 'home', label: '首頁', icon: 'ri-home-5-line' },
  { key: 'nearby', label: '附近', icon: 'ri-map-pin-2-line' },
  { key: 'me', label: '我的', icon: 'ri-user-3-line' },
];

describe('TabBar', () => {
  it('渲染 tablist 與每個 tab，選中的帶 aria-selected 與 tabIndex=0', () => {
    render(<TabBar items={items} active="nearby" />);
    expect(screen.getByRole('tablist')).toBeInTheDocument();

    const tabs = screen.getAllByRole('tab');
    expect(tabs).toHaveLength(3);

    const active = screen.getByRole('tab', { name: /附近/ });
    expect(active).toHaveAttribute('aria-selected', 'true');
    expect(active).toHaveAttribute('tabindex', '0');
    expect(active.className).toContain('is-active');

    const inactive = screen.getByRole('tab', { name: /首頁/ });
    expect(inactive).toHaveAttribute('aria-selected', 'false');
    expect(inactive).toHaveAttribute('tabindex', '-1');
  });

  it('點擊其他 tab 會以該 key 呼叫 onChange', async () => {
    const onChange = vi.fn();
    render(<TabBar items={items} active="home" onChange={onChange} />);
    await userEvent.click(screen.getByRole('tab', { name: /我的/ }));
    expect(onChange).toHaveBeenCalledWith('me');
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('點擊已選中的 tab 不發 onChange', async () => {
    const onChange = vi.fn();
    render(<TabBar items={items} active="home" onChange={onChange} />);
    await userEvent.click(screen.getByRole('tab', { name: /首頁/ }));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('在最後一個 tab 按 ArrowRight 會循環回第一個', async () => {
    const onChange = vi.fn();
    render(<TabBar items={items} active="me" onChange={onChange} />);
    const last = screen.getByRole('tab', { name: /我的/ });
    last.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(onChange).toHaveBeenCalledWith('home');
  });

  it('在第一個 tab 按 ArrowLeft 會循環到最後一個', async () => {
    const onChange = vi.fn();
    render(<TabBar items={items} active="home" onChange={onChange} />);
    screen.getByRole('tab', { name: /首頁/ }).focus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(onChange).toHaveBeenCalledWith('me');
  });

  it('badge 120 顯示 99+', () => {
    render(<TabBar items={[{ key: 'news', label: '消息', badge: 120 }]} active="news" />);
    expect(screen.getByText('99+')).toBeInTheDocument();
  });

  it('badge 為 0 或未給時不渲染徽章', () => {
    const { container } = render(
      <TabBar
        items={[
          { key: 'a', label: '零', badge: 0 },
          { key: 'b', label: '未給' },
        ]}
        active="a"
      />,
    );
    expect(container.querySelector('.cl-tab-bar__badge')).toBeNull();
  });

  it('icon 渲染成 Remix Icon class，且對輔助科技隱藏；沒給 icon 就不渲染', () => {
    const { container } = render(
      <TabBar items={[...items, { key: 'plain', label: '純文字' }]} active="home" />,
    );
    const icons = container.querySelectorAll('.cl-tab-bar__icon');
    expect(icons).toHaveLength(3);
    expect(icons[0].tagName).toBe('I');
    expect(icons[0]).toHaveClass('cl-icon', 'ri-home-5-line');
    expect(icons[0]).toHaveAttribute('aria-hidden', 'true');
    expect(icons[0]).toBeEmptyDOMElement();
  });

  it('formatBadge 的邊界值', () => {
    expect(formatBadge(undefined)).toBeUndefined();
    expect(formatBadge(0)).toBeUndefined();
    expect(formatBadge(99)).toBe('99');
    expect(formatBadge(100)).toBe('99+');
  });
});
