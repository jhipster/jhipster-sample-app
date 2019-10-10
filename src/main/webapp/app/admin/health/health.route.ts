import { Route } from '@angular/router';

import { JhiHealthCheckComponent } from './health.component';

export const healthRoute: Route = {
  path: '',
  component: JhiHealthCheckComponent,
  data: {
    pageTitle: 'health.title'
  }
};
