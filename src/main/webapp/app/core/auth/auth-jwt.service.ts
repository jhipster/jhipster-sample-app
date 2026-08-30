import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';

import { Observable, map } from 'rxjs';

import { serverApiUrl } from 'app/config';

import { Login } from './login.model';
import { StateStorageService } from './state-storage.service';

type JwtToken = {
  id_token: string;
};

@Service()
export class AuthServerProvider {
  private readonly http = inject(HttpClient);
  private readonly stateStorageService = inject(StateStorageService);

  getToken(): string {
    return this.stateStorageService.getAuthenticationToken() ?? '';
  }

  login(credentials: Login): Observable<void> {
    return this.http
      .post<JwtToken>(`${serverApiUrl}api/authenticate`, credentials)
      .pipe(map(response => this.authenticateSuccess(response, credentials.rememberMe)));
  }

  logout(): Observable<void> {
    return new Observable(observer => {
      this.stateStorageService.clearAuthenticationToken();
      observer.complete();
    });
  }

  private authenticateSuccess(response: JwtToken, rememberMe: boolean): void {
    this.stateStorageService.storeAuthenticationToken(response.id_token, rememberMe);
  }
}
