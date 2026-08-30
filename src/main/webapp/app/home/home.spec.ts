import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { provideTranslateService } from '@ngx-translate/core';

import { AccountService } from 'app/core/auth';

import Home from './home';

describe('Home Component', () => {
  let comp: Home;
  let fixture: ComponentFixture<Home>;
  let mockRouter: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideTranslateService(),
        {
          provide: AccountService,
        },
      ],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Home);
    comp = fixture.componentInstance;

    mockRouter = TestBed.inject(Router);
    vi.spyOn(mockRouter, 'navigate');
  });

  describe('login', () => {
    it('should navigate to /login on login', () => {
      // WHEN
      comp.login();

      // THEN
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    });
  });
});
