import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { serverApiUrl } from 'app/config';

import { PasswordService } from './password.service';

describe('Password Service', () => {
  let service: PasswordService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting()],
    });

    service = TestBed.inject(PasswordService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('Service methods', () => {
    it('should call change-password endpoint with correct values', () => {
      // GIVEN
      const password1 = 'password1';
      const password2 = 'password2';

      // WHEN
      service.save(password2, password1).subscribe();

      const testRequest = httpMock.expectOne({
        method: 'POST',
        url: `${serverApiUrl}api/account/change-password`,
      });

      // THEN
      expect(testRequest.request.body).toEqual({ currentPassword: password1, newPassword: password2 });
    });
  });
});
