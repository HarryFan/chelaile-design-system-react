import type { Meta, StoryObj } from '@storybook/react-vite';
import { AppHeader } from './AppHeader';
import { Button } from '../button';

const meta = {
  title: 'Navigation/AppHeader',
  component: AppHeader,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  args: { title: '附近站牌' },
  argTypes: { onBack: { action: 'back' } },
} satisfies Meta<typeof AppHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** 首頁這類不能返回的頁面，把 showBack 關掉。 */
export const NoBack: Story = {
  args: { showBack: false, title: '首頁' },
};

/** right 放動作區，例如搜尋或設定。 */
export const WithRight: Story = {
  args: {
    right: (
      <Button variant="ghost" size="sm">
        編輯
      </Button>
    ),
  },
};

/** left 有給就覆蓋返回鈕，即使 showBack 為 true。 */
export const CustomLeft: Story = {
  args: {
    left: (
      <Button variant="ghost" size="sm">
        關閉
      </Button>
    ),
  },
};

/** 沒 title 不渲染 h1，空值占位由父層決定。 */
export const NoTitle: Story = {
  args: { title: undefined },
};
