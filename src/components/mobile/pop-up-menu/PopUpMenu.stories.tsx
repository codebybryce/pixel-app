import type { Meta, StoryObj } from '@storybook/react-vite';

import PopUpMenu from './PopUpMenu';

const meta = {
  component: PopUpMenu,
} satisfies Meta<typeof PopUpMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    screenPosition: 'bl',
    title: "color"
  }
};