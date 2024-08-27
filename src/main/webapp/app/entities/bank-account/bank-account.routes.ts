import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import BankAccountResolve from './route/bank-account-routing-resolve.service';

const bankAccountRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/bank-account.component').then(m => m.BankAccountComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/bank-account-detail.component').then(m => m.BankAccountDetailComponent),
    resolve: {
      bankAccount: BankAccountResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/bank-account-update.component').then(m => m.BankAccountUpdateComponent),
    resolve: {
      bankAccount: BankAccountResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/bank-account-update.component').then(m => m.BankAccountUpdateComponent),
    resolve: {
      bankAccount: BankAccountResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default bankAccountRoute;
