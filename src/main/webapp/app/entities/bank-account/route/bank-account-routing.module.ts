import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { BankAccountComponent } from '../list/bank-account.component';
import { BankAccountDetailComponent } from '../detail/bank-account-detail.component';
import { BankAccountUpdateComponent } from '../update/bank-account-update.component';
import { BankAccountRoutingResolveService } from './bank-account-routing-resolve.service';

const bankAccountRoute: Routes = [
  {
    path: '',
    component: BankAccountComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: BankAccountDetailComponent,
    resolve: {
      bankAccount: BankAccountRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: BankAccountUpdateComponent,
    resolve: {
      bankAccount: BankAccountRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: BankAccountUpdateComponent,
    resolve: {
      bankAccount: BankAccountRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(bankAccountRoute)],
  exports: [RouterModule],
})
export class BankAccountRoutingModule {}
