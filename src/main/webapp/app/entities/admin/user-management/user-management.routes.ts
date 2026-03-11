import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import UserManagementResolve from './route/user-management-routing-resolve.service';

const userManagementRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/user-management').then(m => m.UserManagement),
    data: {
      authorities: ['ROLE_ADMIN'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':login/view',
    loadComponent: () => import('./detail/user-management-detail').then(m => m.UserManagementDetail),
    resolve: {
      userManagement: UserManagementResolve,
    },
    data: {
      authorities: ['ROLE_ADMIN'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/user-management-update').then(m => m.UserManagementUpdate),
    resolve: {
      userManagement: UserManagementResolve,
    },
    data: {
      authorities: ['ROLE_ADMIN'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':login/edit',
    loadComponent: () => import('./update/user-management-update').then(m => m.UserManagementUpdate),
    resolve: {
      userManagement: UserManagementResolve,
    },
    data: {
      authorities: ['ROLE_ADMIN'],
    },
    canActivate: [UserRouteAccessService],
  },
];

export default userManagementRoute;
