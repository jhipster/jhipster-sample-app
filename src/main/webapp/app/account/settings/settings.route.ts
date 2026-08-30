import { Route } from '@angular/router';

import { userRouteAccessService } from 'app/core/auth';

import Settings from './settings';

const settingsRoute: Route = {
  path: 'settings',
  component: Settings,
  title: 'global.menu.account.settings',
  canActivate: [userRouteAccessService],
};

export default settingsRoute;
