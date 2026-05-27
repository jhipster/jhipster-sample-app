import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { tap } from 'rxjs';

import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';

export const errorHandlerInterceptor: HttpInterceptorFn = (req, next) => {
  const eventManager = inject(EventManager);

  return next(req).pipe(
    tap({
      error(err: HttpErrorResponse) {
        if (!(err.status === 401 && (err.message === '' || err.url?.includes('api/account')))) {
          eventManager.broadcast(new EventWithContent('jhipsterSampleApplicationApp.httpError', err));
        }
      },
    }),
  );
};
