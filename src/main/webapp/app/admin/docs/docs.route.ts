import { Route } from '@angular/router';

import { JhiDocsComponent } from './docs.component';

export const docsRoute: Route = {
  path: '',
  component: JhiDocsComponent,
  data: {
    pageTitle: 'global.menu.admin.apidocs'
  }
};
