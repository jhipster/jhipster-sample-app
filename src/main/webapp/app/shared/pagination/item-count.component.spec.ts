import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { TranslateDirective } from 'app/shared/language/translate.directive';

import { ItemCountComponent } from './item-count.component';

describe('ItemCountComponent test', () => {
  let comp: ItemCountComponent;
  let fixture: ComponentFixture<ItemCountComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [TranslateModule.forRoot()],
        declarations: [ItemCountComponent, TranslateDirective],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemCountComponent);
    comp = fixture.componentInstance;
  });

  describe('UI logic tests', () => {
    it('should initialize with undefined', () => {
      expect(comp.first).toBeUndefined();
      expect(comp.second).toBeUndefined();
      expect(comp.total).toBeUndefined();
    });

    it('should change the content on page change', () => {
      // GIVEN
      comp.params = { page: 1, totalItems: 100, itemsPerPage: 10 };

      // THEN
      expect(comp.first).toBe(1);
      expect(comp.second).toBe(10);
      expect(comp.total).toBe(100);

      // GIVEN
      comp.params = { page: 2, totalItems: 100, itemsPerPage: 10 };

      // THEN
      expect(comp.first).toBe(11);
      expect(comp.second).toBe(20);
      expect(comp.total).toBe(100);
    });
  });
});
