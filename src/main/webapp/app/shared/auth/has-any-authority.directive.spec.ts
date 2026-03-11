import { type Mock, beforeEach, describe, expect, it, vitest } from 'vitest';
import { Component, ElementRef, WritableSignal, signal, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { TranslateModule } from '@ngx-translate/core';

import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';

import HasAnyAuthorityDirective from './has-any-authority.directive';

@Component({
  imports: [HasAnyAuthorityDirective],
  template: `<div *jhiHasAnyAuthority="'ROLE_ADMIN'" #content></div>`,
})
class TestHasAnyAuthorityDirective {
  content = viewChild<ElementRef>('content');
}

describe('HasAnyAuthorityDirective tests', () => {
  let currentAccount: WritableSignal<Account | null>;
  let hasAnyAuthority: Mock;

  beforeEach(() => {
    currentAccount = signal<Account | null>({ activated: true, authorities: [] } as any);
    hasAnyAuthority = vitest.fn((): boolean => Boolean(currentAccount()));

    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
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
      expect(comp.content).toBeDefined();
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
      expect(comp.content).toBeDefined();
    });
  });
});
