import type { Meta, StoryObj } from '@storybook/react';

import ConsoleContent from '@/app/[locale]/ConsoleComponent/ConsoleContent';

const meta = {
  title: 'ConsoleContent',
  component: ConsoleContent,
  decorators: [
    (Story) => (
      <div style={{
        height: '500px',
        width: '700px',
        display: 'flex',
        position: 'relative',
        backgroundColor: 'black',
      }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ConsoleContent>;

export default meta;
type Story = StoryObj<typeof meta>;

const text = [
  'Welcome to korytko.dev 1.0.0 LTS (Web)',
  '',
  '* GitHub: JakubKorytko',
  '* Contact: jakub@korytko.me',
  '* Linkedin: jakub-korytko',
  '',
  'This message is shown once a day. To disable it please create the /home/jakub/.hushlogin file.',
  '\n',
];

export const ConsoleComponentStory: Story = {
  args: {
    children: (
      <ConsoleContent.Line>
        <ConsoleContent.Text>
          {text}
        </ConsoleContent.Text>
      </ConsoleContent.Line>
    ),
    inputValue: 'pic.sh -s 1 && mefetch',
  },
};
