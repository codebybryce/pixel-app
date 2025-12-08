import type { Meta, StoryObj } from '@storybook/react-vite';

import MenuBarMobile from './MenuBarMobile';

const meta = {
  component: MenuBarMobile,
} satisfies Meta<typeof MenuBarMobile>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};