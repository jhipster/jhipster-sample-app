import { Route } from '@angular/router';

import { JhiMetricsMonitoringComponent } from './metrics.component';

export const metricsRoute: Route = {
  path: 'metrics',
  component: JhiMetricsMonitoringComponent,
  data: {
    pageTitle: 'metrics.title'
  }
};
