import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { AuditsService, AuditsQuery } from 'app/admin/audits/audits.service';
import { Audit } from 'app/admin/audits/audit.model';
import { SERVER_API_URL } from 'app/app.constants';

describe('Service Tests', () => {
  describe('Audits Service', () => {
    let service: AuditsService;
    let httpMock: HttpTestingController;
    const fakeRequest: AuditsQuery = { page: 0, size: 0, sort: [], fromDate: '', toDate: '' };

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });

      service = TestBed.get(AuditsService);
      httpMock = TestBed.get(HttpTestingController);
    });

    afterEach(() => {
      httpMock.verify();
    });

    describe('Service methods', () => {
      it('should call correct URL', () => {
        service.query(fakeRequest).subscribe();

        const req = httpMock.expectOne({ method: 'GET' });
        const resourceUrl = SERVER_API_URL + 'management/audits';
        expect(req.request.url).toEqual(resourceUrl);
      });

      it('should return Audits', () => {
        let expectedResult: HttpResponse<Audit[]> = new HttpResponse({ body: [] });
        const audit = new Audit({ remoteAddress: '127.0.0.1', sessionId: '123' }, 'user', '20140101', 'AUTHENTICATION_SUCCESS');

        service.query(fakeRequest).subscribe(received => {
          expectedResult = received;
        });

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([audit]);
        let audits: Audit[] = [];
        if (expectedResult.body !== null) {
          audits = expectedResult.body;
        }
        expect(audits.length).toBe(1);
        expect(audits[0]).toEqual(audit);
      });

      it('should propagate not found response', () => {
        let expectedResult = 0;
        service.query(fakeRequest).subscribe(null, (error: HttpErrorResponse) => {
          expectedResult = error.status;
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
