import type { Meta, StoryObj } from '@storybook/react-vite';
import { EmptyState } from './EmptyState';

const meta = {
  title: 'Basic/EmptyState',
  component: EmptyState,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  args: { title: '暫無資料' },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 什麼都不給時的預設樣子：📭 + 「暫無資料」。 */
export const Default: Story = {};

export const WithDescription: Story = {
  args: { title: '附近沒有站牌', description: '試著放大地圖範圍，或搜尋路線名稱' },
};

/** 有給 actionText 才會出現按鈕（primary / sm / round）。 */
export const WithAction: Story = {
  args: {
    title: '還沒有收藏路線',
    description: '把常搭的路線加入收藏，下次打開就能直接看到到站時間',
    actionText: '去搜尋路線',
  },
};

export const CustomIcon: Story = {
  args: { icon: '🚌', title: '目前沒有班次', description: '末班車已發出，明日 05:30 恢復營運' },
};
