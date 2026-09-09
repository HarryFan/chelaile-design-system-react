import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { TabBar } from './TabBar';
import type { TabBarItem } from './useTabBar';

const items: TabBarItem[] = [
  { key: 'home', label: '首頁', icon: '🏠' },
  { key: 'nearby', label: '附近', icon: '📍' },
  { key: 'favorite', label: '收藏', icon: '⭐', badge: 3 },
  { key: 'news', label: '消息', icon: '🔔', badge: 120 },
  { key: 'me', label: '我的', icon: '👤' },
];

const meta = {
  title: 'Navigation/TabBar',
  component: TabBar,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  args: { items, active: 'home' },
  argTypes: { onChange: { action: 'change' } },
} satisfies Meta<typeof TabBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** 受控用法：父層保存 active，onChange 時更新。點擊已選中的 tab 不會觸發 onChange。 */
export const Controlled: Story = {
  render: (args) => {
    const [active, setActive] = useState(args.active);
    return (
      <TabBar
        {...args}
        active={active}
        onChange={(key) => {
          args.onChange?.(key);
          setActive(key);
        }}
      />
    );
  },
};

/** badge 大於 99 顯示 `99+`；0 或未給不渲染徽章。 */
export const Badges: Story = {
  args: {
    items: [
      { key: 'a', label: '無徽章', icon: '○' },
      { key: 'b', label: '零', icon: '○', badge: 0 },
      { key: 'c', label: '個位', icon: '○', badge: 5 },
      { key: 'd', label: '破百', icon: '○', badge: 120 },
    ],
    active: 'a',
  },
};

/** 沒有 icon 也能用，純文字排版。 */
export const TextOnly: Story = {
  args: {
    items: [
      { key: 'bus', label: '公車' },
      { key: 'metro', label: '捷運' },
      { key: 'bike', label: '單車' },
    ],
    active: 'metro',
  },
};
