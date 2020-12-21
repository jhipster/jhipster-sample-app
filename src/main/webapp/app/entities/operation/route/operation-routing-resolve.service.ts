import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IOperation, Operation } from '../operation.model';
import { OperationService } from '../service/operation.service';

@Injectable({ providedIn: 'root' })
export class OperationRoutingResolveService implements Resolve<IOperation> {
  constructor(private service: OperationService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IOperation> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((operation: HttpResponse<Operation>) => {
          if (operation.body) {
            return of(operation.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Operation());
  }
}
