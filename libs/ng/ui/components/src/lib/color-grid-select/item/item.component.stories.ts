import type { Meta, StoryObj } from '@storybook/angular';
import { input } from '@angular/core';
import {
  COLOR_GRID_ITEMS,
  COLOR_GRID_ITEM_SIZES,
  ColorGridItemComponent,
  ColorGridItemSize,
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
    size: input<ColorGridItemSize>(COLOR_GRID_ITEM_SIZES[0]),
    checked: false,
  },
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
    size: input<ColorGridItemSize>(COLOR_GRID_ITEM_SIZES[0]),
    checked: true,
  },
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
    size: input<ColorGridItemSize>(COLOR_GRID_ITEM_SIZES[0]),
    checked: true,
    disabled: true,
  },
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
