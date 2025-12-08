import type { Meta, StoryObj } from '@storybook/react-vite';

import ToolSelectorRotary from './ToolSelectorRotary';

const meta = {
  component: ToolSelectorRotary,
} satisfies Meta<typeof ToolSelectorRotary>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {}
};