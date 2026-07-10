import { beforeEach, describe, expect, it } from 'vitest';
import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideTranslateService } from '@ngx-translate/core';

import ItemCount from './item-count';

describe('ItemCount test', () => {
  let comp: ItemCount;
  let compRef: ComponentRef<ItemCount>;
  let fixture: ComponentFixture<ItemCount>;
  const inputParams = 'params';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideTranslateService()],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemCount);
    comp = fixture.componentInstance;
    compRef = fixture.componentRef;
  });

  describe('UI logic tests', () => {
    it('should initialize with undefined', () => {
      expect(comp.first()).toBeUndefined();
      expect(comp.second()).toBeUndefined();
      expect(comp.total()).toBeUndefined();
    });

    it('should set calculated numbers to undefined if the page value is not yet defined', () => {
      // GIVEN
      compRef.setInput(inputParams, { page: undefined, totalItems: 0, itemsPerPage: 10 });

      // THEN
      expect(comp.first()).toBeUndefined();
      expect(comp.second()).toBeUndefined();
    });

    it('should change the content on page change', () => {
      // GIVEN
      compRef.setInput(inputParams, { page: 1, totalItems: 100, itemsPerPage: 10 });

      // THEN
      expect(comp.first()).toBe(1);
      expect(comp.second()).toBe(10);
      expect(comp.total()).toBe(100);

      // GIVEN
      compRef.setInput(inputParams, { page: 2, totalItems: 100, itemsPerPage: 10 });

      // THEN
      expect(comp.first()).toBe(11);
      expect(comp.second()).toBe(20);
      expect(comp.total()).toBe(100);
    });

    it('should set the second number to totalItems if this is the last page which contains less than itemsPerPage items', () => {
      // GIVEN
      compRef.setInput(inputParams, { page: 2, totalItems: 16, itemsPerPage: 10 });

      // THEN
      expect(comp.first()).toBe(11);
      expect(comp.second()).toBe(16);
      expect(comp.total()).toBe(16);
    });
  });
});
