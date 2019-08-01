import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
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

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ILabel> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<Label>) => response.ok),
        map((label: HttpResponse<Label>) => label.body)
      );
    }
    return of(new Label());
  }
}

export const labelRoute: Routes = [
  {
    path: '',
    component: LabelComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'jhipsterSampleApplicationApp.label.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
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
    path: 'new',
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
    path: ':id/edit',
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
    path: ':id/delete',
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
