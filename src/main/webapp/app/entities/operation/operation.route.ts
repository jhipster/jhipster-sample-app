import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core';
import { Operation } from 'app/shared/model/operation.model';
import { OperationService } from './operation.service';
import { OperationComponent } from './operation.component';
import { OperationDetailComponent } from './operation-detail.component';
import { OperationUpdateComponent } from './operation-update.component';
import { OperationDeletePopupComponent } from './operation-delete-dialog.component';

@Injectable()
export class OperationResolve implements Resolve<any> {
    constructor(private service: OperationService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id);
        }
        return new Operation();
    }
}

export const operationRoute: Routes = [
    {
        path: 'operation',
        component: OperationComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'jhipsterSampleApplicationApp.operation.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'operation/:id/view',
        component: OperationDetailComponent,
        resolve: {
            operation: OperationResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'jhipsterSampleApplicationApp.operation.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'operation/new',
        component: OperationUpdateComponent,
        resolve: {
            operation: OperationResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'jhipsterSampleApplicationApp.operation.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'operation/:id/edit',
        component: OperationUpdateComponent,
        resolve: {
            operation: OperationResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'jhipsterSampleApplicationApp.operation.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const operationPopupRoute: Routes = [
    {
        path: 'operation/:id/delete',
        component: OperationDeletePopupComponent,
        resolve: {
            operation: OperationResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'jhipsterSampleApplicationApp.operation.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
