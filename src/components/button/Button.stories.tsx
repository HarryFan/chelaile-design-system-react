import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button';

const meta = {
  title: 'Basic/Button',
  component: Button,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { children: '確認搭乘' },
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'danger', 'ghost'] },
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <Button {...args} variant="primary">主要操作</Button>
      <Button {...args} variant="secondary">次要操作</Button>
      <Button {...args} variant="danger">刪除路線</Button>
      <Button {...args} variant="ghost">取消</Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Button {...args} size="sm">小</Button>
      <Button {...args} size="md">中</Button>
      <Button {...args} size="lg">大</Button>
    </div>
  ),
};

/** loading 期間點擊會被擋掉，但按鈕仍可聚焦，讓螢幕閱讀器讀得到 aria-busy。 */
export const Loading: Story = {
  args: { loading: true, children: '查詢中' },
};

export const Disabled: Story = {
  args: { disabled: true, children: '無法搭乘' },
};

export const RoundBlock: Story = {
  args: { round: true, block: true, children: '立即規劃路線' },
  parameters: { layout: 'padded' },
};
