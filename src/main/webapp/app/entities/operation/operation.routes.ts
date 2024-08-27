import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import OperationResolve from './route/operation-routing-resolve.service';

const operationRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/operation.component').then(m => m.OperationComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/operation-detail.component').then(m => m.OperationDetailComponent),
    resolve: {
      operation: OperationResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/operation-update.component').then(m => m.OperationUpdateComponent),
    resolve: {
      operation: OperationResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/operation-update.component').then(m => m.OperationUpdateComponent),
    resolve: {
      operation: OperationResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default operationRoute;
