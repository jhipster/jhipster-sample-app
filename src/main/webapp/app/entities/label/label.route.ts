import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core';
import { Label } from 'app/shared/model/label.model';
import { LabelService } from './label.service';
import { LabelComponent } from './label.component';
import { LabelDetailComponent } from './label-detail.component';
import { LabelUpdateComponent } from './label-update.component';
import { LabelDeletePopupComponent } from './label-delete-dialog.component';

@Injectable()
export class LabelResolve implements Resolve<any> {
    constructor(private service: LabelService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id);
        }
        return new Label();
    }
}

export const labelRoute: Routes = [
    {
        path: 'label',
        component: LabelComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'jhipsterSampleApplicationApp.label.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'label/:id/view',
        component: LabelDetailComponent,
        resolve: {
            label: LabelResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'jhipsterSampleApplicationApp.label.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'label/new',
        component: LabelUpdateComponent,
        resolve: {
            label: LabelResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'jhipsterSampleApplicationApp.label.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'label/:id/edit',
        component: LabelUpdateComponent,
        resolve: {
            label: LabelResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'jhipsterSampleApplicationApp.label.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const labelPopupRoute: Routes = [
    {
        path: 'label/:id/delete',
        component: LabelDeletePopupComponent,
        resolve: {
            label: LabelResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'jhipsterSampleApplicationApp.label.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
