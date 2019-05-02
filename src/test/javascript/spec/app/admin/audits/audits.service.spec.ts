import { TestBed } from '@angular/core/testing';

import { AuditsService } from 'app/admin/audits/audits.service';
import { Audit } from 'app/admin/audits/audit.model';
import { SERVER_API_URL } from 'app/app.constants';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('Service Tests', () => {
  describe('Audits Service', () => {
    let service: AuditsService;
    let httpMock;
    let expectedResult;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule]
      });

      expectedResult = {};
      service = TestBed.get(AuditsService);
      httpMock = TestBed.get(HttpTestingController);
    });

    afterEach(() => {
      httpMock.verify();
    });

    describe('Service methods', () => {
      it('should call correct URL', () => {
        service.query({}).subscribe(() => {});

        const req = httpMock.expectOne({ method: 'GET' });
        const resourceUrl = SERVER_API_URL + 'management/audits';
        expect(req.request.url).toEqual(resourceUrl);
      });

      it('should return Audits', () => {
        const audit = new Audit({ remoteAddress: '127.0.0.1', sessionId: '123' }, 'user', '20140101', 'AUTHENTICATION_SUCCESS');

        service.query({}).subscribe(received => {
          expectedResult = received;
        });

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([audit]);
        expect(expectedResult.body[0]).toEqual(audit);
      });

      it('should propagate not found response', () => {
        service.query({}).subscribe(null, (_error: any) => {
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
