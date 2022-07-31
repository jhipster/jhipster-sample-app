import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { LabelComponent } from '../list/label.component';
import { LabelDetailComponent } from '../detail/label-detail.component';
import { LabelUpdateComponent } from '../update/label-update.component';
import { LabelRoutingResolveService } from './label-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const labelRoute: Routes = [
  {
    path: '',
    component: LabelComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: LabelDetailComponent,
    resolve: {
      label: LabelRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: LabelUpdateComponent,
    resolve: {
      label: LabelRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: LabelUpdateComponent,
    resolve: {
      label: LabelRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(labelRoute)],
  exports: [RouterModule],
})
export class LabelRoutingModule {}
