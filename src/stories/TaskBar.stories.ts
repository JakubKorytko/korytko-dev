import type { Meta, StoryObj } from '@storybook/react';

import TaskBar from '@/app/[locale]/TaskBar/TaskBar';

import '../styles/main.scss';

const meta = {
  title: 'TaskBar',
  component: TaskBar,
} satisfies Meta<typeof TaskBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TaskBarStory: Story = {
  args: {
  },
};
