import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  NgZone,
  OnDestroy,
  Output,
  QueryList,
  Signal,
  ViewChildren,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  COLOR_GRID_ITEMS,
  COLOR_GRID_ITEM_SIZES,
  ColorGridItemComponent,
  ColorGridSelect,
  COLOR_GRID_SELECT,
  ITEM_SIZE,
  ColorGridItemSize,
} from './item';
import { FocusKeyManager } from '@angular/cdk/a11y';
import {
  DOWN_ARROW,
  LEFT_ARROW,
  RIGHT_ARROW,
  UP_ARROW,
} from '@angular/cdk/keycodes';
import { chunk } from 'lodash';
import { _getFocusedElementPierceShadowDom } from '@angular/cdk/platform';
import { Subject, takeUntil } from 'rxjs';

/**
 *
 * A lot of the code has been inspired by
 * [MatSelectionList](https://github.com/angular/components/blob/main/src/material/list/selection-list.ts)
 * for focus management and accessibility.
 *
 * @todo
 * - Handle {@link ColorGridSelectComponent._onKeydown}
 * - Calculate {@link ColorGridSelectComponent.grid}
 *
 * @link https://blog.angular-university.io/angular-custom-form-controls/
 */
@Component({
  selector: 'brew-color-grid-select',
  standalone: true,
  imports: [CommonModule, ColorGridItemComponent],
  templateUrl: './color-grid-select.component.html',
  styleUrl: './color-grid-select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: ColorGridSelectComponent,
    },
    {
      provide: COLOR_GRID_SELECT,
      useExisting: ColorGridSelectComponent,
    },
  ],
})
export class ColorGridSelectComponent
  implements ControlValueAccessor, ColorGridSelect, AfterViewInit, OnDestroy
{
  /** Emits when the list has been destroyed. */
  private readonly _destroyed = new Subject<void>();



  private readonly _el = inject(ElementRef<ColorGridSelectComponent>);

  private readonly _ngZone = inject(NgZone);

  private _itemsPerRow = 5;

  private _keyManager!: FocusKeyManager<ColorGridItemComponent>;

  private _value?: string | null | undefined = COLOR_GRID_ITEMS[0];

  private _disabled = false;
  private _touched = false;

  private _onTouched = (): void => void 0;
  private _onChange = (val?: string | null): void => void 0;

  @HostBinding('attr.tabindex')
  private get _tabIndex() {
    return this.disabled() ? -1 : 0;
  }

  @HostBinding('role')
  private get _role() {
    return 'radiogroup';
  }

  @ViewChildren(ColorGridItemComponent)
  public colorItems!: QueryList<ColorGridItemComponent>;

  items = input<string[]>(COLOR_GRID_ITEMS)

  public itemSize = input<ColorGridItemSize>(COLOR_GRID_ITEM_SIZES[0])


  // can not be converted as input signal's value cant be updated
  @Input()
  public get value(): string | null | undefined {
    return this._value;
  }

  public set value(value: string | null | undefined) {
    this._value = value;
    // this._updateKeyManagerActiveItem();
    const activeItem = this._keyManager?.activeItemIndex ?? 0;
    this._setActiveOption(activeItem);
  }

public disabled = input<boolean>(false)

  @Output()
  public readonly valueChange = new EventEmitter<string | null | undefined>();

  width = signal(0);

  itemSizeInPx: Signal<number> = computed(() => ITEM_SIZE[this.itemSize()]);

  itemsPerRow: Signal<number> = computed(() => {
    return this.width() === 0
      ? this._itemsPerRow // any item size
      : this.width() / this.itemSizeInPx();
  });

  /** @todo logic to generate a grid of colors to allow navigation */
  public readonly grid = computed((): string[][] => {
    // Calculate the number of items that can be added per row
    // The calculation will be based on the available width of the element width and itemSize
    //   this._itemsPerRow = ...
    return chunk(this.items(), this.itemsPerRow());
  });

  public get keyMan() {
    return this._keyManager;
  }

  // ControlValueAccessor
  public writeValue(val: string): void {
    this.value = val;
  }

  public registerOnChange(onChange: (val?: string | null) => void): void {
    this._onChange = onChange;
  }

  public registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this._disabled = isDisabled;
  }
  // /ControlValueAccessor

  /** Marks the component as touched */
  public markAsTouched() {
    if (!this._touched) {
      this._onTouched();
      this._touched = true;
    }
  }

  public emitChange(value?: string | null | undefined) {
    this.markAsTouched();

    if (!this._disabled) {
      this.value = value;
      this._onChange(this.value);
      this.valueChange.emit(value);
    }
  }

  @HostListener('window:resize', ['$event'])
  public onResize(event: any) {
      this.width.set(event.target.innerWidth);
  }

  public ngAfterViewInit() {
    this.width.set(this._el.nativeElement.offsetWidth);
    this._keyManager = new FocusKeyManager(this.colorItems)
      .withHomeAndEnd()
      .withHorizontalOrientation('ltr')
      .skipPredicate(() => this.disabled())
      .withWrap();

    // Set the initial focus.
    this._resetActiveOption();

    // Move the tabindex to the currently-focused list item.
    this._keyManager.change.subscribe((activeItemIndex) => {
      this._setActiveOption(activeItemIndex);
    });

    // If the active item is removed from the list, reset back to the first one.
    this.colorItems.changes.pipe(takeUntil(this._destroyed)).subscribe(() => {
      const activeItem = this._keyManager.activeItem;

      if (!activeItem || this.colorItems.toArray().indexOf(activeItem) === -1) {
        this._resetActiveOption();
      }
    });

    // These events are bound outside the zone, because they don't change
    // any change-detected properties and they can trigger timeouts.
    this._ngZone.runOutsideAngular(() => {
      this._el.nativeElement.addEventListener('focusin', this._handleFocusin);
      this._el.nativeElement.addEventListener('focusout', this._handleFocusout);
    });
  }

  public ngOnDestroy() {
    this._keyManager.destroy();
    this._el.nativeElement.removeEventListener('focusin', this._handleFocusin);
    this._el.nativeElement.removeEventListener(
      'focusout',
      this._handleFocusout
    );

    this._destroyed.next();
    this._destroyed.complete();
  }

  /**
   * @todo
   * The logic to decide how to navigate inside the grid when the
   * up, down, left and right buttons are pressed
   */
  @HostListener('keydown', ['$event'])
  private _onKeydown(event: KeyboardEvent) {
    if (this.disabled()) {
      event.preventDefault();
      this._resetActiveOption();
      return;
    }
    let itemCalc;
    const activeItem = this._keyManager?.activeItemIndex ?? 0;
    switch (event.keyCode) {
      case UP_ARROW:
        itemCalc = activeItem - Math.trunc(this.itemsPerRow());
        if (itemCalc >= 0) {
          this._setActiveOption(Math.trunc(itemCalc));
        }
        break;
      case DOWN_ARROW:
        itemCalc = activeItem + Math.trunc(this.itemsPerRow());
        if (itemCalc < this.items().length) {
          this._setActiveOption(Math.trunc(itemCalc));
        }
        break;
      case LEFT_ARROW:
        this._setActiveOption(activeItem - 1);

        break;
      case RIGHT_ARROW:
        this._setActiveOption(activeItem + 1);

        break;
    }
  }

  /** Handles focusout events within the list. */
  private _handleFocusout = () => {
    // Focus takes a while to update so we have to wrap our call in a timeout.
    setTimeout(() => {
      if (!this._containsFocus()) {
        this._resetActiveOption();
      }
    });
  };

  /** Handles focusin events within the list. */
  private _handleFocusin = (event: FocusEvent) => {
    const activeIndex = this.colorItems
      .toArray()
      .findIndex((item) =>
        item.elRef.nativeElement.contains(event.target as HTMLElement)
      );

    if (activeIndex > -1) {
      this._setActiveOption(activeIndex);
    } else {
      this._resetActiveOption();
    }
  };

  /**
   * Sets an option as active.
   * @param index Index of the active option. If set to -1, no option will be active.
   */
  private _setActiveOption(index: number) {
    this.colorItems?.forEach((item, itemIndex) => {
      item.setTabindex(itemIndex === index ? 0 : -1);
    });

    this._keyManager?.setActiveItem(index);
  }

  /**
   * Resets the active option. When the list is disabled, remove all options from to the tab order.
   * Otherwise, focus the first selected option.
   */
  private _resetActiveOption() {
    if (this.disabled()) {
      this._setActiveOption(-1);
      return;
    }

    const activeItem =
      this.colorItems.find((item) => item.checked && !item.disabled) ||
      this.colorItems.first;

    const index = activeItem
      ? this.colorItems.toArray().indexOf(activeItem)
      : -1;

    this._setActiveOption(index);
  }

  /** Returns whether the focus is currently within the list. */
  private _containsFocus() {
    const activeElement = _getFocusedElementPierceShadowDom();
    return activeElement && this._el.nativeElement.contains(activeElement);
  }
}
