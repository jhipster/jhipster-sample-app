import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { LabelComponent } from './list/label.component';
import { LabelDetailComponent } from './detail/label-detail.component';
import { LabelUpdateComponent } from './update/label-update.component';
import LabelResolve from './route/label-routing-resolve.service';

const labelRoute: Routes = [
  {
    path: '',
    component: LabelComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: LabelDetailComponent,
    resolve: {
      label: LabelResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: LabelUpdateComponent,
    resolve: {
      label: LabelResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: LabelUpdateComponent,
    resolve: {
      label: LabelResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default labelRoute;
