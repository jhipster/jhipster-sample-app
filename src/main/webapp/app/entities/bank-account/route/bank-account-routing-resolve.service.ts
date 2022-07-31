import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IBankAccount } from '../bank-account.model';
import { BankAccountService } from '../service/bank-account.service';

@Injectable({ providedIn: 'root' })
export class BankAccountRoutingResolveService implements Resolve<IBankAccount | null> {
  constructor(protected service: BankAccountService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IBankAccount | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((bankAccount: HttpResponse<IBankAccount>) => {
          if (bankAccount.body) {
            return of(bankAccount.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
