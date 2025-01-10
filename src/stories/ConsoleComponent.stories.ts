import type { Meta, StoryObj } from '@storybook/react';

import ConsoleComponent from '@/app/[locale]/ConsoleComponent/ConsoleComponent';

const meta = {
  title: 'ConsoleComponent',
  component: ConsoleComponent,
} satisfies Meta<typeof ConsoleComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ConsoleComponentStory: Story = {
  args: {
    closeApp: () => {},
    minimizeApp: () => {},
    visible: true,
  },
};
