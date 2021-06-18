jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IBankAccount, BankAccount } from '../bank-account.model';
import { BankAccountService } from '../service/bank-account.service';

import { BankAccountRoutingResolveService } from './bank-account-routing-resolve.service';

describe('Service Tests', () => {
  describe('BankAccount routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: BankAccountRoutingResolveService;
    let service: BankAccountService;
    let resultBankAccount: IBankAccount | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(BankAccountRoutingResolveService);
      service = TestBed.inject(BankAccountService);
      resultBankAccount = undefined;
    });

    describe('resolve', () => {
      it('should return IBankAccount returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultBankAccount = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultBankAccount).toEqual({ id: 123 });
      });

      it('should return new IBankAccount if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultBankAccount = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultBankAccount).toEqual(new BankAccount());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as BankAccount })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultBankAccount = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultBankAccount).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
