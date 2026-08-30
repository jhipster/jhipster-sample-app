import { Routes } from '@angular/router';

import { ASC } from 'app/config';
import { userRouteAccessService } from 'app/core/auth';

import BankAccountResolve from './route/bank-account-routing-resolve.service';

const bankAccountRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/bank-account').then(m => m.BankAccount),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [userRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/bank-account-detail').then(m => m.BankAccountDetail),
    resolve: {
      bankAccount: BankAccountResolve,
    },
    canActivate: [userRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/bank-account-update').then(m => m.BankAccountUpdate),
    resolve: {
      bankAccount: BankAccountResolve,
    },
    canActivate: [userRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/bank-account-update').then(m => m.BankAccountUpdate),
    resolve: {
      bankAccount: BankAccountResolve,
    },
    canActivate: [userRouteAccessService],
  },
];

export default bankAccountRoute;
