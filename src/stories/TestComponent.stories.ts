import type { Meta, StoryObj } from '@storybook/react'
import TestComponent from '@/app/[locale]/TestComponent'

const meta = {
  title: 'TestComponent',
  component: TestComponent
} satisfies Meta<typeof TestComponent>

export default meta
type Story = StoryObj<typeof meta>

export const Test: Story = {
  args: {
    messages: {
      title: 'hello',
      content: 'world'
    }
  }
}
