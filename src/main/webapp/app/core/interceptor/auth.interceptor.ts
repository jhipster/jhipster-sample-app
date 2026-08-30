import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { serverApiUrl } from 'app/config';
import { StateStorageService } from 'app/core/auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const stateStorageService = inject(StateStorageService);

  if (!req.url || (req.url.startsWith('http') && !(serverApiUrl && req.url.startsWith(serverApiUrl)))) {
    return next(req);
  }

  const token = stateStorageService.getAuthenticationToken();
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  return next(req);
};
