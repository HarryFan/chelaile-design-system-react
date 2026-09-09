import type { Meta, StoryObj } from '@storybook/react-vite';
import { Loading } from './Loading';

const meta = {
  title: 'Basic/Loading',
  component: Loading,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { text: '載入中…' },
  argTypes: {
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Loading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'flex-end' }}>
      <Loading {...args} size="sm" text="小" />
      <Loading {...args} size="md" text="中" />
      <Loading {...args} size="lg" text="大" />
    </div>
  ),
};

/** text 給空字串就只剩 spinner，不會留一個空的文字節點。 */
export const SpinnerOnly: Story = {
  args: { text: '' },
};

/** overlay 會 fixed 蓋住整個畫面，擋掉底下內容的互動；這裡用 padded 讓遮罩範圍看得出來。 */
export const Overlay: Story = {
  args: { overlay: true, size: 'lg', text: '正在取得到站時間…' },
  parameters: { layout: 'fullscreen' },
  render: (args) => (
    <div style={{ height: 320, padding: 16 }}>
      <p>底下的內容會被遮罩蓋住，無法點擊。</p>
      <Loading {...args} />
    </div>
  ),
};
