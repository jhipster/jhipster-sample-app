import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { serverApiUrl } from 'app/config';

import { PasswordResetFinishService } from './password-reset-finish.service';

describe('PasswordResetFinish Service', () => {
  let service: PasswordResetFinishService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting()],
    });

    service = TestBed.inject(PasswordResetFinishService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('Service methods', () => {
    it('should call reset-password/finish endpoint with correct values', () => {
      // GIVEN
      const key = 'abc';
      const newPassword = 'password';

      // WHEN
      service.save(key, newPassword).subscribe();

      const testRequest = httpMock.expectOne({
        method: 'POST',
        url: `${serverApiUrl}api/account/reset-password/finish`,
      });

      // THEN
      expect(testRequest.request.body).toEqual({ key, newPassword });
    });
  });
});
