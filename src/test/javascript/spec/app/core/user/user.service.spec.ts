import { TestBed } from '@angular/core/testing';
import { JhiDateUtils } from 'ng-jhipster';

import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.model';
import { SERVER_API_URL } from 'app/app.constants';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('Service Tests', () => {
  describe('User Service', () => {
    let service: UserService;
    let httpMock;
    let expectedResult;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [JhiDateUtils]
      });

      expectedResult = {};
      service = TestBed.get(UserService);
      httpMock = TestBed.get(HttpTestingController);
    });

    afterEach(() => {
      httpMock.verify();
    });

    describe('Service methods', () => {
      it('should call correct URL', () => {
        service.find('user').subscribe(() => {});

        const req = httpMock.expectOne({ method: 'GET' });
        const resourceUrl = SERVER_API_URL + 'api/users';
        expect(req.request.url).toEqual(`${resourceUrl}/user`);
      });
      it('should return User', () => {
        service.find('user').subscribe(received => {
          expectedResult = received.login;
        });

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(new User(1, 'user'));
        expect(expectedResult).toEqual('user');
      });

      it('should return Authorities', () => {
        service.authorities().subscribe(_authorities => {
          expectedResult = _authorities;
        });
        const req = httpMock.expectOne({ method: 'GET' });

        req.flush(['ROLE_USER', 'ROLE_ADMIN']);
        expect(expectedResult).toEqual(['ROLE_USER', 'ROLE_ADMIN']);
      });

      it('should propagate not found response', () => {
        service.find('user').subscribe(null, (_error: any) => {
          expectedResult = _error.status;
        });

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush('Invalid request parameters', {
          status: 404,
          statusText: 'Bad Request'
        });
        expect(expectedResult).toEqual(404);
      });
    });
  });
});
