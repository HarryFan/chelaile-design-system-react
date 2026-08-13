import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { SearchBar } from './SearchBar';

const meta = {
  title: 'Basic/SearchBar',
  component: SearchBar,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof SearchBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithDefaultValue: Story = {
  args: { defaultValue: '南京三民站' },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: '定位中無法搜尋' },
};

/**
 * 受控用法：搜尋值由外部狀態持有。
 * 下方會顯示 debounce 後才觸發的 onSearch 值——用中文輸入法打字時，
 * 組字過程不會觸發，選字完成才算一次輸入。
 */
export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState('');
    const [searched, setSearched] = useState('');
    return (
      <div style={{ display: 'grid', gap: 12 }}>
        <SearchBar value={value} onChange={setValue} onSearch={setSearched} debounceMs={400} />
        <div style={{ fontSize: 12, color: '#8A8F99' }}>
          <div>目前輸入：{value || '（空）'}</div>
          <div>debounce 後查詢：{searched || '（尚未觸發）'}</div>
        </div>
      </div>
    );
  },
};
