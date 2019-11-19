import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Label } from 'app/shared/model/label.model';
import { LabelService } from './label.service';
import { LabelComponent } from './label.component';
import { LabelDetailComponent } from './label-detail.component';
import { LabelUpdateComponent } from './label-update.component';
import { ILabel } from 'app/shared/model/label.model';

@Injectable({ providedIn: 'root' })
export class LabelResolve implements Resolve<ILabel> {
  constructor(private service: LabelService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ILabel> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(map((label: HttpResponse<Label>) => label.body));
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
