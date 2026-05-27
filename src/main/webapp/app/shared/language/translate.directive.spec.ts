import { beforeEach, describe, expect, it, vitest } from 'vitest';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslateModule, TranslateService } from '@ngx-translate/core';

import TranslateDirective from './translate.directive';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslateDirective],
  template: `<div jhiTranslate="test"></div>`,
})
class TestTranslateDirective {}

describe('TranslateDirective Tests', () => {
  let fixture: ComponentFixture<TestTranslateDirective>;
  let translateService: TranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
    });
  });

  beforeEach(() => {
    translateService = TestBed.inject(TranslateService);
    fixture = TestBed.createComponent(TestTranslateDirective);
  });

  it('should change HTML', () => {
    const spy = vitest.spyOn(translateService, 'get');

    fixture.detectChanges();

    expect(spy).toHaveBeenCalled();
  });
});
