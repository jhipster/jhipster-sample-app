import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { serverApiUrl } from 'app/config';

import { PasswordResetInitService } from './password-reset-init.service';

describe('PasswordResetInit Service', () => {
  let service: PasswordResetInitService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting()],
    });

    service = TestBed.inject(PasswordResetInitService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('Service methods', () => {
    it('should call reset-password/init endpoint with correct values', () => {
      // GIVEN
      const mail = 'test@test.com';

      // WHEN
      service.save(mail).subscribe();

      const testRequest = httpMock.expectOne({
        method: 'POST',
        url: `${serverApiUrl}api/account/reset-password/init`,
      });

      // THEN
      expect(testRequest.request.body).toEqual(mail);
    });
  });
});
