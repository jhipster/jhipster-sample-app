import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { serverApiUrl } from 'app/config';

import { HealthService } from './health.service';

describe('HealthService Service', () => {
  let service: HealthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting()],
    });

    service = TestBed.inject(HealthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('Service methods', () => {
    it('should call management/health endpoint with correct values', () => {
      // GIVEN
      let expectedResult;
      const checkHealth = {
        components: [],
      };

      // WHEN
      service.checkHealth().subscribe(received => {
        expectedResult = received;
      });
      const testRequest = httpMock.expectOne({
        method: 'GET',
        url: `${serverApiUrl}management/health`,
      });
      testRequest.flush(checkHealth);

      // THEN
      expect(expectedResult).toEqual(checkHealth);
    });
  });
});
