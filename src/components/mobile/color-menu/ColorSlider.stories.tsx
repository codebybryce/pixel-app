import type { Meta, StoryObj } from '@storybook/react-vite';

import ColorSlider from './ColorSlider';

const meta = {
  component: ColorSlider,
} satisfies Meta<typeof ColorSlider>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};