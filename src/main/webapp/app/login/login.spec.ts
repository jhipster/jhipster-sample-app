import { beforeEach, describe, expect, it, vitest } from 'vitest';
import { ElementRef, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Navigation, Router } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';

import { AccountService } from 'app/core/auth/account.service';

import Login from './login';
import { LoginService } from './login.service';

describe('Login', () => {
  let comp: Login;
  let fixture: ComponentFixture<Login>;
  let mockRouter: Router;
  let mockAccountService: AccountService;
  let mockLoginService: LoginService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {},
        },
        {
          provide: AccountService,
          useValue: {
            isAuthenticated: vitest.fn(),
          },
        },
        {
          provide: LoginService,
          useValue: {
            login: vitest.fn(() => of({})),
          },
        },
      ],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Login);
    comp = fixture.componentInstance;
    mockRouter = TestBed.inject(Router);
    vitest.spyOn(mockRouter, 'navigate');
    mockLoginService = TestBed.inject(LoginService);
    mockAccountService = TestBed.inject(AccountService);
  });

  describe('ngOnInit', () => {
    it('should call accountService.identity on Init', () => {
      // GIVEN
      mockAccountService.identity = vitest.fn(() => of(null));

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(mockAccountService.identity).toHaveBeenCalled();
    });

    it('should call accountService.isAuthenticated on Init', () => {
      // GIVEN
      mockAccountService.identity = vitest.fn(() => of(null));

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(mockAccountService.isAuthenticated).toHaveBeenCalled();
    });

    it('should navigate to home page on Init if authenticated=true', () => {
      // GIVEN
      mockAccountService.identity = vitest.fn(() => of(null));
      mockAccountService.isAuthenticated = () => true;

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(mockRouter.navigate).toHaveBeenCalledWith(['']);
    });
  });

  describe('ngAfterViewInit', () => {
    it('should set focus to username input after the view has been initialized', () => {
      // GIVEN
      const node = {
        focus: vitest.fn(),
      };
      comp.username = signal(new ElementRef(node));

      // WHEN
      comp.ngAfterViewInit();

      // THEN
      expect(node.focus).toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should authenticate the user and navigate to home page', () => {
      // GIVEN
      const credentials = {
        username: 'admin',
        password: 'admin',
        rememberMe: true,
      };

      comp.loginForm.patchValue({
        username: 'admin',
        password: 'admin',
        rememberMe: true,
      });

      // WHEN
      comp.login();

      // THEN
      expect(comp.authenticationError()).toEqual(false);
      expect(mockLoginService.login).toHaveBeenCalledWith(credentials);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['']);
    });

    it('should authenticate the user but not navigate to home page if authentication process is already routing to cached url from localstorage', () => {
      // GIVEN
      vitest.spyOn(mockRouter, 'currentNavigation').mockReturnValue({} as Navigation);

      // WHEN
      comp.login();

      // THEN
      expect(comp.authenticationError()).toEqual(false);
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });

    it('should stay on login form and show error message on login error', () => {
      // GIVEN
      mockLoginService.login = vitest.fn(() => throwError(Error));

      // WHEN
      comp.login();

      // THEN
      expect(comp.authenticationError()).toEqual(true);
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });
  });
});
