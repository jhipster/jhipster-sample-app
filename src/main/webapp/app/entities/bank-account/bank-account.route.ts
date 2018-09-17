import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { BankAccount } from 'app/shared/model/bank-account.model';
import { BankAccountService } from './bank-account.service';
import { BankAccountComponent } from './bank-account.component';
import { BankAccountDetailComponent } from './bank-account-detail.component';
import { BankAccountUpdateComponent } from './bank-account-update.component';
import { BankAccountDeletePopupComponent } from './bank-account-delete-dialog.component';
import { IBankAccount } from 'app/shared/model/bank-account.model';

@Injectable({ providedIn: 'root' })
export class BankAccountResolve implements Resolve<IBankAccount> {
    constructor(private service: BankAccountService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(map((bankAccount: HttpResponse<BankAccount>) => bankAccount.body));
        }
        return of(new BankAccount());
    }
}

export const bankAccountRoute: Routes = [
    {
        path: 'bank-account',
        component: BankAccountComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'jhipsterSampleApplicationApp.bankAccount.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'bank-account/:id/view',
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
        path: 'bank-account/new',
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
        path: 'bank-account/:id/edit',
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

export const bankAccountPopupRoute: Routes = [
    {
        path: 'bank-account/:id/delete',
        component: BankAccountDeletePopupComponent,
        resolve: {
            bankAccount: BankAccountResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'jhipsterSampleApplicationApp.bankAccount.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
