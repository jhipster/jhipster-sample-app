import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { serverApiUrl } from 'app/config';

import { Registration } from './register.model';
import { RegisterService } from './register.service';

describe('RegisterService Service', () => {
  let service: RegisterService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting()],
    });

    service = TestBed.inject(RegisterService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('Service methods', () => {
    it('should call register endpoint with correct values', () => {
      // GIVEN
      const login = 'abc';
      const email = 'test@test.com';
      const password = 'pass';
      const langKey = 'FR';
      const registration = new Registration(login, email, password, langKey);

      // WHEN
      service.save(registration).subscribe();

      const testRequest = httpMock.expectOne({
        method: 'POST',
        url: `${serverApiUrl}api/register`,
      });

      // THEN
      expect(testRequest.request.body).toEqual({ email, langKey, login, password });
    });
  });
});
