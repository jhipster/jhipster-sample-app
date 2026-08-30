import { inject, isDevMode } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';

import { map } from 'rxjs';

import { AccountService } from './account.service';
import { StateStorageService } from './state-storage.service';

export const userRouteAccessService: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const accountService = inject(AccountService);
  const router = inject(Router);
  const stateStorageService = inject(StateStorageService);
  return accountService.identity().pipe(
    map(account => {
      if (account) {
        const { authorities } = next.data;

        if (!authorities?.length || accountService.hasAnyAuthority(authorities)) {
          return true;
        }

        if (isDevMode()) {
          console.error('User does not have any of the required authorities:', authorities);
        }
        router.navigate(['accessdenied']);
        return false;
      }

      stateStorageService.storeUrl(state.url);
      router.navigate(['/login']);
      return false;
    }),
  );
};
