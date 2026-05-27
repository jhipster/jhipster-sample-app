import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

import { EMPTY, Observable, catchError, of } from 'rxjs';

import { IOperation } from '../operation.model';
import { OperationService } from '../service/operation.service';

const operationResolve = (route: ActivatedRouteSnapshot): Observable<null | IOperation> => {
  const { id } = route.params;
  if (id) {
    const router = inject(Router);
    const service = inject(OperationService);
    return service.find(id).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          router.navigate(['404']);
        } else {
          router.navigate(['error']);
        }
        return EMPTY;
      }),
    );
  }

  return of(null);
};

export default operationResolve;
