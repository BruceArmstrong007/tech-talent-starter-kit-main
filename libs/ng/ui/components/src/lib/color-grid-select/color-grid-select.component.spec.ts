import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { ColorGridSelectComponent } from './color-grid-select.component';
import {
  COLOR_GRID_ITEM_SIZES,
  ColorGridItemSize,
} from './item';
import { input } from '@angular/core';
import {
  COLOR_GRID_SELECT,
  ColorGridItemComponent,
  COLOR_GRID_ITEMS,
} from './item/item.component';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

describe('ColorGridSelectComponent', () => {
  let component: ColorGridSelectComponent;
  let fixture: ComponentFixture<ColorGridSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColorGridSelectComponent, ColorGridItemComponent],
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
    }).compileComponents();

    fixture = TestBed.createComponent(ColorGridSelectComponent);
    component = fixture.componentInstance;
    component.items = input<string[]>(COLOR_GRID_ITEMS);
    component.itemSize = input<ColorGridItemSize>(COLOR_GRID_ITEM_SIZES[0]);
    component.disabled = input(false);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('should bind inputs correctly', () => {
  //   expect(component.itemSize()).toBe(COLOR_GRID_ITEM_SIZES[0]);
  // });
});
