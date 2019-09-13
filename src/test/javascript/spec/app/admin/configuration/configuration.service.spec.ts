import { TestBed } from '@angular/core/testing';

import { JhiConfigurationService } from 'app/admin/configuration/configuration.service';
import { SERVER_API_URL } from 'app/app.constants';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('Service Tests', () => {
  describe('Logs Service', () => {
    let service: JhiConfigurationService;
    let httpMock;
    let expectedResult;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule]
      });

      expectedResult = {};
      service = TestBed.get(JhiConfigurationService);
      httpMock = TestBed.get(HttpTestingController);
    });

    afterEach(() => {
      httpMock.verify();
    });

    describe('Service methods', () => {
      it('should call correct URL', () => {
        service.get().subscribe(() => {});

        const req = httpMock.expectOne({ method: 'GET' });
        const resourceUrl = SERVER_API_URL + 'management/configprops';
        expect(req.request.url).toEqual(resourceUrl);
      });

      it('should get the config', () => {
        const angularConfig = {
          contexts: {
            angular: {
              beans: ['test2']
            }
          }
        };
        service.get().subscribe(received => {
          expectedResult = received;
        });

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(angularConfig);
        expect(expectedResult).toEqual(['test2']);
      });

      it('should get the env', () => {
        const propertySources = {
          propertySources: [
            {
              name: 'server.ports',
              properties: {
                'local.server.port': {
                  value: 8080
                }
              }
            }
          ]
        };
        service.getEnv().subscribe(received => {
          expectedResult = received;
        });

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(propertySources);
        expect(expectedResult).toEqual({ 'server.ports': [{ key: 'local.server.port', val: 8080 }] });
      });
    });
  });
});
