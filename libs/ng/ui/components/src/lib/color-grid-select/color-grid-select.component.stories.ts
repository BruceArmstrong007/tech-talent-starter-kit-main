import type { Meta, StoryObj } from '@storybook/angular';
import { ColorGridSelectComponent } from './color-grid-select.component';

import { userEvent, within, screen } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { COLOR_GRID_ITEMS, COLOR_GRID_ITEM_SIZES, ColorGridItemSize } from './item';
import { input } from '@angular/core';

const meta: Meta<ColorGridSelectComponent> = {
  component: ColorGridSelectComponent,
  title: 'ColorGridSelectComponent',
  args: {
    value: COLOR_GRID_ITEMS[0],
    itemSize: input<ColorGridItemSize>(COLOR_GRID_ITEM_SIZES[0]),
    disabled: input(false),
  },
  argTypes: {
    value: {
      control: 'select',
      options: COLOR_GRID_ITEMS,
    },
    itemSize: {
      control: 'radio',
      options: COLOR_GRID_ITEM_SIZES,
    },
    valueChange: { action: 'valueChange' },
  },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
  render: (args) => ({
    props: args,
    template: `
    <brew-color-grid-select
      [value]="value"
      [itemSize]="itemSize"
      [valueChange]="valueChange($event)"
      [disabled]="disabled"
    />

    <button>Submit</button>
  `,
  }),
};
export default meta;
type Story = StoryObj<ColorGridSelectComponent>;

export const Default: Story = {
  args: {},
  play: async ({ args, canvasElement, step }) => {
    const colorGrid = within(canvasElement).getByRole('radiogroup');
    colorGrid.focus();

    await step('Focus and use keyboard', async () => {
      userEvent.type(colorGrid, '{ArrowRight}', {
        delay: 600,
      });
    });
    const checkedRadioButton = await screen.getByRole('radio', {
      checked: true,
    });
    await expect(Number(checkedRadioButton.id.split('-').pop())).toBe(2);
  },
};

export const Disabled: Story = {
  args: {
    disabled: input(true),
  },
};

export const Selected: Story = {
  args: {},
};
