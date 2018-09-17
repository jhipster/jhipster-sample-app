import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Label } from 'app/shared/model/label.model';
import { LabelService } from './label.service';
import { LabelComponent } from './label.component';
import { LabelDetailComponent } from './label-detail.component';
import { LabelUpdateComponent } from './label-update.component';
import { LabelDeletePopupComponent } from './label-delete-dialog.component';
import { ILabel } from 'app/shared/model/label.model';

@Injectable({ providedIn: 'root' })
export class LabelResolve implements Resolve<ILabel> {
    constructor(private service: LabelService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(map((label: HttpResponse<Label>) => label.body));
        }
        return of(new Label());
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
