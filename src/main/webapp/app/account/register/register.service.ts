import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';

import { Observable } from 'rxjs';

import { serverApiUrl } from 'app/config';

import { Registration } from './register.model';

@Service()
export class RegisterService {
  private readonly http = inject(HttpClient);

  save(registration: Registration): Observable<{}> {
    return this.http.post(`${serverApiUrl}api/register`, registration);
  }
}
