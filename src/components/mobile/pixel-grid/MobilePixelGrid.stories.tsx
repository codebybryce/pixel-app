import type { Meta, StoryObj } from '@storybook/react-vite';

import MobilePixelGrid from './MobilePixelGrid';

const meta = {
  component: MobilePixelGrid,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
} satisfies Meta<typeof MobilePixelGrid>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    columns: 8,
    rows: 8
  }
};