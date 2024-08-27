import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IBankAccount } from '../bank-account.model';
import { BankAccountService } from '../service/bank-account.service';

const bankAccountResolve = (route: ActivatedRouteSnapshot): Observable<null | IBankAccount> => {
  const id = route.params.id;
  if (id) {
    return inject(BankAccountService)
      .find(id)
      .pipe(
        mergeMap((bankAccount: HttpResponse<IBankAccount>) => {
          if (bankAccount.body) {
            return of(bankAccount.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default bankAccountResolve;
