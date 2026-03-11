import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { IUserManagement } from '../user-management.model';

import { UserManagementService } from './user-management.service';

describe('User Service', () => {
  let service: UserManagementService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting()],
    });

    service = TestBed.inject(UserManagementService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('Service methods', () => {
    it('should return User', () => {
      let expectedResult: string | undefined;

      service.find('user').subscribe(received => {
        expectedResult = received.login;
      });

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush({ id: 123, login: 'user' } as IUserManagement);
      expect(expectedResult).toEqual('user');
    });

    it('should propagate not found response', () => {
      let expectedResult = 0;

      service.find('user').subscribe({
        error: (error: HttpErrorResponse) => (expectedResult = error.status),
      });

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush('Invalid request parameters', {
        status: 404,
        statusText: 'Bad Request',
      });
      expect(expectedResult).toEqual(404);
    });
  });
});
