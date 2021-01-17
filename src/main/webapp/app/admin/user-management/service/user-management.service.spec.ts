import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { Authority } from 'app/config/authority.constants';
import { User } from '../user-management.model';
import { SERVER_API_URL } from 'app/app.constants';

import { UserManagementService } from './user-management.service';

describe('Service Tests', () => {
  describe('User Service', () => {
    let service: UserManagementService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });

      service = TestBed.inject(UserManagementService);
      httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
      httpMock.verify();
    });

    describe('Service methods', () => {
      it('should call correct URL', () => {
        service.find('user').subscribe();

        const req = httpMock.expectOne({ method: 'GET' });
        const resourceUrl = SERVER_API_URL + 'api/admin/users';
        expect(req.request.url).toEqual(`${resourceUrl}/user`);
      });

      it('should return User', () => {
        let expectedResult: string | undefined;

        service.find('user').subscribe(received => {
          expectedResult = received.login;
        });

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(new User(123, 'user'));
        expect(expectedResult).toEqual('user');
      });

      it('should return Authorities', () => {
        let expectedResult: string[] = [];

        service.authorities().subscribe(authorities => {
          expectedResult = authorities;
        });
        const req = httpMock.expectOne({ method: 'GET' });

        req.flush([Authority.USER, Authority.ADMIN]);
        expect(expectedResult).toEqual([Authority.USER, Authority.ADMIN]);
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
});
