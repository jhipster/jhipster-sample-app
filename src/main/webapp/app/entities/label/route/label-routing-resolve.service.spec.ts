jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ILabel, Label } from '../label.model';
import { LabelService } from '../service/label.service';

import { LabelRoutingResolveService } from './label-routing-resolve.service';

describe('Service Tests', () => {
  describe('Label routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: LabelRoutingResolveService;
    let service: LabelService;
    let resultLabel: ILabel | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(LabelRoutingResolveService);
      service = TestBed.inject(LabelService);
      resultLabel = undefined;
    });

    describe('resolve', () => {
      it('should return existing ILabel for existing id', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: new Label(id) })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultLabel = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultLabel).toEqual(new Label(123));
      });

      it('should return new ILabel if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultLabel = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultLabel).toEqual(new Label());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultLabel = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultLabel).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
