import { Route } from '@angular/router';
import { JhiResolvePagingParams } from 'ng-jhipster';

import { AuditsComponent } from './audits.component';

export const auditsRoute: Route = {
  path: '',
  component: AuditsComponent,
  resolve: {
    pagingParams: JhiResolvePagingParams
  },
  data: {
    pageTitle: 'audits.title',
    defaultSort: 'auditEventDate,desc'
  }
};
