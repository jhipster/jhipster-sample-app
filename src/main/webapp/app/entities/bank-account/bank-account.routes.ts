import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { BankAccountComponent } from './list/bank-account.component';
import { BankAccountDetailComponent } from './detail/bank-account-detail.component';
import { BankAccountUpdateComponent } from './update/bank-account-update.component';
import BankAccountResolve from './route/bank-account-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const bankAccountRoute: Routes = [
  {
    path: '',
    component: BankAccountComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: BankAccountDetailComponent,
    resolve: {
      bankAccount: BankAccountResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: BankAccountUpdateComponent,
    resolve: {
      bankAccount: BankAccountResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: BankAccountUpdateComponent,
    resolve: {
      bankAccount: BankAccountResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default bankAccountRoute;
