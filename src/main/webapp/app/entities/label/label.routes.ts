import { Routes } from '@angular/router';

import { ASC } from 'app/config';
import { userRouteAccessService } from 'app/core/auth';

import LabelResolve from './route/label-routing-resolve.service';

const labelRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/label').then(m => m.Label),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [userRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/label-detail').then(m => m.LabelDetail),
    resolve: {
      label: LabelResolve,
    },
    canActivate: [userRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/label-update').then(m => m.LabelUpdate),
    resolve: {
      label: LabelResolve,
    },
    canActivate: [userRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/label-update').then(m => m.LabelUpdate),
    resolve: {
      label: LabelResolve,
    },
    canActivate: [userRouteAccessService],
  },
];

export default labelRoute;
