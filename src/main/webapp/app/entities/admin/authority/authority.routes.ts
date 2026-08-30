import { Routes } from '@angular/router';

import { userRouteAccessService } from 'app/core/auth';

import AuthorityResolve from './route/authority-routing-resolve.service';

const authorityRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/authority').then(m => m.Authority),
    data: {
      authorities: ['ROLE_ADMIN'],
    },
    canActivate: [userRouteAccessService],
  },
  {
    path: ':name/view',
    loadComponent: () => import('./detail/authority-detail').then(m => m.AuthorityDetail),
    resolve: {
      authority: AuthorityResolve,
    },
    data: {
      authorities: ['ROLE_ADMIN'],
    },
    canActivate: [userRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/authority-update').then(m => m.AuthorityUpdate),
    resolve: {
      authority: AuthorityResolve,
    },
    data: {
      authorities: ['ROLE_ADMIN'],
    },
    canActivate: [userRouteAccessService],
  },
];

export default authorityRoute;
