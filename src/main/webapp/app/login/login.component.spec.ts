jest.mock('@angular/router');
jest.mock('app/core/auth/account.service');
jest.mock('app/login/login.service');

import { ComponentFixture, TestBed, waitForAsync, inject, fakeAsync, tick } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { AccountService } from 'app/core/auth/account.service';

import { LoginService } from './login.service';
import { LoginComponent } from './login.component';

describe('Component Tests', () => {
  describe('LoginComponent', () => {
    let comp: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    let mockRouter: Router;
    let mockAccountService: AccountService;
    let mockLoginService: LoginService;

    beforeEach(
      waitForAsync(() => {
        TestBed.configureTestingModule({
          declarations: [LoginComponent],
          providers: [
            FormBuilder,
            AccountService,
            Router,
            {
              provide: LoginService,
              useValue: {
                login: jest.fn(() => of({})),
              },
            },
          ],
        })
          .overrideTemplate(LoginComponent, '')
          .compileComponents();
      })
    );

    beforeEach(() => {
      fixture = TestBed.createComponent(LoginComponent);
      comp = fixture.componentInstance;
      mockRouter = TestBed.inject(Router);
      mockLoginService = TestBed.inject(LoginService);
      mockAccountService = TestBed.inject(AccountService);
    });

    it('Should call accountService.identity on Init', () => {
      // GIVEN
      mockAccountService.identity = jest.fn(() => of(null));
      mockAccountService.getAuthenticationState = jest.fn(() => of(null));

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(mockAccountService.identity).toHaveBeenCalled();
    });

    it('Should call accountService.isAuthenticated on Init', () => {
      // GIVEN
      mockAccountService.identity = jest.fn(() => of(null));

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(mockAccountService.isAuthenticated).toHaveBeenCalled();
    });

    it('should navigate to home page on Init if authenticated=true', () => {
      // GIVEN
      mockAccountService.identity = jest.fn(() => of(null));
      mockAccountService.getAuthenticationState = jest.fn(() => of(null));
      mockAccountService.isAuthenticated = () => true;

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(mockRouter.navigate).toHaveBeenCalledWith(['']);
    });

    it('should authenticate the user and navigate to home page', inject(
      [],
      fakeAsync(() => {
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

        // WHEN/
        comp.login();
        tick(); // simulate async

        // THEN
        expect(comp.authenticationError).toEqual(false);
        expect(mockLoginService.login).toHaveBeenCalledWith(credentials);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['']);
      })
    ));
  });
});
