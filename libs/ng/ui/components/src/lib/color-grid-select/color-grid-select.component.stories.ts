import type { Meta, StoryObj } from '@storybook/angular';
import { ColorGridSelectComponent } from './color-grid-select.component';

import {
  userEvent,
  within,
  screen,
  fireEvent,
} from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { COLOR_GRID_ITEMS, COLOR_GRID_ITEM_SIZES } from './item';

const meta: Meta<ColorGridSelectComponent> = {
  component: ColorGridSelectComponent,
  title: 'ColorGridSelectComponent',
  args: {
    itemSize: COLOR_GRID_ITEM_SIZES[0],
    disabled: false,
  } as any,
  argTypes: {
    value: {
      control: { type: 'select' },
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

    await step('Default first color selected', async () => {
      await expect((await screen.findAllByRole('radio'))[0]).toHaveAttribute(
        'aria-selected',
        'true'
      );
    });

    await step(
      'should click the grid color and the aria-selected should be true',
      async () => {
        await fireEvent.click((await screen.findAllByRole('radio'))[4]);
        await expect((await screen.findAllByRole('radio'))[4]).toHaveAttribute(
          'aria-selected',
          'true'
        );
      }
    );

    await step('Focus and use keyboard', async () => {
      await colorGrid.focus();

      await userEvent.type(colorGrid, '{ArrowRight}', {
        delay: 600,
      });

      await userEvent.keyboard('{ArrowRight}');

      await userEvent.type(colorGrid, '{ArrowRight}');

      await fireEvent.keyUp(colorGrid, {
        key: 'ArrowRight',
        keycode: 39,
        charCode: 39,
      });
      await fireEvent.keyUp(colorGrid, {
        key: 'ArrowRight',
        charCode: 39,
        keycode: 39,
      });
      await fireEvent.keyUp(colorGrid, {
        key: 'ArrowLeft',
        keycode: 37,
        charCode: 37,
      });
      await fireEvent.keyUp(colorGrid, {
        key: 'ArrowDown',
        keycode: 40,
        charCode: 40,
      });
    });
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  } as any,

  play: async ({ step }) => {
    await step(
      'should click the grid color and the aria-selected should be false',
      async () => {
        await fireEvent.click((await screen.findAllByRole('radio'))[4]);
        expect((await screen.findAllByRole('radio'))[4]).toHaveAttribute(
          'aria-selected',
          'false'
        );
      }
    );
  },
};

export const Selected: Story = {
  args: {
    value: COLOR_GRID_ITEMS[5],
  },
  play: async ({ step }) => {
    await step('Default first color selected', async () => {
      await expect((await screen.findAllByRole('radio'))[5]).toHaveAttribute(
        'aria-selected',
        'true'
      );
    });
  },
};
