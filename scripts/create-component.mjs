#!/usr/bin/env node
/**
 * 元件腳手架。
 *
 * 這支腳本存在的理由：規範寫在文件裡沒有人會照做，寫成生成器就沒有選擇。
 * 每個元件強制產出五個檔案——元件、hook、story、測試、出口，
 * 少寫哪一個都會在 code review 被看見。
 *
 * 用法：npm run new -- status-banner
 */
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const input = process.argv[2];
if (!input) {
  console.error('請提供元件名稱，例如：npm run new -- status-banner');
  process.exit(1);
}

const toPascal = (s) =>
  s
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^(.)/, (_, c) => c.toUpperCase());

const toKebab = (s) =>
  s
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();

const Pascal = toPascal(input);
const kebab = toKebab(Pascal);
const dir = join(ROOT, 'src', 'components', kebab);

if (existsSync(dir)) {
  console.error(`元件已存在：src/components/${kebab}`);
  process.exit(1);
}

const files = {
  [`${Pascal}.tsx`]: `import { use${Pascal} } from './use${Pascal}';
import './${kebab}.css';

export interface ${Pascal}Props {
  /** TODO: 定義 props。空值占位由父層負責，元件不自己補 '--'。 */
  title: string;
  className?: string;
}

export function ${Pascal}({ title, className }: ${Pascal}Props) {
  const { rootClassName } = use${Pascal}({ className });

  return (
    <div className={rootClassName}>
      <span className="cl-${kebab}__title">{title}</span>
    </div>
  );
}
`,

  [`use${Pascal}.ts`]: `import { useMemo } from 'react';
import { cn } from '../../utils/cn';

export interface Use${Pascal}Options {
  className?: string;
}

/**
 * ${Pascal} 的行為與樣式推導。
 *
 * 邏輯放這裡、畫面放 .tsx：同一份行為要被第二個元件用到時才不必複製。
 */
export function use${Pascal}({ className }: Use${Pascal}Options) {
  const rootClassName = useMemo(() => cn('cl-${kebab}', className), [className]);

  return { rootClassName };
}
`,

  [`${kebab}.css`]: `.cl-${kebab} {
  font-family: var(--cl-font-family);
  color: var(--cl-text);
}

.cl-${kebab}__title {
  font-size: var(--cl-font-size-body);
  line-height: var(--cl-line-height-body);
}
`,

  [`${Pascal}.stories.tsx`]: `import type { Meta, StoryObj } from '@storybook/react-vite';
import { ${Pascal} } from './${Pascal}';

const meta = {
  title: 'Basic/${Pascal}',
  component: ${Pascal},
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  args: { title: '${Pascal}' },
} satisfies Meta<typeof ${Pascal}>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
`,

  [`__tests__/${Pascal}.test.tsx`]: `import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ${Pascal} } from '../${Pascal}';

describe('${Pascal}', () => {
  it('渲染標題', () => {
    render(<${Pascal} title="測試" />);
    expect(screen.getByText('測試')).toBeInTheDocument();
  });

  // TODO: 補上這個元件真正的行為測試。
  // 只有 render 測試等於沒測，改壞了也不會紅。
});
`,

  'index.ts': `export { ${Pascal} } from './${Pascal}';
export type { ${Pascal}Props } from './${Pascal}';
export { use${Pascal} } from './use${Pascal}';
`,
};

await mkdir(join(dir, '__tests__'), { recursive: true });

for (const [name, content] of Object.entries(files)) {
  await writeFile(join(dir, name), content, 'utf8');
}

// 自動掛到套件出口，少一個「忘了 export」的常見疏漏
const entryPath = join(ROOT, 'src', 'index.ts');
const entry = await readFile(entryPath, 'utf8');
const addition = `\nexport { ${Pascal} } from './components/${kebab}';\nexport type { ${Pascal}Props } from './components/${kebab}';\n`;
await writeFile(entryPath, entry.trimEnd() + '\n' + addition, 'utf8');

console.log(`已建立 src/components/${kebab}/`);
console.log(Object.keys(files).map((f) => `  ${f}`).join('\n'));
console.log('已更新 src/index.ts');
