import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IOperation } from '../operation.model';
import { OperationService } from '../service/operation.service';

const operationResolve = (route: ActivatedRouteSnapshot): Observable<null | IOperation> => {
  const id = route.params.id;
  if (id) {
    return inject(OperationService)
      .find(id)
      .pipe(
        mergeMap((operation: HttpResponse<IOperation>) => {
          if (operation.body) {
            return of(operation.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default operationResolve;
