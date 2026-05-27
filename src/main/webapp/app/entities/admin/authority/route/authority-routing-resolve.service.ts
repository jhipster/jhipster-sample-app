import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

import { EMPTY, Observable, catchError, of } from 'rxjs';

import { IAuthority } from '../authority.model';
import { AuthorityService } from '../service/authority.service';

const authorityResolve = (route: ActivatedRouteSnapshot): Observable<null | IAuthority> => {
  const { name } = route.params;
  if (name) {
    const router = inject(Router);
    const service = inject(AuthorityService);
    return service.find(name).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          router.navigate(['404']);
        } else {
          router.navigate(['error']);
        }
        return EMPTY;
      }),
    );
  }

  return of(null);
};

export default authorityResolve;
