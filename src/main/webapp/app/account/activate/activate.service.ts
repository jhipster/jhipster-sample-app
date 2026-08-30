import { HttpClient, HttpParams } from '@angular/common/http';
import { Service, inject } from '@angular/core';

import { Observable } from 'rxjs';

import { serverApiUrl } from 'app/config';

@Service()
export class ActivateService {
  private readonly http = inject(HttpClient);

  get(key: string): Observable<{}> {
    return this.http.get(`${serverApiUrl}api/activate`, {
      params: new HttpParams().set('key', key),
    });
  }
}
