import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';

import { Observable } from 'rxjs';

import { serverApiUrl } from 'app/config';

@Service()
export class PasswordService {
  private readonly http = inject(HttpClient);

  save(newPassword: string, currentPassword: string): Observable<{}> {
    return this.http.post(`${serverApiUrl}api/account/change-password`, { currentPassword, newPassword });
  }
}
