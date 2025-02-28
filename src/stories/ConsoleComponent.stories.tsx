import type { Meta, StoryObj } from '@storybook/react';

import ConsoleComponent from '@/app/[locale]/ConsoleComponent/ConsoleComponent';

const meta = {
  title: 'ConsoleComponent',
  component: ConsoleComponent,
  decorators: [
    (Story) => (
      <div style={{
        height: '500px',
        width: '700px',
        display: 'flex',
        justifyContent: 'center',
        position: 'relative',
        alignItems: 'center',
        backgroundColor: 'beige',
      }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ConsoleComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ConsoleComponentStory: Story = {
  args: {
    closeApp: () => {},
    minimizeApp: () => {},
    visible: true,
    sections: {
      'About me': '#',
      'About you': '#',
    },
  },
};
