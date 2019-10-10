import { Route } from '@angular/router';

import { JhiConfigurationComponent } from './configuration.component';

export const configurationRoute: Route = {
  path: '',
  component: JhiConfigurationComponent,
  data: {
    pageTitle: 'configuration.title'
  }
};
