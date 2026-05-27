import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

import { tap } from 'rxjs';

import { StateStorageService } from 'app/core/auth/state-storage.service';
import { LoginService } from 'app/login/login.service';

export const authExpiredInterceptor: HttpInterceptorFn = (req, next) => {
  const loginService = inject(LoginService);
  const stateStorageService = inject(StateStorageService);
  const router = inject(Router);

  return next(req).pipe(
    tap({
      error(err: HttpErrorResponse) {
        if (err.status === 401 && err.url && !err.url.includes('api/account')) {
          stateStorageService.storeUrl(router.routerState.snapshot.url);
          loginService.logout();
          router.navigate(['/login']);
        }
      },
    }),
  );
};
