import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IOperation, Operation } from 'app/shared/model/operation.model';
import { OperationService } from './operation.service';
import { OperationComponent } from './operation.component';
import { OperationDetailComponent } from './operation-detail.component';
import { OperationUpdateComponent } from './operation-update.component';

@Injectable({ providedIn: 'root' })
export class OperationResolve implements Resolve<IOperation> {
  constructor(private service: OperationService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IOperation> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((operation: HttpResponse<Operation>) => {
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

export const operationRoute: Routes = [
  {
    path: '',
    component: OperationComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'jhipsterSampleApplicationApp.operation.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: OperationDetailComponent,
    resolve: {
      operation: OperationResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'jhipsterSampleApplicationApp.operation.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: OperationUpdateComponent,
    resolve: {
      operation: OperationResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'jhipsterSampleApplicationApp.operation.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: OperationUpdateComponent,
    resolve: {
      operation: OperationResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'jhipsterSampleApplicationApp.operation.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];
