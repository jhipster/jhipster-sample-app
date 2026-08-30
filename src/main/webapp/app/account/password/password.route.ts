import { Route } from '@angular/router';

import { userRouteAccessService } from 'app/core/auth';

import Password from './password';

const passwordRoute: Route = {
  path: 'password',
  component: Password,
  title: 'global.menu.account.password',
  canActivate: [userRouteAccessService],
};

export default passwordRoute;
