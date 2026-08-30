import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { Component, ElementRef, WritableSignal, signal, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { provideTranslateService } from '@ngx-translate/core';

import { Account, AccountService } from 'app/core/auth';

import HasAnyAuthorityDirective from './has-any-authority.directive';

@Component({
  imports: [HasAnyAuthorityDirective],
  template: `<div *jhiHasAnyAuthority="'ROLE_ADMIN'" #content></div>`,
})
class TestHasAnyAuthorityDirective {
  readonly content = viewChild<ElementRef>('content');
}

describe('HasAnyAuthorityDirective tests', () => {
  let currentAccount: WritableSignal<Account | null>;
  let hasAnyAuthority: Mock;

  beforeEach(() => {
    currentAccount = signal<Account | null>({ activated: true, authorities: [] } as any);
    hasAnyAuthority = vi.fn((): boolean => Boolean(currentAccount()));

    TestBed.configureTestingModule({
      providers: [
        provideTranslateService(),
        {
          provide: AccountService,
          useValue: {
            account: currentAccount,
            hasAnyAuthority,
          },
        },
      ],
    });
  });

  describe('set jhiHasAnyAuthority', () => {
    it('should show restricted content to user if user has required role', () => {
      // GIVEN
      const fixture = TestBed.createComponent(TestHasAnyAuthorityDirective);
      const comp = fixture.componentInstance;

      // WHEN
      fixture.detectChanges();

      // THEN
      expect(comp.content()).toBeDefined();
    });

    it('should not show restricted content to user if user has not required role', () => {
      // GIVEN
      currentAccount.set(null);
      const fixture = TestBed.createComponent(TestHasAnyAuthorityDirective);
      const comp = fixture.componentInstance;

      // WHEN
      fixture.detectChanges();

      // THEN
      expect(comp.content()).toBeUndefined();
    });
  });

  describe('change authorities', () => {
    it('should show or not show restricted content correctly if user authorities are changing', () => {
      // GIVEN
      const fixture = TestBed.createComponent(TestHasAnyAuthorityDirective);
      const comp = fixture.componentInstance;

      // WHEN
      fixture.detectChanges();

      // THEN
      expect(comp.content()).toBeDefined();

      // GIVEN
      currentAccount.set(null);

      // WHEN
      fixture.detectChanges();

      // THEN
      expect(comp.content()).toBeUndefined();

      // WHEN
      currentAccount.set({ activated: true, authorities: ['foo'] } as any);
      fixture.detectChanges();

      // THEN
      expect(comp.content()).toBeDefined();
    });
  });
});
