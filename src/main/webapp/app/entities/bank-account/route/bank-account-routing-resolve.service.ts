import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

import { EMPTY, Observable, catchError, of } from 'rxjs';

import { IBankAccount } from '../bank-account.model';
import { BankAccountService } from '../service/bank-account.service';

const bankAccountResolve = (route: ActivatedRouteSnapshot): Observable<null | IBankAccount> => {
  const { id } = route.params;
  if (id) {
    const router = inject(Router);
    const service = inject(BankAccountService);
    return service.find(id).pipe(
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

export default bankAccountResolve;
