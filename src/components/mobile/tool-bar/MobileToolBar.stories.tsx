import type { Meta, StoryObj } from '@storybook/react-vite';

import MobileToolBar from './MobileToolBar';

const meta = {
  component: MobileToolBar,
} satisfies Meta<typeof MobileToolBar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {}
};