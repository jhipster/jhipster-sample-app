import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

import { EMPTY, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { UserManagementService } from '../service/user-management.service';
import { IUserManagement } from '../user-management.model';

const userManagementResolve = (route: ActivatedRouteSnapshot): Observable<null | IUserManagement> => {
  const login = route.params.login;
  if (login) {
    const router = inject(Router);
    const service = inject(UserManagementService);
    return service.find(login).pipe(
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

export default userManagementResolve;
