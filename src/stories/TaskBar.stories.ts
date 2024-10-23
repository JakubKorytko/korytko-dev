import '../styles/main.scss';
import type { Meta, StoryObj } from '@storybook/react';
import TaskBar from '@/app/[locale]/TaskBar';

const meta = {
  title: 'TaskBar',
  component: TaskBar,
} satisfies Meta<typeof TaskBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Test: Story = {
  args: {
  },
};
