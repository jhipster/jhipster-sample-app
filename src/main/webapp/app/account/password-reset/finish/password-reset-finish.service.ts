import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';

import { Observable } from 'rxjs';

import { serverApiUrl } from 'app/config';

@Service()
export class PasswordResetFinishService {
  private readonly http = inject(HttpClient);

  save(key: string, newPassword: string): Observable<{}> {
    return this.http.post(`${serverApiUrl}api/account/reset-password/finish`, { key, newPassword });
  }
}
