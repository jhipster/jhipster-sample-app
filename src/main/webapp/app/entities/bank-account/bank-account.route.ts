import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
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

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IBankAccount> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<BankAccount>) => response.ok),
                map((bankAccount: HttpResponse<BankAccount>) => bankAccount.body)
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

export const bankAccountPopupRoute: Routes = [
    {
        path: ':id/delete',
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
