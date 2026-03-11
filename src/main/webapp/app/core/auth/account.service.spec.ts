import { Mock, afterEach, beforeEach, describe, expect, it, vitest } from 'vitest';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { Account } from 'app/core/auth/account.model';
import { StateStorageService } from 'app/core/auth/state-storage.service';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { Authority } from 'app/shared/jhipster/constants';

import { AccountService } from './account.service';

function accountWithAuthorities(authorities: string[]): Account {
  return {
    activated: true,
    authorities,
    email: '',
    firstName: '',
    langKey: '',
    lastName: '',
    login: '',
    imageUrl: '',
  };
}

const mockFn = (value: string | null): Mock => vitest.fn(() => value);

describe('Account Service', () => {
  let service: AccountService;
  let applicationConfigService: ApplicationConfigService;
  let httpMock: HttpTestingController;
  let mockStorageService: StateStorageService;
  let mockRouter: Router;
  let mockTranslateService: TranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        provideHttpClientTesting(),
        {
          provide: StateStorageService,
          useValue: {
            clearUrl: vitest.fn(),
            getUrl: vitest.fn(),
          },
        },
      ],
    });

    service = TestBed.inject(AccountService);
    applicationConfigService = TestBed.inject(ApplicationConfigService);
    httpMock = TestBed.inject(HttpTestingController);
    mockStorageService = TestBed.inject(StateStorageService);
    mockRouter = TestBed.inject(Router);
    vitest.spyOn(mockRouter, 'navigateByUrl');

    mockTranslateService = TestBed.inject(TranslateService);
    vitest.spyOn(mockTranslateService, 'use');
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('save', () => {
    it('should call account saving endpoint with correct values', () => {
      // GIVEN
      const account = accountWithAuthorities([]);

      // WHEN
      service.save(account).subscribe();
      const testRequest = httpMock.expectOne({ method: 'POST', url: applicationConfigService.getEndpointFor('api/account') });
      testRequest.flush({});

      // THEN
      expect(testRequest.request.body).toEqual(account);
    });
  });

  describe('identity', () => {
    it('should set account after successful identity request', () => {
      const account = { ...accountWithAuthorities([]) };
      // When I call
      service.identity().subscribe();
      // And return account
      httpMock.expectOne({ method: 'GET' }).flush(account);
      // Then account signal has account value
      expect(service.account()).toBe(account);
    });

    it('should call /account only once if last call have not returned', () => {
      // When I call
      service.identity().subscribe();
      // Once more
      service.identity().subscribe();
      // Then there is only request
      const requests = httpMock.match({ method: 'GET' });
      expect(requests.length).toBe(1);
    });

    it('should call /account only once if not logged out after first authentication and should call /account again if user has logged out', () => {
      // Given the user is authenticated
      service.identity().subscribe();
      httpMock.expectOne({ method: 'GET' }).flush({});

      // When I call
      service.identity().subscribe();

      // Then there is no second request
      httpMock.expectNone({ method: 'GET' });

      // When I log out
      service.authenticate(null);
      // and then call
      service.identity().subscribe();

      // Then there is a new request
      const requests = httpMock.match({ method: 'GET' });
      expect(requests.length).toBe(1);
    });

    describe('should change the language on authentication if necessary', () => {
      it('should change language if user has not changed language manually', () => {
        // GIVEN
        mockStorageService.getLocale = mockFn(null);

        // WHEN
        service.identity().subscribe();
        httpMock.expectOne({ method: 'GET' }).flush({ ...accountWithAuthorities([]), langKey: 'accountLang' });

        // THEN
        expect(mockTranslateService.use).toHaveBeenCalledWith('accountLang');
      });

      it('should not change language if user has changed language manually', () => {
        // GIVEN
        mockStorageService.getLocale = mockFn('sessionLang');

        // WHEN
        service.identity().subscribe();
        httpMock.expectOne({ method: 'GET' }).flush({ ...accountWithAuthorities([]), langKey: 'accountLang' });

        // THEN
        expect(mockTranslateService.use).not.toHaveBeenCalled();
      });
    });

    describe('navigateToStoredUrl', () => {
      it('should navigate to the previous stored url post successful authentication', () => {
        // GIVEN
        mockStorageService.getUrl = mockFn('admin/users?page=0');

        // WHEN
        service.identity().subscribe();
        httpMock.expectOne({ method: 'GET' }).flush({});

        // THEN
        expect(mockStorageService.getUrl).toHaveBeenCalledTimes(1);
        expect(mockStorageService.clearUrl).toHaveBeenCalledTimes(1);
        expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('admin/users?page=0');
      });

      it('should not navigate to the previous stored url when authentication fails', () => {
        // WHEN
        service.identity().subscribe();
        httpMock.expectOne({ method: 'GET' }).error(new ProgressEvent(''));

        // THEN
        expect(mockStorageService.getUrl).not.toHaveBeenCalled();
        expect(mockStorageService.clearUrl).not.toHaveBeenCalled();
        expect(mockRouter.navigateByUrl).not.toHaveBeenCalled();
      });

      it('should not navigate to the previous stored url when no such url exists post successful authentication', () => {
        // GIVEN
        mockStorageService.getUrl = mockFn(null);

        // WHEN
        service.identity().subscribe();
        httpMock.expectOne({ method: 'GET' }).flush({});

        // THEN
        expect(mockStorageService.getUrl).toHaveBeenCalledTimes(1);
        expect(mockStorageService.clearUrl).not.toHaveBeenCalled();
        expect(mockRouter.navigateByUrl).not.toHaveBeenCalled();
      });
    });
  });

  describe('hasAnyAuthority', () => {
    describe('hasAnyAuthority string parameter', () => {
      it('should return false if user is not logged', () => {
        const hasAuthority = service.hasAnyAuthority(Authority.USER);
        expect(hasAuthority).toBe(false);
      });

      it('should return false if user is logged and has not authority', () => {
        service.authenticate(accountWithAuthorities([Authority.USER]));

        const hasAuthority = service.hasAnyAuthority(Authority.ADMIN);

        expect(hasAuthority).toBe(false);
      });

      it('should return true if user is logged and has authority', () => {
        service.authenticate(accountWithAuthorities([Authority.USER]));

        const hasAuthority = service.hasAnyAuthority(Authority.USER);

        expect(hasAuthority).toBe(true);
      });
    });

    describe('hasAnyAuthority array parameter', () => {
      it('should return false if user is not logged', () => {
        const hasAuthority = service.hasAnyAuthority([Authority.USER]);
        expect(hasAuthority).toBeFalsy();
      });

      it('should return false if user is logged and has not authority', () => {
        service.authenticate(accountWithAuthorities([Authority.USER]));

        const hasAuthority = service.hasAnyAuthority([Authority.ADMIN]);

        expect(hasAuthority).toBe(false);
      });

      it('should return true if user is logged and has authority', () => {
        service.authenticate(accountWithAuthorities([Authority.USER]));

        const hasAuthority = service.hasAnyAuthority([Authority.USER, Authority.ADMIN]);

        expect(hasAuthority).toBe(true);
      });
    });
  });
});
