import type { Preview } from '@storybook/react-vite';
import '../src/styles/tokens.css';

const preview: Preview = {
  parameters: {
    controls: { matchers: { color: /(background|color)$/i } },
    backgrounds: {
      options: { app: { name: 'app', value: '#F7F8FA' } },
    },
  },
  initialGlobals: { backgrounds: { value: 'app' } },
};

export default preview;
