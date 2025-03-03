import type { Preview } from '@storybook/react';
import { Noto_Sans } from 'next/font/google';

import '../src/styles/main.scss';

const notoSans = Noto_Sans({ subsets: ['latin'] });

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <main className={notoSans.className}>
        <Story />
      </main>
    ),
  ],
};

export default preview;
