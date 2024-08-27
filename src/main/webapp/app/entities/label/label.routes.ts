import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import LabelResolve from './route/label-routing-resolve.service';

const labelRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/label.component').then(m => m.LabelComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/label-detail.component').then(m => m.LabelDetailComponent),
    resolve: {
      label: LabelResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/label-update.component').then(m => m.LabelUpdateComponent),
    resolve: {
      label: LabelResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/label-update.component').then(m => m.LabelUpdateComponent),
    resolve: {
      label: LabelResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default labelRoute;
