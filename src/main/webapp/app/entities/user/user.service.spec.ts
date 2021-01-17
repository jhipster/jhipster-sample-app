import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { SERVER_API_URL } from 'app/app.constants';
import { User, IUser } from './user.model';

import { UserService } from './user.service';

describe('Service Tests', () => {
  describe('User Service', () => {
    let service: UserService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });

      service = TestBed.inject(UserService);
      httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
      httpMock.verify();
    });

    describe('Service methods', () => {
      it('should call correct URL', () => {
        service.query().subscribe();

        const req = httpMock.expectOne({ method: 'GET' });
        const resourceUrl = SERVER_API_URL + 'api/users';
        expect(req.request.url).toEqual(`${resourceUrl}`);
      });

      it('should return Users', () => {
        let expectedResult: IUser[] | null | undefined;

        service.query().subscribe(received => {
          expectedResult = received.body;
        });

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([new User(123, 'user')]);
        expect(expectedResult).toEqual([{ id: 123, login: 'user' }]);
      });

      it('should propagate not found response', () => {
        let expectedResult = 0;

        service.query().subscribe({
          error: (error: HttpErrorResponse) => (expectedResult = error.status),
        });

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush('Internal Server Error', {
          status: 500,
          statusText: 'Inernal Server Error',
        });
        expect(expectedResult).toEqual(500);
      });
    });
  });
});
