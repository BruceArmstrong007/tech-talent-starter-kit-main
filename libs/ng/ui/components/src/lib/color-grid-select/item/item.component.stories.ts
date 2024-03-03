import type { Meta, StoryObj } from '@storybook/angular';
import {
  COLOR_GRID_ITEMS,
  COLOR_GRID_ITEM_SIZES,
  ColorGridItemComponent,
} from './item.component';

const meta: Meta<ColorGridItemComponent> = {
  component: ColorGridItemComponent,
  title: 'ItemComponent',
};
export default meta;
type Story = StoryObj<ColorGridItemComponent>;

export const Primary: Story = {
  args: {
    value: COLOR_GRID_ITEMS[0],
    size: COLOR_GRID_ITEM_SIZES[0],
    checked: false,
  } as any,
  argTypes: {
    value: {
      control: 'select',
      options: COLOR_GRID_ITEMS,
    },
    size: {
      control: 'radio',
      options: COLOR_GRID_ITEM_SIZES,
    },
  },
};

export const Selected: Story = {
  args: {
    value: COLOR_GRID_ITEMS[0],
    size: COLOR_GRID_ITEM_SIZES[0],
    checked: true,
  } as any,
  argTypes: {
    value: {
      control: 'select',
      options: COLOR_GRID_ITEMS,
    },
    size: {
      control: 'radio',
      options: COLOR_GRID_ITEM_SIZES,
    },
  },
};

export const Disable: Story = {
  args: {
    value: COLOR_GRID_ITEMS[0],
    size: COLOR_GRID_ITEM_SIZES[0],
    checked: true,
    disabled: true,
  } as any,
  argTypes: {
    value: {
      control: 'select',
      options: COLOR_GRID_ITEMS,
    },
    size: {
      control: 'radio',
      options: COLOR_GRID_ITEM_SIZES,
    },
  },
};
