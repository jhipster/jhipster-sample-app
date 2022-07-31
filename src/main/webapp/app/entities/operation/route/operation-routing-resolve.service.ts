import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IOperation } from '../operation.model';
import { OperationService } from '../service/operation.service';

@Injectable({ providedIn: 'root' })
export class OperationRoutingResolveService implements Resolve<IOperation | null> {
  constructor(protected service: OperationService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IOperation | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((operation: HttpResponse<IOperation>) => {
          if (operation.body) {
            return of(operation.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
