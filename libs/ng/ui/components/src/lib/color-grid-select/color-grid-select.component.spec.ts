import { ComponentFixture, TestBed } from '@angular/core/testing';
import { COLOR_GRID_ITEM_SIZES } from './item';
import {
  COLOR_GRID_ITEMS,
  ColorGridItemComponent,
  ColorGridItemSize,
} from './item/item.component';
import { Component } from '@angular/core';
describe('ColorGridSelectComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  @Component({
    selector: 'brew-test-host',
    standalone: true,
    imports: [ColorGridItemComponent],
    template: `
      <app-color-grid-select
        [items]="items"
        [itemSize]="itemSize"
        [disabled]="disabled"
      ></app-color-grid-select>
    `,
  })
  class TestHostComponent {
    items: string[] = [];
    itemSize!: ColorGridItemSize;
    disabled = false;
  }

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    component.items = COLOR_GRID_ITEMS;
    component.itemSize = COLOR_GRID_ITEM_SIZES[0]
    fixture.detectChanges();
  });


  it('should create',() => {
    expect(component).toBeTruthy();
  })

});
