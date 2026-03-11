import { beforeEach, describe, expect, it, vitest } from 'vitest';
import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, convertToParamMap } from '@angular/router';

import { lastValueFrom, of, throwError } from 'rxjs';

import { UserManagementService } from '../service/user-management.service';

import userManagementResolve from './user-management-routing-resolve.service';

describe('UserManagement routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let service: UserManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    vitest.spyOn(mockRouter, 'navigate');
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    service = TestBed.inject(UserManagementService);
  });

  describe('resolve', () => {
    it('should return IUserManagement returned by find', async () => {
      // GIVEN
      service.find = vitest.fn(login => of({ login }));
      mockActivatedRouteSnapshot.params = { login: 'ABC' };

      // WHEN
      await new Promise<void>(resolve => {
        TestBed.runInInjectionContext(() => {
          userManagementResolve(mockActivatedRouteSnapshot).subscribe({
            next(result) {
              // THEN
              expect(service.find).toHaveBeenCalledWith('ABC');
              expect(result).toEqual({ login: 'ABC' });
              resolve();
            },
          });
        });
      });
    });

    it('should return null if id is not provided', async () => {
      // GIVEN
      service.find = vitest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      await new Promise<void>(resolve => {
        TestBed.runInInjectionContext(() => {
          userManagementResolve(mockActivatedRouteSnapshot).subscribe({
            next(result) {
              // THEN
              expect(service.find).not.toHaveBeenCalled();
              expect(result).toEqual(null);
              resolve();
            },
          });
        });
      });
    });

    it('should route to 404 page if data not found in server', async () => {
      // GIVEN
      vitest.spyOn(service, 'find').mockReturnValue(throwError(() => new HttpErrorResponse({ status: 404, statusText: 'Not Found' })));
      mockActivatedRouteSnapshot.params = { login: 'ABC' };

      // WHEN
      await TestBed.runInInjectionContext(async () => {
        await expect(lastValueFrom(userManagementResolve(mockActivatedRouteSnapshot))).rejects.toThrowError('no elements in sequence');
        // THEN
        expect(service.find).toHaveBeenCalledWith('ABC');
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });

    it('should route to error page if server returns an error other than 404', async () => {
      // GIVEN
      vitest
        .spyOn(service, 'find')
        .mockReturnValue(throwError(() => new HttpErrorResponse({ status: 500, statusText: 'Internal Server Error' })));
      mockActivatedRouteSnapshot.params = { login: 'ABC' };

      // WHEN
      await TestBed.runInInjectionContext(async () => {
        await expect(lastValueFrom(userManagementResolve(mockActivatedRouteSnapshot))).rejects.toThrowError('no elements in sequence');
        // THEN
        expect(service.find).toHaveBeenCalledWith('ABC');
        expect(mockRouter.navigate).toHaveBeenCalledWith(['error']);
      });
    });
  });
});
