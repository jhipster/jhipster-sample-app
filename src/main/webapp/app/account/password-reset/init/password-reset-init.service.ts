import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';

import { Observable } from 'rxjs';

import { serverApiUrl } from 'app/config';

@Service()
export class PasswordResetInitService {
  private readonly http = inject(HttpClient);

  save(mail: string): Observable<{}> {
    return this.http.post(`${serverApiUrl}api/account/reset-password/init`, mail);
  }
}
