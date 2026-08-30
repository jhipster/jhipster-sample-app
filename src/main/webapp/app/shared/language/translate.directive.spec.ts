import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslateService, provideTranslateService } from '@ngx-translate/core';

import TranslateDirective from './translate.directive';

@Component({
  imports: [TranslateDirective],
  template: `<div jhiTranslate="test"></div>`,
})
class TestTranslateDirective {}

describe('TranslateDirective Tests', () => {
  let fixture: ComponentFixture<TestTranslateDirective>;
  let translateService: TranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideTranslateService()],
    });
  });

  beforeEach(() => {
    translateService = TestBed.inject(TranslateService);
    fixture = TestBed.createComponent(TestTranslateDirective);
  });

  it('should change HTML', () => {
    const spy = vi.spyOn(translateService, 'get');

    fixture.detectChanges();

    expect(spy).toHaveBeenCalled();
  });
});
