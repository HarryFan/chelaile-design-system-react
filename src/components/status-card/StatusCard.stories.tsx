import type { Meta, StoryObj } from '@storybook/react-vite';
import { StatusCard } from './StatusCard';

const meta = {
  title: 'Basic/StatusCard',
  component: StatusCard,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  args: { title: '定位成功', description: '台北市信義區・松勤街' },
  argTypes: {
    tone: { control: 'radio', options: ['success', 'warning', 'danger', 'info'] },
  },
} satisfies Meta<typeof StatusCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = { args: { tone: 'success' } };

export const Warning: Story = {
  args: { tone: 'warning', title: '定位精度較低', description: '建議移動到空曠處再試一次' },
};

/** danger 會用 role="alert"，螢幕閱讀器立刻打斷朗讀；其餘 tone 用 role="status"。 */
export const Danger: Story = {
  args: { tone: 'danger', title: '無法取得定位', description: '請確認已開啟定位權限', actionText: '重新定位' },
};

export const WithAction: Story = {
  args: { tone: 'info', title: '尚未選擇路線', description: '選一條常用路線加入首頁', actionText: '去選擇' },
};

/** description 沒給就不渲染那個節點——空值占位由父層決定，元件不自己補 `--`。 */
export const TitleOnly: Story = {
  args: { title: '已在最近站牌', description: undefined },
};
