import { Service, inject } from '@angular/core';

import { Observable, mergeMap } from 'rxjs';

import { Account, AccountService, AuthServerProvider, Login } from 'app/core/auth';

@Service()
export class LoginService {
  private readonly accountService = inject(AccountService);
  private readonly authServerProvider = inject(AuthServerProvider);

  login(credentials: Login): Observable<Account | null> {
    return this.authServerProvider.login(credentials).pipe(mergeMap(() => this.accountService.identity(true)));
  }

  logout(): void {
    this.authServerProvider.logout().subscribe({ complete: () => this.accountService.authenticate(null) });
  }
}
