import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ColorGridSelectComponent } from './color-grid-select.component';
import { COLOR_GRID_ITEM_SIZES } from './item';
import {
  COLOR_GRID_ITEMS,
  COLOR_GRID_SELECT,
  ColorGridItemComponent,
} from './item/item.component';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { input } from '@angular/core';

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
    component.items = input(COLOR_GRID_ITEMS);
    await fixture.whenStable()
    // fixture.componentRef.setInput('items',COLOR_GRID_ITEMS);
    // fixture.detectChanges();
    // fixture.componentRef.setInput('itemSize',COLOR_GRID_ITEM_SIZES[0]);
    // fixture.detectChanges();
    // fixture.componentRef.setInput('disabled',false);
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should bind inputs correctly', () => {
    expect(component.itemSize()).toBe(COLOR_GRID_ITEM_SIZES[0]);
  });
});
