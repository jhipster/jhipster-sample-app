import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { OperationComponent } from './list/operation.component';
import { OperationDetailComponent } from './detail/operation-detail.component';
import { OperationUpdateComponent } from './update/operation-update.component';
import OperationResolve from './route/operation-routing-resolve.service';

const operationRoute: Routes = [
  {
    path: '',
    component: OperationComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: OperationDetailComponent,
    resolve: {
      operation: OperationResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: OperationUpdateComponent,
    resolve: {
      operation: OperationResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: OperationUpdateComponent,
    resolve: {
      operation: OperationResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default operationRoute;
