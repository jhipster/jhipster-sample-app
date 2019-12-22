import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IBankAccount, BankAccount } from 'app/shared/model/bank-account.model';
import { BankAccountService } from './bank-account.service';
import { BankAccountComponent } from './bank-account.component';
import { BankAccountDetailComponent } from './bank-account-detail.component';
import { BankAccountUpdateComponent } from './bank-account-update.component';

@Injectable({ providedIn: 'root' })
export class BankAccountResolve implements Resolve<IBankAccount> {
  constructor(private service: BankAccountService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IBankAccount> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((bankAccount: HttpResponse<BankAccount>) => {
          if (bankAccount.body) {
            return of(bankAccount.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new BankAccount());
  }
}

export const bankAccountRoute: Routes = [
  {
    path: '',
    component: BankAccountComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'jhipsterSampleApplicationApp.bankAccount.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: BankAccountDetailComponent,
    resolve: {
      bankAccount: BankAccountResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'jhipsterSampleApplicationApp.bankAccount.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: BankAccountUpdateComponent,
    resolve: {
      bankAccount: BankAccountResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'jhipsterSampleApplicationApp.bankAccount.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: BankAccountUpdateComponent,
    resolve: {
      bankAccount: BankAccountResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'jhipsterSampleApplicationApp.bankAccount.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];
